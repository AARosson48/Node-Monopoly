this.calculateAndApplyRentPay = function ( player, gamearea, gameAreaToPlayerMap ) {

    var playerMoneyDifference = {};
    var partialToPayUp = 0;
    var totalToPayUp = 0;

    playersPropTuples = gameAreaToPlayerMap[gamearea.id];
    var totalStockOfArea = gameboardModel.turnGameAreaCount[gamearea.id];

    if ( totalStockOfArea > 0 ) { // don't check what to pay, you'll be sad :(
        var balance = 1 + ( Math.min( 6, playersPropTuples.length - 1 ) / 3 ); // TODO Soupy: Will need to adjust these for certain!
        var stockAmount = ( gamearea.baseRent * balance ) / totalStockOfArea;

        playersPropTuples.forEach( function ( playersPropTuple ) {
            var curPlayerId = playersPropTuple[0];
            var prop = playersPropTuple[1];
            if ( curPlayerId != player.id ) {
                partialToPayUp = ( ( ( prop.percentage - 1 ) * 1.25 ) + 1 ) * stockAmount;
                totalToPayUp += partialToPayUp;
                player.money -= partialToPayUp;
                playerMoneyDifference[curPlayerId] = partialToPayUp;
            }
        }, [] );
    }
    
    if(totalToPayUp > 500)
        console.log( player.name + " paid '$" + totalToPayUp + "' to other players" );
    playerMoneyDifference[player.id] = -totalToPayUp;
    return playerMoneyDifference;
}
//this.calculateAndApplyRentPay = function ( player, gamearea, callback ) {

//    var stuff = 0;
//    ///GAAHHH, it's something like this.... idk.....!!!

//    // playerModel.Player.find({ $and: [ {'properties' : {$not: {$size: 0}}}, { "properties.id" : gamearea.id } ] }, function(err, stuff) {
//    //        if (err) console.log("nope");
//    //        if (stuff.length) {
//    //            console.log("we got some");
//    //        }
//    //        callback();
//    //});

//    playerModel.Player.find( { $and: [{ properties: { $not: { $size: 0 } } }, { properties: { $elemMatch: { _id: gamearea.id } } }] }, function ( err, players ) {
//        if ( err ) {
//            console.log( "error getting renters" );
//            return;
//        }
//        var playerMoneyDifference = {};
//        var partialToPayUp = 0;
//        var totalToPayUp = 0;

//        var totalStockOfArea = 0;

//        for ( var i = 0; i < players.length; i++ ) {
//            var curPlayer = players[i];
//            totalStockOfArea += getProperty( curPlayer, gamearea.id ).percentage;
//        }
//        if ( totalStockOfArea > 0 ) { // don't check what to pay, you'll be sad :(
//            var balance = 1 + ( Math.min( 6, players.length - 1 ) / 3 ); // TODO Soupy: Will need to adjust these for certain!
//            var stockAmount = ( gamearea.baseRent * balance ) / totalStockOfArea;

//            for ( var i = 0; i < players.length; i++ ) {
//                var curPlayer = players[i];
//                if ( curPlayer.id != player.id ) {
//                    var prop = getProperty( curPlayer, gamearea.id );
//                    partialToPayUp = (((prop.percentage-1)*1.25) + 1) * stockAmount;
//                    totalToPayUp += partialToPayUp;
//                    player.money -= partialToPayUp;

//                    playerMoneyDifference[curPlayer.id] = partialToPayUp;
//                    //console.log( player.name + " paid " + partialToPayUp + " to " + curPlayer.name );
//                }
//            }
//        }
//        playerMoneyDifference[player.id] = -totalToPayUp;
//        callback( playerMoneyDifference );
//    });

//    //playerModel.Player.find({'properties' : {$not: {$size: 0}}}, function(err, stuff) {
//    //        if (err) console.log("nope");
//    //        if (stuff.length) {
//    //            console.log("we got some");
//    //        }
//    //        callback();
//    //});

//    //    playerModel.Player.find({'properties' : {$not: {$size: 0}}}).find({ 'properties.id': gamearea.id }, function(err, players) {
//    //        if (err) console.log("rent fetch went wrong");
//    //        if (players.length) {
//    //            console.log("we found an owner", players);
//    //        }
//    //    });
//}
// Turn to prototype or whatnot...
//function getProperty( player, id ) {
//    for ( var i = 0; i < player.properties.length; i++ ) {
//        var area = player.properties[i];
//        if ( area.id == id ) {
//            return area;
//        }
//    }
//    return undefined;
//}
