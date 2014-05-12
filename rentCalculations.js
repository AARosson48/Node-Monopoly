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