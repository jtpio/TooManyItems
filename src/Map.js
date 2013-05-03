define(['Entity'], function(Entity) {

    var Map = function() {
        this.width = 0;
        this.height = 0;

        this.items = ['tv', 'potato'];
        this.nbSourceSpots = Conf.map.nbSourceSpots;
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
    };

    Map.prototype.createSourceSpots = function() {
        this.sourceSpots = [];
        for (var i = 0; i < this.nbSourceSpots; i++) {
            var r = Utils.random(0,this.items.length);
            var source = new Entity(PIXI.Sprite.fromFrame(this.items[r]+"_source.png"));
            source.anchor.x = source.anchor.y = 0.5;
            source.item = this.items[r];
            this.sourceSpots.push(source);
        }

        this.init();
    };

    Map.prototype.init = function() {
        for (var s = 0; s < this.sourceSpots.length; s++) {
            var xSource = Utils.random(2, this.width-2);
            var ySource = Utils.random(2, this.height-2);
            this.sourceSpots[s].pos.x = xSource * this.tileSize;
            this.sourceSpots[s].pos.y = ySource * this.tileSize;
        }
    };

    Map.prototype.randomSourceSpot = function() {
        var r = Utils.random(0, this.sourceSpots.length - 1);
        return this.sourceSpots[r];
    };

    Map.prototype.update = function(camera) {
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

    return Map;
});