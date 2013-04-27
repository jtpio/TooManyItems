define(function() {

    var Renderer = function(renderer) {
        this.renderer = renderer;
    };

    Renderer.prototype.render = function(stage) {
        this.renderer.render(stage);
    };

    Renderer.prototype.addMapToStage = function(map, stage) {
        for (var i = 0; i < map.width; i++) {
            for (var j = 0; j < map.height; j++) {
                var cell = map.grid[i][j];
                if (cell !== -1) {
                    cell.pos.x = i * map.tileSize;
                    cell.pos.y = j * map.tileSize;
                    stage.addChild(cell.sprite);
                }
            }
        }
    };

    return Renderer;

});