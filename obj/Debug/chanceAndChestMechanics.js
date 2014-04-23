var chanceAndChestMechanics = this;

this.drawChanceCard = function(player, callback) {
    chanceAndChestMechanics.drawCard("chance");
}

this.drawCommChestCard = function(player, callback) {
    chanceAndChestMechanics.drawCard("chest");
}

this.drawCard = function(cardType) {
    if (cardType == "chance") {
        //draw a chance card
    } else { //whatever, assume it's a chest for now
        //draw a chest card
    }
}