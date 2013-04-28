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
        switch(key) {
            case 38: // UP
            case 87: // W
            case 90: // Z
                action = Conf.actions.up;
            break;
            case 37: // left arrow
            case 65: // A
            case 81: // Q
                action = Conf.actions.left;
            break;
            case 40: // DOWN
            case 83: // S
                action = Conf.actions.down;
            break;
            case 39: // right arrow
            case 68: // D
                action = Conf.actions.right;
            break;
            case 27: // Escape
                action = Conf.actions.escape;
            break;
            case 67: // C
                action = Conf.actions.c;
            break;
        }
        return action;
    };

    return Input;

});