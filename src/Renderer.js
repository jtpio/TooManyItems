define(function() {

    var Renderer = function(renderer) {
        this.renderer = renderer;
    };

    Renderer.prototype.render = function(stage) {
        this.renderer.render(stage);
    };

    Renderer.prototype.addMapToStage = function(map, stage) {
        // tiles
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                var cell = map.grid[i][j];
                if (cell !== -1) {
                    stage.addChild(cell.sprite);
                }
            }
        }
        // source spots
        for (var s = 0; s < map.sourceSpots.length; s++) {
            stage.addChild(map.sourceSpots[s].sprite);
        }
    };

    return Renderer;

});