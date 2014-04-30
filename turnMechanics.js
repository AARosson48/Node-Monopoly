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
// 3) All players buy stock.
this.takeTurnStep = function ( callback ) {
    playerModel.Player.find( function ( err, players ) {
        if ( err ) return console.log( "failed to get players" );

        var postStepOnePlayers = [];
        var postStepTwoPlayers = [];
        //var turnStepMutex = new mutex.Mutex( players.length, function () {

        //    //the following code works, please don't spam me
        //    //mail.sendEmail(function() {
        //    //    console.log("we sent an email");
        //    //});
        //    callback( newPlayers );
        //});

        // TODO Soupy: Buy properties... which will have to changed once emailed.
        var thirdTurnStepMutex = new mutex.Mutex( players.length, function () {
            justThePlayers = [];
            postStepTwoPlayers.forEach( function ( playerTuple ) {
                var player = playerTuple[0];
                justThePlayers.push( player );
                var gameareas = playerTuple[1];
                var buyAllMutex = new mutex.Mutex( gameareas.length, function () {
                    player.save( function ( err ) {
                        if ( err ) console.log( "error saving player after moving" );
                    });
                });
                gameareas.forEach( function ( gamearea ) {
                    turnMechanics.applyGameAreaBuy( player, gamearea, function ( property, cost ) {
                        if ( property != undefined ) {
                            player.properties.push( property );
                            player.money -= cost;
                        }
                        buyAllMutex.decrement();
                    });
                }, [] );

            }, [] );
            callback( justThePlayers );
        });
        var secondTurnStepMutex = new mutex.Mutex( players.length, function () {
            playerMoneyDifference = {}; // Dictionary to playerID and money gain/loss.

            // Get the payments.
            postStepOnePlayers.forEach( function ( playerTuple ) {
                var player = playerTuple[0];
                var gameareas = playerTuple[1];
                gameareas.forEach( function ( gamearea ) {
                    rentCalculations.calculateAndApplyRentPay( player, gamearea, function ( playerMoneyDifferenceStep ) {
                        Object.keys( playerMoneyDifferenceStep ).forEach( function ( playerId ) {
                            var amountForCurrentPlayer = playerMoneyDifferenceStep[playerId];
                            if ( playerMoneyDifference[playerId] == undefined ) {
                                playerMoneyDifference[playerId] = amountForCurrentPlayer;
                            } else {
                                playerMoneyDifference[playerId] += amountForCurrentPlayer;
                            }
                        }, [] );
                    });
                }, [] );

            }, [] );

            // Save the players and move to next step.
            postStepOnePlayers.forEach( function ( playerTuple ) {
                var player = playerTuple[0];
                var gameareas = playerTuple[1];
                var messages = playerTuple[2];
                if ( playerMoneyDifference[player.id] != undefined ) {
                    player.money += playerMoneyDifference[player.id];
                }
                player.save( function ( err ) {
                    if ( err ) console.log( "error saving player after moving" );
                    postStepTwoPlayers.push( [player, gameareas, messages] );
                    thirdTurnStepMutex.decrement();
                });
            }, [] );
        });

        // 1 PLAYERS MOVE
        players.forEach( function ( player ) {
            turnMechanics.movePlayer( player, 0, [], [], function ( playerRef, gameareas, messages ) {
                playerRef.save( function ( err ) {
                    if ( err ) console.log( "error saving player after moving" );
                    postStepOnePlayers.push( [playerRef, gameareas, messages] );
                    secondTurnStepMutex.decrement();
                });
            });
        }, [] );
    });
}

