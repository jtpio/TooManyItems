define(function() {

    var Renderer = function(renderer) {
        this.renderer = renderer;
    };

    Renderer.prototype.render = function(stage) {
        this.renderer.render(stage);
    };

    return Renderer;

});