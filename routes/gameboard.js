var app = require("../app");
var db = require("../db");
var gameboardModel = require("../models/gameboardModel");

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
    GameArea.find(function(err, data) {
		if (err) return console.log("failed to get game areas");
        
        var thing = data;
        data.sort(function(a, b) { 
            return a.boardLocation - b.boardLocation; 
        });

        firstGroup = data.slice(0,11);

  	    res.render('gameBoard', { 
  		    title: 'Game Board',
  		    gameAreas: firstGroup,
  	    });
	}); 
});