//reset the game, put all players back to $1500 on 0 area
this.resetGame = function ( callback ) {
    var resetCondition = {},  //no conditions, we want them all
        resetUpdate = {
            $set: {
                currentGameArea: 0,
                money: 1500,
                properties: [],
                inJail: 0,
                getOutOfJailCardsNum: 0
            }
        },
        resetOptions = { multi: true };

    playerModel.Player.update( resetCondition, resetUpdate, resetOptions, function ( err, numAffected ) {
        if ( err ) return console.log( "failed to reset game" );
        callback();
    });
}

var PLAYER_MOVE = 0;
var PAY_PLAYERS = 1;
var BUY_STOCK = 2;

//responsible for taking one turn for all players
// Split up into 3 sections:
// 1) All players move.
// a) Player takes chance/comm chest and does action.
// b) callback takes a list of gameareas landed on.
// c) callback also takes a list of messages.
// 2) All players pay other players.
// 3) All players get emailed about what actions they can perform
// a) All players will also get saved (before replying to email). *NOT DONE YET*
// b) All players buy stock and/or get out of jail, perform any other action specified in email.
this.takeTurnStep = function ( callback ) {
    playerModel.Player.find( function ( err, players ) {
        if ( err ) return console.log( "failed to get players" );

        var postStepOnePlayers = [];
        var postStepTwoPlayers = [];
        var justThePlayers = [];
        var gameAreaToPlayerMap = gameAreaManager.getGameAreaToPlayerMap( players );
        //var turnStepMutex = new mutex.Mutex( players.length, function () {

        //    //the following code works, please don't spam me
        //    //mail.sendEmail(function() {
        //    //    console.log("we sent an email");
        //    //});
        //    callback( newPlayers );
        //});
        var callbackMutex = new mutex.Mutex( players.length, function () {
            callback( justThePlayers );
        });

        // TODO Soupy: Buy properties... which will have to changed once emailed.
        var thirdTurnStepMutex = new mutex.Mutex( players.length, function () {
            console.log( "STEP 3" );
            postStepTwoPlayers.forEach( function ( playerTuple ) {
                var player = playerTuple[0];
                justThePlayers.push( player );
                var gameareas = playerTuple[1];

                if ( player.name == "Entry 0" ) {
                    var messages = playerTuple[2];
                    var body = "";
                    messages.forEach( function ( mess ) {
                        body += mess + "<br/>";
                    }, [] );
                    body += "<br/>You've landed on:<br/>";
                    gameareas.forEach( function ( area ) {
                        body += area.name + "<br/>";
                    }, [] );
                    mail.sendEmail( body, function () {
                        console.log( "we sent an email" );
                    });
                }

                // This will have to change once we actually get emails to work.
                gameareas.forEach( function ( gamearea ) {
                    var propTuple = turnMechanics.applyGameAreaBuy( player, gamearea );
                    var property = propTuple.prop;
                    var cost = propTuple.money;
                    if ( property != undefined ) {
                        player = gameAreaManager.PurchaseProperty(player, property, cost);
                    }
                }, [] );

                player.save( function ( err ) {
                    if ( err ) {
                        console.log( "error saving player during STEP 3" );
                    }
                    callbackMutex.decrement();
                });
            }, [] );
        });

        // 1 PLAYERS MOVE
        console.log( "STEP 1" );
        players.forEach( function ( player ) {
            postStepOnePlayers.push( turnMechanics.movePlayer( player, 0, [], [] ) );
        }, [] );

        console.log( "STEP 2" );
        playerMoneyDifference = {}; // Dictionary to playerID and money gain/loss.

        // Get the payments.
        postStepOnePlayers.forEach( function ( playerTuple ) {
            var player = playerTuple[0];
            var gameareas = playerTuple[1];
            var messages = playerTuple[2];
            gameareas.forEach( function ( gamearea ) {

                playerMoneyDifferenceStep = rentCalculations.calculateAndApplyRentPay( player, gamearea, gameAreaToPlayerMap );

                Object.keys( playerMoneyDifferenceStep ).forEach( function ( playerId ) {
                    var amountForCurrentPlayer = playerMoneyDifferenceStep[playerId];
                    if ( playerMoneyDifference[playerId] == undefined ) {
                        playerMoneyDifference[playerId] = amountForCurrentPlayer;
                    } else {
                        playerMoneyDifference[playerId] += amountForCurrentPlayer;
                    }
                }, [] );
            }, [] );
        }, [] );

        // Save the players and move to next step.
        postStepOnePlayers.forEach( function ( playerTuple ) {
            var player = playerTuple[0];
            var gameareas = playerTuple[1];
            var messages = playerTuple[2];
            if ( playerMoneyDifference[player.id] != undefined ) {
                if ( playerMoneyDifference[player.id] > 500 )
                    console.log( player.name + " recieved '$" + playerMoneyDifference[player.id] + "'" );
                player.money += playerMoneyDifference[player.id];
                if ( playerMoneyDifference[player.id] < 0 ) {
                    messages.push( "you've lost $" + playerMoneyDifference[player.id] );
                } else if ( playerMoneyDifference[player.id] > 0 ) {
                    messages.push( "you've gained $" + playerMoneyDifference[player.id] );
                }
            }
            postStepTwoPlayers.push( [player, gameareas, messages] );
            thirdTurnStepMutex.decrement();
        }, [] );

    });
}

