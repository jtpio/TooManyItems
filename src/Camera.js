define(function() {

    var Camera = function() {
        this.x = 0;
        this.y = 0;

        // default bounds
        this.bounds = {
            xmin: 0,
            xmax: 0,
            ymin: 0,
            ymax: 0
        };
    };

    Camera.prototype.init = function(bounds) {
        this.bounds = bounds;
    };

    Camera.prototype.setPosition = function(x, y) {
        var b = this.bounds;

        if (x < b.xmin) {
            x = b.xmin;
        }
        else if (x > b.xmax) {
            x = b.xmax;
        }
        if (y < b.ymin) {
            y = b.ymin;
        }
        else if (y > b.ymax) {
            y = b.ymax;
        }

        this.x = x;
        this.y = y;
    };

    Camera.prototype.translateX = function(dx) {
        this.setPosition(this.x + dx, this.y);
    };

    Camera.prototype.translateY = function(dy) {
        this.setPosition(this.x, this.y + dy);
    };

    Camera.prototype.transform = function(pos) {
        var newPos = {};
        if (pos) {
            if (pos.x) {
                newPos.x = pos.x - this.x;
            }

            if (pos.y) {
                newPos.y = pos.y - this.y;
            }
        }

        return newPos;
    };

    Camera.prototype.canvasToWorld = function(pos) {
        var newPos = {};
        if (pos) {
            if (pos.x) {
                newPos.x = pos.x + this.x;
            }

            if (pos.y) {
                newPos.y = pos.y + this.y;
            }
        }
        return newPos;
    };

    Camera.prototype.targetEntity = function(entity) {
        this.setPosition(
            entity.pos.x - Conf.canvas.width/2,
            entity.pos.y - Conf.canvas.height/2
        );
    };

        /*
         * Tell if a tile or an entity is visible or not
         */
    Camera.prototype.isTileVisible = function(x,y,size) {
        return this.isVisible(x,y,size,size);
    };

    Camera.prototype.isVisible = function(entity) {
        return this.isVisibleXY(entity.pos.x, entity.pos.y, entity.width, entity.height);
    };

    Camera.prototype.isVisible = function(x,y,width,height) {
        return !(x + width < this.x ||
            y + height < this.y ||
            x > this.x + Conf.camera.width ||
            y > this.y + Conf.camera.height
        );
    };

    return Camera;
});