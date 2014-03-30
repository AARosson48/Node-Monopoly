var app = require("../app");
var db = require("../db");
var gameboardModel = require("../models/gameboardModel");
var playerModel = require("../models/playerModel");
var turnMechanics = require("./../turnMechanics");

//app.get('/newarea', function(req, res) {
//     var gameArea = new GameArea({
//	 	name: "Park Place",
//        value: 10000,
//        index: 0
//	 });

//	 gameArea.save(function(err) {
//	 	if (err) console.log("error in saving the user");
//            res.render('user', { 
//  		        title: 'Node Monopoly'
//  	    });
//	 });
//});

app.get('/gameboard', function(req, res) {
    var gameboardMutexCounter = 2,
        gameArea,
        players;
    var gameboardMutexDecrement = function() {
        if (--gameboardMutexCounter == 0) {
            res.render('gameBoard', { 
  		        title: 'Game Board',
  		        gameAreas: gameArea,
                players: players
  	        });
        }
    };

    playerModel.Player.find(function(err, data) {
        if (err) return console.log("failed to get players");
        players = data;
        gameboardMutexDecrement();
    });

   gameboardModel.GameArea.find(function(err, data) {
		if (err) return console.log("failed to get game areas");

        data.sort(function(a, b) { 
            return a.boardLocation - b.boardLocation; 
        });

        gameArea = data;
        gameboardMutexDecrement();
	}); 
});
