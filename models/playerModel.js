this.Player = mongoose.model('Player', {
    name: String,
    currentGameArea: Number,
    inJail: Boolean,
    money: Number
});

//will certainly also need a list of owned properties