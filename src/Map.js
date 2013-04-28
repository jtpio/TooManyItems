define(['Entity'], function(Entity) {

    var Map = function() {
        this.width = 0;
        this.height = 0;
        this.grid = [];

        this.items = ['tv', 'tv', 'tv', 'tv', 'tv'];
        this.nbSourceSpots = 5;
        this.generate();
        this.createSourceSpots();
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

        this.limits = {
            xmin: 0,
            xmax: this.width * this.tileSize,
            ymin: 0,
            ymax: this.height * this.tileSize
        };

        var i, j = 0;
        var data, cellSprite = null;
        for (i = 0; i < this.width; i++) {
            this.grid.push([]);
            for (j = 0; j < this.height; j++) {
                this.grid[i].push(-1);
            }
        }
    };

    Map.prototype.createSourceSpots = function() {
        this.sourceSpots = [];
        for (var i = 0; i < this.nbSourceSpots; i++) {
            var xSource = Utils.random(0, this.width-1);
            var ySource = Utils.random(0, this.height-1);
            var source = new Entity(PIXI.Sprite.fromFrame(this.items[i]+'.png'));
            source.pos.x = xSource * this.tileSize;
            source.pos.y = ySource * this.tileSize;
            source.anchor.x = source.anchor.y = 0.5;
            this.sourceSpots.push(source);
        }
    };

    Map.prototype.randomSourceSpot = function() {
        var r = Utils.random(0, this.sourceSpots.length - 1);
        return this.sourceSpots[r];
    };

    Map.prototype.update = function(camera) {
        // tiles
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
        // source spots
        for (var s = 0; s < this.sourceSpots.length; s++) {
            var source = this.sourceSpots[s];
            var newPos = camera.transform(source.pos);
            source.position.x = newPos.x;
            source.position.y = newPos.y;
        }
    };

    Map.prototype.getGridPosision = function(worldPosition) {
        var gridPos = {};
        gridPos.x = Math.floor(worldPosition.pos.x / this.tileSize);
        gridPos.y = Math.floor(worldPosition.pos.y / this.tileSize);
        gridPos.w = gridPos.h = this.tileSize;
        return gridPos;
    };

    Map.prototype.getAllNeighbors = function(worldPosition) {
        var gridPos = this.getGridPosision(worldPosition);
        var neighbors = [];
        for (var i = gridPos.x-1; i <= gridPos.x+1; i++) {
            for (var j = gridPos.y-1; j <= gridPos.y+1; j++) {
                if (i >= 0 && i < this.width && j >= 0 && j < this.height && i != gridPos.x && j != gridPos.y) {
                    var next = this.grid[i][j];
                    neighbors.push(next);
                }
            }
        }
        return neighbors;
    };

    return Map;
});