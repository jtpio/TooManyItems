define(function() {

    var Queue = function() {
        this.stackIn = [];
        this.stackOut = [];
    };

    Queue.prototype.push = function(item) {
        this.stackIn.push(item);
    };

    Queue.prototype.pop = function() {
        if (this.stackOut.length === 0) {
            for (var i = 0; i < this.stackIn.length; i++) {
                this.stackOut.push(this.stackIn.pop());
            }
        }
        return this.stackOut.pop();
    };

    Queue.prototype.empty = function() {
        return (this.stackIn.length === 0 && this.stackOut.length === 0);
    };

    Queue.prototype.length = function() {
        return (this.stackIn.length + this.stackOut.length);
    };

    return Queue;

});