this.Card = mongoose.model('Card', {
    _id: mongoose.Schema.Types.ObjectId,
    type: String,
    moneyValue: Number,
    moveValue: Number,
    description: String
});