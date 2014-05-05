this.gameAreaMap = {};
this.turnGameAreaCount = {};

this.populateGameAreas = function () {
    gameboardModel.GameArea.find( {}, function ( err, allAreas ) {
        if ( err ) console.log( "error caching game areas" );
        allAreas.forEach( function ( gameArea ) {
            gameAreaManager.gameAreaMap[gameArea.index] = gameArea;
        }, [] );
        console.log( "Cached Game Areas" );
    });
}

this.getGameAreaToPlayerMap = function(players) {
    var gameAreaToPlayerMap = {}; // gameArea.id -> player.id
    gameboardModel.turnGameAreaCount = {};
    players.forEach(function(player){
        player.properties.forEach(function(property){
            if(gameAreaToPlayerMap[property.id] == undefined){
                gameAreaToPlayerMap[property.id] = [[player.id, property]];
            }else{
                gameAreaToPlayerMap[property.id].push([player.id, property]);
            }
            
            if(gameboardModel.turnGameAreaCount[property.id] == undefined) {
                gameboardModel.turnGameAreaCount[property.id] = property.percentage;
            }else {
                gameboardModel.turnGameAreaCount[property.id] += property.percentage;
            }

        }, []);
    }, []);
    return gameAreaToPlayerMap;
}