var db = require('./../db.js');

this.Player = db.mongoose.model('Player', {
    name: String,
    currentGameArea: Number,
    inJail: Boolean,
    money: Number
});

//will certainly also need a list of owned properties