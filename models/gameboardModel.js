var db = require('./../db.js');

this.GameArea = db.mongoose.model('GameArea', {
    name: String,
    value: Number,
    index: Number,
    image: String,
    color: String,
    boardLocation: Number,
});