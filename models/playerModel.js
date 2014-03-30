this.Player = mongoose.model('Player', {
    name: String,
    currentGameArea: Number,
    money: Number
});

//will certainly also need a list of owned properties