define(function() {

    var Input = function() {
        this.actions = [];
        this.setup();
    };

    Input.prototype.setup = function() {
        var self = this;

        document.onkeydown = function(e) {
            var key = e.which;
            var a = self.keyToAction(key);
            if (a) {
                self.actions[a] = true;
            }
            return true;
        };

        document.onkeyup = function(e) {
            var key = e.which;
            var a = self.keyToAction(key);
            self.actions[a] = false;
        };
    };

    Input.prototype.keyToAction = function(key) {
        var action = null;
        // TODO
        return 42;
    };

    return Input;

});