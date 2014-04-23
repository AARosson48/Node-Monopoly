this.Player = mongoose.model('Player', {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    currentGameArea: Number,
    inJail: Number,  //0 is not in jail, 1 is first day in jail, 2 is second day in jail, etc
    getOutOfJailCardsNum: Number,
    money: Number,
    properties: [  //list of properties a player owns and how much of it they own
        { 
            _id: mongoose.Schema.Types.ObjectId, 
            percentage: Number
        }] 
});