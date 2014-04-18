this.Mutex = function(count, callback) {
    var count = count,
    callback = callback;

    this.decrement = function() {
        if (--count == 0 ) callback();;
    }
}