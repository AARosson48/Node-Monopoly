var gameboard;

app.get('/', function(req, res) {
    var players;
    var gameboardMutexDecrement = function() {
        if (players && gameboard) {
            res.render('gameBoard', { 
  		        title: 'Node Monopoly',
  		        gameAreas: gameboard.reduce(function(prevGameAreas, currGameArea) {
                    prevGameAreas.push({
                        name: currGameArea.name,
                        index: currGameArea.index,
                        value: currGameArea.value,
                        image: currGameArea.image,
                        color: currGameArea.color,
                        players: players.reduce(function(prevPlayers, currPlayer) {
                            //return all players currently on this current game area
                            if (currPlayer.currentGameArea == currGameArea.index) {
                                prevPlayers.push({
                                    name: currPlayer.name,
                                    money: currPlayer.money    
                                });
                            }
                            return prevPlayers;
                        },[])
                    });
                    return prevGameAreas;
                }, [])
  	        });
        }
    };

    playerModel.Player.find(function(err, data) {
        if (err) return console.log("failed to get players");
        players = data;
        gameboardMutexDecrement();
    });

    if (!gameboard) {
        gameboardModel.GameArea.find(function(err, data) {
		    if (err) return console.log("failed to get game areas");

            data.sort(function(a, b) { 
                return a.boardLocation - b.boardLocation; 
            });

            gameboard = data;
            gameboardMutexDecrement();
	    }); 
     }
});

app.get('/taketurn', function(req, res) {
    turnMechanics.takeTurnStep(function(data) {
        return res.send(data);
    })
});

app.post('/resetGame', function(req, res) {
    turnMechanics.resetGame(function() {
        return res.send();
    });
});