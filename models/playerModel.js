var db = require('./../db.js');

this.Player = db.mongoose.model('Player', {
    id: db.mongoose.Schema.Types.ObjectId,
    name: String,
    currentGameArea: Number,
    inJail: Boolean,
    money: Number,
    properties: [{ id: db.mongoose.Schema.Types.ObjectId, percentage: Number }] //list of properties a player owns and how much of it they own
});