this.gameAreaMap = {};
this.turnGameAreaCount = {};
this.gameAreaColorMap = {};

this.populateGameAreas = function () {
    gameboardModel.GameArea.find( {}, function ( err, allAreas ) {
        if ( err ) console.log( "error caching game areas" );
        allAreas.forEach( function ( gameArea ) {
            gameAreaManager.gameAreaMap[gameArea.index] = gameArea;
            if ( gameAreaManager.gameAreaColorMap[gameArea.color] == undefined ) {
                gameAreaManager.gameAreaColorMap[gameArea.color] = 1;
            } else {
                gameAreaManager.gameAreaColorMap[gameArea.color]++;
            }
        }, [] );
        console.log( "Cached Game Areas" );
    });
}

this.getGameAreaToPlayerMap = function ( players ) {
    var gameAreaToPlayerMap = {}; // gameArea.id -> player.id
    gameboardModel.turnGameAreaCount = {};
    players.forEach( function ( player ) {
        player.properties.forEach( function ( property ) {
            if ( gameAreaToPlayerMap[property.id] == undefined ) {
                gameAreaToPlayerMap[property.id] = [[player.id, property]];
            } else {
                gameAreaToPlayerMap[property.id].push( [player.id, property] );
            }

            if ( gameboardModel.turnGameAreaCount[property.id] == undefined ) {
                gameboardModel.turnGameAreaCount[property.id] = property.percentage;
            } else {
                gameboardModel.turnGameAreaCount[property.id] += property.percentage;
            }

        }, [] );
    }, [] );
    return gameAreaToPlayerMap;
}

this.doesPlayerHaveMonopoly = function ( player, color ) {
    var amountofColor = 0;
    player.properties.forEach( function ( prop ) {
        if ( prop.color == color ) {
            amountofColor++;
        }
    }, [] );
    return amountofColor == gameAreaManager.gameAreaColorMap[color];
}

// This probably shouldn't be here...
// This will add a property (and do proper adjustments)
// to a player and return the altered player.
this.PurchaseProperty = function ( player, property, cost ) {
    var alreadyAdded = false;
    player.properties.forEach( function ( prop ) {
        if ( prop.id == property._id ) {
            prop.percentage += property.percentage;
            alreadyAdded = true;
        }
    }, [] );
    if ( !alreadyAdded ) {
        player.properties.push( property );
    }
    player.money -= cost;
    return player;
}