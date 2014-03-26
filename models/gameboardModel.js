GameArea = mongoose.model('GameArea', {
    name: String,
    value: Number,
    index: Number,
    color: String,
    boardLocation: Number,
});