// Responsible for taking one player's individual turn.
this.movePlayer = function ( player, numDoubles, gameareas, messages ) {

    var dice = turnMechanics.rollDice();
    var newLocation = player.currentGameArea + dice.value;

    if ( player.inJail ) {  // Gotta love JS truthy statements :)
        player = turnMechanics.surviveJail( player, dice );
        if ( player.inJail ) { // If the player is still in jail after checking survival, then (s)he's done for.
            return [player, gameareas, messages];
        }
    }
    if ( numDoubles == 2 && dice.isDouble ) {
        // Something like this, idk, haven't worked it out yet
        messages.push( "You've rolled three doubles in a row.  You've been thrown in jail!" );
        return [turnMechanics.goToJail( player ), gameareas, messages];

    }
    //when pass go, add $200
    if ( newLocation >= 40 ) {
        messages.push( "You've passed go and collected $200." );
        player.money += 200;
    }
    player.currentGameArea = newLocation % 40;


    var gameArea = gameAreaManager.gameAreaMap[player.currentGameArea];
    gameareas.push( gameArea );

    var playerAndMessage = turnMechanics.applyGameAreaMove( player, gameArea );
    player = playerAndMessage[0];
    messages.push( playerAndMessage[1] );

    if ( dice.isDouble && !player.inJail ) {
        //console.log( player.name, " rolled doubles!" );
        return turnMechanics.movePlayer( player, numDoubles + 1, gameareas, messages );
    }
    return [player, gameareas, messages];
}

this.buyStock = function ( player, numDoubles, callback ) {

}


// Rolls two dice, also returns if they are doubles or not
this.rollDice = function () {
    var x = Math.floor( Math.random() * ( ( 6 - 1 ) + 1 ) + 1 );
    var y = Math.floor( Math.random() * ( ( 6 - 1 ) + 1 ) + 1 );
    return {
        value: x + y,
        isDouble: x == y
    };
}

// Puts a player into jail
this.goToJail = function ( player ) {
    player.inJail = 1;  //we're on our 1st day in jail
    player.currentGameArea = 10;  //go to "Just Visiting"
    return player
}

//attempts to get a player out of jail
this.surviveJail = function ( player, dice ) {

    if ( dice.isDouble || player.inJail == 4 ) {
        player.inJail = 0;
    } else if ( player.getOutOfJailCardsNum > 0 ) {
        player.inJail = 0;
        player.getOutOfJailCardsNum--; // Auto use right meow...
    } else {
        // Not today sucka, try again next week
        player.inJail++;
    }
    //we will need to think about another form of surviving jail if a player wants to pay $50.
    //this will need to be asked in an email (in addition to using the get out of jail free card.
    return player;
}

// Applies the effects of a game area to an individual player.
// Will have to tie into email because user will affect what happens.
this.applyGameAreaMove = function ( player, gamearea ) {

    var message = "";
    if ( gamearea.name == "Income Tax" ||
        gamearea.name == "Luxury Tax" ) {
        player.money -= gamearea.value;
        message = "You've landed on Luxury Tax and have paid $" + gamearea.value + " in taxes";
        //console.log( player.name + " landed on " + gamearea.name + " and paid " + gamearea.value + " in taxes." );
    } else if ( gamearea.name == "Chance" ) {
        //chanceAndChestMechanics.drawChanceCard( player, function () {
        //idk... whatever we do after they process that card...
        //});
    } else if ( gamearea.name == "Community Chest" ) {
        //chanceAndChestMechanics.drawCommChestCard( player, function () {
        // same as above...    
        //});
    } else if ( gamearea.name == "Go To Jail" ) {
        message = "You've landed on 'Go To Jail' and were immediately arrented for piggy backing someone into the building.";
        player = turnMechanics.goToJail( player );
    } else if ( gamearea.value ) {
        //if it's a property and the player can afford it, auto buy it for now
        message = "You've landed on " + gamearea.name + ".";

    } else {
        message = "You've helped us find a critical error :D";
        //console.log( player.name + " landed on " + gamearea.name + " and I don't know what to do" );
    }
    return [player, message];
}
this.applyGameAreaBuy = function ( player, gamearea ) {
    if ( gamearea.baseRent && player.money >= gamearea.value ) {
        //if it's a property and the player can afford it, auto buy it for now

        // Checks if user wants to buy the area.
        var testUserAction = Math.random();
        if ( testUserAction < .333 ) {
            return {
                prop: {
                    _id: gamearea.id,
                    percentage: 1
                },
                money: gamearea.value
            };
            //console.log( player.name, " bought ", gamearea.name );
        } else if ( testUserAction < .667 ) {
            return {
                prop: {
                    _id: gamearea.id,
                    percentage: 2
                },
                money: gamearea.value * 2
            };
            //console.log( player.name, " bought 2 ", gamearea.name );
        } else {
            return {
                prop: {
                    _id: gamearea.id,
                    percentage: 3
                },
                money: gamearea.value * 3
            };
            //console.log( player.name, " bought 3 ", gamearea.name );
        }

    }
    return {
        prop: undefined,
        money: 0
    };
}
