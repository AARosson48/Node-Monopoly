this.GameArea = mongoose.model('GameArea', {
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    value: Number,
    index: Number,
    image: String,
    color: String,
    boardLocation: Number,
    baseRent: Number
});