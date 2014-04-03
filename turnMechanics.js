var db = require('./db.js');
var playerModels = require('./models/playerModel.js');
var gameboardModel = require('./models/gameboardModel.js');
var turnMechanics = this;

//reset the game, put all players back to $1500 on 0 area
this.resetGame = function(callback) {
    var resetCondition = {},  //no conditions, we want them all
        resetUpdate = { $set: { currentGameArea: 0, money: 1500, properties: [] } },
        resetOptions = { multi: true };

    playerModels.Player.update(resetCondition, resetUpdate, resetOptions, function(err, numAffected) {
        if (err) return console.log("failed to reset game");
        callback();
    });
}

this.takeTurnStep = function(callback) {
    playerModels.Player.find(function(err, data) {
        if (err) return console.log("failed to get players");

        data.forEach(function(element, index, array) {
            turnMechanics.takeTurn(element, 0);
        });

        callback();
    });
}

this.takeTurn = function(player, numDoubles) {
    if (numDoubles == 3) {
        player = goToJail(player);
        player.save(function(err) {
	        if (err) console.log("error in saving the player");   
	    });
        return;
    }

    var dice = turnMechanics.rollDice();

    player.currentGameArea = (player.currentGameArea + dice.value) % 40;
    gameboardModel.GameArea.findOne({ 'index': player.currentGameArea }, function(err, gameArea) {
        if (err) console.log("error in saving the player");

        console.log("player ", player.name , " landed on game area ", gameArea.name);

        turnMechanics.applyGameArea(player, gameArea, function() {
            console.log("we turn a turn, bitch");
        });
    });

    player.save(function(err) {
	    if (err) console.log("error in saving the player"); 
        
        if (dice.isDouble) {
            console.log("player ", player.name, " rolled doubles!");
            turnMechanics.takeTurn(player, numDoubles + 1);
        }       
	});

    console.log(player.name);
}

this.rollDice = function() {
    var x = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    var y = Math.floor(Math.random() * ((6 - 1) + 1) + 1);
    return {
        value: x + y,
        isDouble: x == y
        };
}

this.goToJail = function(player) {
    player.inJail = true;
    return player;
}

this.applyGameArea = function (player, gamearea, callback) {
    //if it's a property and the player can afford it, auto buy it for now
    if (gamearea.value && player.money >= gamearea.value) {
        player.money -= gamearea.value;
        player.properties.push({
            id: gamearea.id,
            percentage: 1
        });
        player.save(function(err) {
	 	    if (err) console.log("error in saving the player");
            console.log("player ", player.name, " bought ", gamearea.name);
            callback();
  	    });
    } else {
        console.log("player ", player.name, " did not land on a property");
        callback();  //this is only temp
    }
}