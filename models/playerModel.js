var db = require('./../db.js');

this.Player = db.mongoose.model('Player', {
    id: db.mongoose.Schema.Types.ObjectId,
    name: String,
    currentGameArea: Number,
    inJail: Number,  //0 is not in jail, 1 is first day in jail, 2 is second day in jail, etc
    money: Number,
    properties: [{ id: db.mongoose.Schema.Types.ObjectId, percentage: Number }] //list of properties a player owns and how much of it they own
});