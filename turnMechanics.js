var db = require('./db.js');
var playerModel = require('./models/playerModel.js');
var gameboardModel = require('./models/gameboardModel.js');

//reset the game, put all players back to $500 on 0 area
this.resetGame = function() {
    var resetCondition = {},  //no conditions, we want them all
        resetUpdate = { $set: { currentGameArea: 0, money: 500 } },
        resetOptions = { multi: true };

    playerModel.Player.update(resetCondition, resetUpdate, resetOptions, function(err, numAffected) {
        if (err) return console.log("failed to reset game");
    });
}