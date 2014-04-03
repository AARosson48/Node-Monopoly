causeRepaintsOn = $(".area-name, .area-value");

$(window).resize(function() {
  causeRepaintsOn.css("z-index", 1);
});

takeTurn = function() {
    $.post('/taketurn', {}, function() {
        //do something... repaint, i guess
    });
}