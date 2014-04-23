//reset the game, put all players back to $1500 on 0 area
this.resetGame = function(callback) {
    var resetCondition = {},  //no conditions, we want them all
        resetUpdate = { $set: { 
            currentGameArea: 0, 
            money: 1500, 
            properties: [], 
            inJail: 0, 
            getOutOfJailCardsNum: 0 } 
        },
        resetOptions = { multi: true };

    playerModel.Player.update(resetCondition, resetUpdate, resetOptions, function(err, numAffected) {
        if (err) return console.log("failed to reset game");
        callback();
    });
}

//responsible for taking one turn for all players
this.takeTurnStep = function(callback) {
    playerModel.Player.find(function(err, players) {
        if (err) return console.log("failed to get players");

        var newPlayers = [],
        turnStepMutex = new mutex.Mutex(players.length, function() {

            //the following code works, please don't spam me
            //mail.sendEmail(function() {
            //    console.log("we sent an email");
            //});
            callback(newPlayers);
        });
        
        players.forEach(function(player) {
            turnMechanics.takeTurn(player, 0, function(player) {
                newPlayers.push(player);
                turnStepMutex.decrement();
            });
        },[]);
    });
}

//responsible for taking one player's individual turn
this.takeTurn = function(player, numDoubles, callback) {

    var dice = turnMechanics.rollDice();
    var newLocation = player.currentGameArea + dice.value;

    if (player.inJail) {  //gotta love JS truthy statements :)
        //attempt to get them out of jail
        turnMechanics.surviveJail(player, dice, function(player) {
            player.save(function(err) {
                if (err) console.log("error saving player after jail survival");
                callback(player);    
            });
        });
    } else {
        if (numDoubles == 2 && dice.isDouble) {
            //something like this, idk, haven't worked it out yet
            turnMechanics.goToJail(player, function(player) {
                player.save(function(err) {   //this might not work, needs to be tested - may need to call some callback
	                if (err) console.log("error in saving the player when going to jail");   
	            });
             });
        } else {
            //when pass go, add $200
            if (newLocation >= 40) player.money += 200;
            player.currentGameArea = newLocation % 40;

            turnMechanics.getGameAreaFromIndex(player.currentGameArea, function(gameArea) {
                //find the new game area they landed on and apply it
                console.log(player.name , " landed on game area ", gameArea.name);
                
                //we need to calculate all player's rent payout before we do any purchase math -- not sure how to do this quite yet...
                //technically this will be a non-issue in final game, but we might want to do it right anyway...
                
                var applyGameArea = function() {
                    turnMechanics.applyGameArea( player, gameArea, function ( newPlayer ) {
                        if ( dice.isDouble && !newPlayer.inJail) {
                            console.log( player.name, " rolled doubles!" );
                            turnMechanics.takeTurn( newPlayer, numDoubles + 1, callback );
                        } else {
                            newPlayer.save( function ( err ) {
                                if ( err ) console.log( "error in saving the player" );
                                callback( newPlayer );
                            });
                        }
                    });
                }; 

                applyGameArea();

                /////////////////////////////////////////////////////////////////////////////////////
                //we will need to do something like this, but all rent payments need to happen     //
                //before purchase decisions are made.  Simon, I've leaving this to you, good luck. //
                /////////////////////////////////////////////////////////////////////////////////////

                //if (gameArea.baseRent) {  //truthy statement, lol
                //    turnMechanics.calculateAndApplyRentPay(player, gameArea, function() {
                //        applyGameArea();
                //    });
                //} else applyGameArea();      
            });        
        }
    }  
}


//rolls two dice, also returns if they are doubles or not
this.rollDice = function() {
    var x = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    var y = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    return {
        value: x + y,
        isDouble: x == y
    };
}

//puts a player into jail
this.goToJail = function(player, callback) {
    player.inJail = 1;  //we're on our 1st day in jail
    player.currentGameArea = 10;  //go to "Just Visiting"
    callback(player);
}

//attempts to get a player out of jail
this.surviveJail = function(player, dice, callback) {
    var surviveJail = function() {
        //you survive! move forward that many spaces
        player.currentGameArea = (player.currentGameArea + dice.value) % 40;
        turnMechanics.getGameAreaFromIndex(player.currentGameArea, function(gamearea) {
            turnMechanics.applyGameArea(player, gamearea, function(newPlayer) {
                newPlayer.save(function(err) {
                    if (err) console.log( "error in saving the player" );
                    callback(newPlayer);
                });
            });
        });
    };

    if (dice.isDouble || player.inJail == 4) {
        surviveJail();
    } else if(player.getOutOfJailCardsNum > 0) {
        player.getOutOfJailCardsNum--;
        surviveJail();
    } else {
        //not today sucka, try again next week
        player.inJail++;
        callback(player);    
    }
    //we will need to think about another form of surviving jail if a player wants to pay $50.
    //this will need to be asked in an email
}

//go get the game area from the db, given it's index
this.getGameAreaFromIndex = function(gameIndex, callback){
    gameboardModel.GameArea.findOne({ 'index': gameIndex }, function(err, gameArea) {
        if (err) console.log("we couldn't find the gamearea with index:" + gameIndex);
        callback(gameArea);
    });
}

//applys the effects of a game area to an individual player
this.applyGameArea = function (player, gamearea, callback) {
    
    if (gamearea.name == "Income Tax" ||
        gamearea.name == "Luxury Tax") {
            player.money -= gamearea.value;
            console.log(player.name + " landed on " + gamearea.name + " and paid " + gamearea.value + " in taxes.");
    } else if (gamearea.value && player.money >= gamearea.value) {
        //if it's a property and the player can afford it, auto buy it for now

        rentCalculations.calculateAndApplyRentPay(player, gamearea, function(stuff) {
            console.log("we got stuff");    
        });

        player.money -= gamearea.value;
        player.properties.push({
            _id: gamearea.id,
            percentage: 1
        });
        console.log(player.name, " bought ", gamearea.name);
    } else if (gamearea.name == "Chance"){
        chanceAndChestMechanics.drawChanceCard(player, function() {
            //idk... whatever we do after they process that card...
        });
    } else if (gamearea.name == "Community Chest") {
        chanceAndChestMechanics.drawCommChestCard(player, function() {
            // same as above...    
        });  
    } else if (gamearea.name == "Go To Jail") {
        turnMechanics.goToJail(player, function(newPlayer) {
            player = newPlayer;
        });
    } else {
        console.log(player.name + " landed on " + gamearea.name + " and I don't know what to do");
    }
    callback(player);
}
