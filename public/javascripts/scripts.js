causeRepaintsOn = $(".area-name, .area-value");

$(window).resize(function() {
  causeRepaintsOn.css("z-index", 1);
});

takeTurn = function() {
    $.get('/taketurn', {}, function(data) {
        //do something... repaint, i guess
        $("#gameBoard").find(".player").remove();
        data.forEach(function(elem) {
            $(".game-area[data-index=" + elem.currentGameArea +"]").append("<div class='player'>"+ elem.name + ":" + elem.money + "</div>");
        });
    });
}
takeTurns = function() {
    $.get('/taketurns', {}, function(data) {
        //do something... repaint, i guess
        $("#gameBoard").find(".player").remove();
        data.forEach(function(elem) {
            $(".game-area[data-index=" + elem.currentGameArea +"]").append("<div class='player'>"+ elem.name + ":" + elem.money + "</div>");
        });
    });
}

resetGame = function() {
    $.post('/resetGame', {}, function() {
        //move everybody back to go  
        $("#gameBoard").find(".player").remove();      
    });
}