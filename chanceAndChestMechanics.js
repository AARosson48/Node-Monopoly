var cards;

cardModel.Card.find(function(err, data) {
    if (err) return console.log(err);
    cards = data;   
});


this.applyCard = function(player) {
    //var cardNumber = Math.floor(Math.random() * 16);
    if (cards) {
        var card = cards[0];     //temp code for now
        return chanceAndChestMechanics.cardFuncs[card.type](player, card.value);
    }
}

this.cardFuncs = {
    "finan" : function(player, cardValue) {
        player.money += cardValue;
        return player;
    },
    "moveToX" : function() {
    }
}











//var chanceAndChestMechanics = this;

//function card(cardDescription, type, value) {
//    this.cardDescription = cardDescription;
//    this.type = type;
//    this.value = value;
//}

//this.drawChanceCard = function (player, callback) {
//    chanceAndChestMechanics.drawCard("chance");
//}

//this.drawCommChestCard = function (player, callback) {
//    chanceAndChestMechanics.drawCard("chest");
//}

//this.drawCard = function (cardType) {
//    if (cardType == "chance") {
//        var cardNumber = Math.floor(Math.random() * 16);
//        chanceAndChestMechanics.generateChanceCard(cardNumber);
//    } else { //whatever, assume it's a chest for now
//        var cardNumber = Math.floor(Math.random() * 16);
//        chanceAndChestMechanics.generateCommChestCard(cardNumber);
//    }
//}

//this.generateCommChestCard = function (cardNumber) {
//    switch (cardNumber) {
//        case 0:
//            //Advance to go (collect $200)
//            var x = new card("Advance to Go, collect $200", "Community Chest", "200");
//            break;
//        case 1:
//            //Bank Error in your favor - collect $75
//            break;
//        case 2:
//            //Doctor's fees - Pay $50
//            break;
//        case 3:
//            //Get out of jail free - this card may be kept until needed, or sold
//            break;
//        case 4:
//            //Go to jail - go directly to jail, do not pass Go, do not collect $200
//            break;
//        case 5:
//            //It is your birthday - collect $10 from every player
//            break;
//        case 6:
//            //Grand Opera Night - collect $50 from every player for opening night seats
//            break;
//        case 7:
//            //Income Tax Refund - collect $20 (LMAO $20 tax return)
//            break;
//        case 8:
//            //Life Insurance Matures - collect $100
//            break;
//        case 9:
//            //Pay Hospital Fees of $100
//            break;
//        case 10:
//            //Pay School Fees of $50
//            break;
//        case 11:
//            //Receive $25 Consultancy Fee
//            break;
//        case 12:
//            //You are assessed for street repairs - $40 per house, $115 per hotel
//            break;
//        case 13:
//            //You have won second prize in a beauty contest - collect $10
//            break;
//        case 14:
//            //You inherit $100
//            break;
//        case 15:
//            //From sale of stock you get $50
//            break;
//        case 16:
//            //Holiday Fund Matures - Receive $100
//            break;
//        default:
//            //something fucking broke cuz there are only 17 cards, and the RNG is 0-16 inclusive
//            break;
//    }
//}

//this.generateChanceCard = function (cardNumber) {
//    switch (cardNumber) {
//        case 0:
//            //Advance to go (collect $200)
//            break;
//        case 1:
//            //Advance token to nearest Railroad and pay owner twice the rental to which he/she is
//            //otherwise entitled.  If railroad is unowned, you may but it from the Bank
//            break;
//        case 2:
//            //You have won a crossword competition - collect $100
//            break;
//        case 3:
//            //Advance to Illinois Ave.
//            break;
//        case 4:
//            //Advance token to nearest Utility. If unowned, you may but it from the Bank.
//            //If owned, throw a dice and pay owner a total ten times the amount thrown.
//            break;
//        case 5:
//            //Advance token to nearest Railroad and pay owner twice the rental to which he/she is
//            //otherwise entitled.  If railroad is unowned, you may but it from the Bank
//            //Two in a deck. Replicated here to preserve odds.
//            break;
//        case 6:
//            //Advance to St. Charles Place - if you pass Go, collect $200
//            break;
//        case 7:
//            //Bank Pays you dividen of $50
//            break;
//        case 8:
//            //Get out of Jail free - this card may be kept until needed, or traded/sold
//            break;
//        case 9:
//            //Go back three spaces
//            break;
//        case 10:
//            //Go directly to Jail - do not pass Go, do not collect $200
//            break;
//        case 11:
//            //Make general reapirs on all your property - for each house pay $25 - for each hotel $100
//            break;
//        case 12:
//            //Pay poor tax of $15
//            break;
//        case 13:
//            //Take a trip to Reading Railroad - if you pass Go collect $200
//            break;
//        case 14:
//            //Take a walk on Boardwalk - Advance to Boardwalk
//            break;
//        case 15:
//            //You have been elected chairman of the board - pay each player $50
//            break;
//        case 16:
//            //Building Loan Matures - Receive $150
//            break;
//        default:
//            //something fucking broke cuz there are only 17 cards, and the RNG is 0-16 inclusive
//            break;
//    }
//}