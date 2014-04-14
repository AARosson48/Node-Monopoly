var db = require('./../db.js');

this.GameArea = db.mongoose.model('GameArea', {
    _id: db.mongoose.Schema.Types.ObjectId,
    name: String,
    value: Number,
    index: Number,
    image: String,
    color: String,
    boardLocation: Number,
    baseRent: Number
});