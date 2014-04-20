this.calculateAndApplyRentPay = function(player, gamearea, callback) {

    ///GAAHHH, it's something like this.... idk.....!!!

    // playerModel.Player.find({ $and: [ {'properties' : {$not: {$size: 0}}}, { "properties.id" : gamearea.id } ] }, function(err, stuff) {
    //        if (err) console.log("nope");
    //        if (stuff.length) {
    //            console.log("we got some");
    //        }
    //        callback();
    //});
    
    // playerModel.Player.find({'properties' : {$not: {$size: 0}}}, {"properties": {$elemMatch: {id : gamearea.id}}}, function(err, stuff) {
    //        if (err) console.log("nope");
    //        if (stuff.length) {
    //            console.log("we got some");
    //        }
    //        callback();
    //});

    //playerModel.Player.find({'properties' : {$not: {$size: 0}}}, function(err, stuff) {
    //        if (err) console.log("nope");
    //        if (stuff.length) {
    //            console.log("we got some");
    //        }
    //        callback();
    //});

//    playerModel.Player.find({'properties' : {$not: {$size: 0}}}).find({ 'properties.id': gamearea.id }, function(err, players) {
//        if (err) console.log("rent fetch went wrong");
//        if (players.length) {
//            console.log("we found an owner", players);
//        }
//    });
}