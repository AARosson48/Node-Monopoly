Player = mongoose.model('Player', {
    name: String,
    currentPlace: Number,
    money: Number
});

//will certainly also need a list of owned properties