this.Card = mongoose.model('Card', {
    _id: mongoose.Schema.Types.ObjectId,
    type: String,
    value: Number
});