// Responsible for taking one player's individual turn.
this.movePlayer = function ( player, numDoubles, gameareas, messages, callback ) {

    var dice = turnMechanics.rollDice();
    var newLocation = player.currentGameArea + dice.value;

    if ( player.inJail ) {  // Gotta love JS truthy statements :)
        player = turnMechanics.surviveJail( player, dice );
        if ( player.inJail ) { // If the player is still in jail after checking survival, then (s)he's done for.
            callback( player, gameareas, messages );
        }
    }
    if ( numDoubles == 2 && dice.isDouble ) {
        // Something like this, idk, haven't worked it out yet
        messages.push( "You've rolled three doubles in a row.  You've been thrown in jail!" );
        callback( turnMechanics.goToJail( player ), gameareas, messages );

    } else {
        //when pass go, add $200
        if ( newLocation >= 40 ) {
            messages.push( "You've passed go and collected $200." );
            player.money += 200;
        }
        player.currentGameArea = newLocation % 40;

        turnMechanics.getGameAreaFromIndex( player.currentGameArea, function ( gameArea ) {
            //find the new game area they landed on and apply it
            console.log( player.name, " landed on game area ", gameArea.name );
            gameareas.push( gameArea );

            var playerAndMessage = turnMechanics.applyGameAreaMove( player, gameArea );
            player = playerAndMessage[0];
            messages.push( playerAndMessage[1] );

            if ( dice.isDouble && !player.inJail ) {
                console.log( player.name, " rolled doubles!" );
                turnMechanics.movePlayer( player, numDoubles + 1, gameareas, messages, callback );
            } else {
                callback( player, gameareas, messages );
            }
        });
    }

}

this.payPlayers = function ( player, numDoubles, callback ) {

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

//go get the game area from the db, given it's index
this.getGameAreaFromIndex = function ( gameIndex, callback ) {
    gameboardModel.GameArea.findOne( { 'index': gameIndex }, function ( err, gameArea ) {
        if ( err ) console.log( "we couldn't find the gamearea with index:" + gameIndex );
        callback( gameArea );
    });
}

// Applies the effects of a game area to an individual player.
// Will have to tie into email because user will affect what happens.
this.applyGameAreaMove = function ( player, gamearea, callback ) {

    var message = "";
    if ( gamearea.name == "Income Tax" ||
        gamearea.name == "Luxury Tax" ) {
        player.money -= gamearea.value;
        message = "You've landed on Luxury Tax and have paid $" + gamearea.value + " in taxes";
        console.log( player.name + " landed on " + gamearea.name + " and paid " + gamearea.value + " in taxes." );
    } else if ( gamearea.name == "Chance" ) {
        chanceAndChestMechanics.drawChanceCard( player, function () {
            //idk... whatever we do after they process that card...
        });
    } else if ( gamearea.name == "Community Chest" ) {
        chanceAndChestMechanics.drawCommChestCard( player, function () {
            // same as above...    
        });
    } else if ( gamearea.name == "Go To Jail" ) {
        message = "You've landed on 'Go To Jail' and were immediately arrented for piggy backing someone into the building.";
        player = turnMechanics.goToJail( player );
    } else if ( gamearea.value ) {
        //if it's a property and the player can afford it, auto buy it for now
        message = "You've landed on " + gamearea.name + ".";

    } else {
        message = "You've helped us find a critical error :D";
        console.log( player.name + " landed on " + gamearea.name + " and I don't know what to do" );
    }
    return [player, message];
}
this.applyGameAreaBuy = function ( player, gamearea, callback ) {
    if ( gamearea.baseRent && player.money >= gamearea.value ) {
        //if it's a property and the player can afford it, auto buy it for now

        // Checks if user wants to buy the area.
        var testUserAction = Math.random();
        if ( testUserAction < .333 ) {
            callback( {
                _id: gamearea.id,
                percentage: 1
            }, gamearea.value );
            console.log( player.name, " bought ", gamearea.name );
        } else if ( testUserAction < .667 ) {
            callback( {
                _id: gamearea.id,
                percentage: 2
            }, gamearea.value * 2 );
            console.log( player.name, " bought 2 ", gamearea.name );
        } else {
            callback( {
                _id: gamearea.id,
                percentage: 3
            }, gamearea.value * 3 );
            console.log( player.name, " bought 3 ", gamearea.name );
        }

    } else {
        console.log( player.name + " landed on " + gamearea.name + " and I don't know what to do" );
    }
    callback( undefined, undefined );
}
