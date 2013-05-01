define(function() {

    var Renderer = function(renderer) {
        this.renderer = renderer;
    };

    Renderer.prototype.render = function(stage) {
        this.renderer.render(stage);
    };

    Renderer.prototype.addMapToStage = function(map, stage) {
        // source spots
        for (var s = 0; s < map.sourceSpots.length; s++) {
            stage.addChild(map.sourceSpots[s].sprite);
        }
    };

    return Renderer;

});