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

        for (var i = 0; i < this.width; i++) {
            this.grid.push([]);
            for (var j = 0; j < this.height; j++) {
                var data = 0;
                if (Math.random() < 0.1) {
                    var cellSprite = PIXI.Sprite.fromFrame("block.png");
                    data = new Entity(cellSprite);
                }
                this.grid[i].push(data);
            }
        }
    };

    Map.prototype.update = function(camera) {
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                var cell = this.grid[i][j];
                if (cell !== 0) {
                    var newPos = camera.transform(cell.pos);
                    cell.position.x = newPos.x;
                    cell.position.y = newPos.y;
                }
            }
        }
    };

    return Map;
});