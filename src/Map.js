define(['Entity'], function(Entity) {

    var Map = function() {
        this.width = 0;
        this.height = 0;
        this.grid = [];
        this.generate();
    };

    Map.prototype.generate = function() {
        this.width = Conf.map.width;
        this.height = Conf.map.height;
        this.tileSize = Conf.map.tileSize;

        this.bounds = {
            xmin: 0,
            xmax: this.width * this.tileSize - Conf.camera.width,
            ymin: 0,
            ymax: this.height * this.tileSize - Conf.camera.height
        };

        var i, j = 0;
        var data, cellSprite = null;
        for (i = 0; i < this.width; i++) {
            this.grid.push([]);
            for (j = 0; j < this.height; j++) {
                this.grid[i].push(-1);
            }
        }

        // add walls
        for (i = 0; i < this.width; i++) {
            this.grid[i][1]  = new Entity(PIXI.Sprite.fromFrame("block.png"));
            this.grid[i][this.height-2]  = new Entity(PIXI.Sprite.fromFrame("block.png"));
        }
        for (j = 0; j < this.height; j++) {
            this.grid[1][j]  = new Entity(PIXI.Sprite.fromFrame("block.png"));
            this.grid[this.width-2][j]  = new Entity(PIXI.Sprite.fromFrame("block.png"));
        }

    };

    Map.prototype.update = function(camera) {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var cell = this.grid[i][j];
                if (cell !== -1) {
                    var newPos = camera.transform(cell.pos);
                    cell.position.x = newPos.x;
                    cell.position.y = newPos.y;
                }
            }
        }
    };

    return Map;
});