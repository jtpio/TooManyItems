define(function() {

    var Physics = function() {
        this.NONE = -1;
        this.LEFT = 1;
        this.DOWN = 2;
        this.RIGHT = 3;
        this.TOP = 4;
    };

    Physics.prototype.pointAABB = function(point, entity) {
        var box = this.entityToBox(entity);
        return (
            point.x >= box.x &&
            point.x < box.x + box.w &&
            point.y >= box.y &&
            point.y < box.y + box.h
        );
    };

    Physics.prototype.collisionAABB = function(entity1, entity2) {
        var box1 = this.entityToBox(entity1);
        var box2 = this.entityToBox(entity2);
        var colliding = (
            box2.x < box1.x + box1.w &&
            box2.x + box2.w > box1.x &&
            box2.y < box1.y + box1.h &&
            box2.y + box2.h > box1.y
        );
        var res = 0;
        if (colliding) {
            if (box2.x < box1.x + box1.w) res = Utils.setBit(res, this.LEFT);
            if (box2.x + box2.w > box1.x) res = Utils.setBit(res, this.RIGHT);
            if (box2.y < box1.y + box1.h) res = Utils.setBit(res, this.TOP);
            if (box2.y + box2.h > box1.y) res = Utils.setBit(res, this.DOWN);
            return res;
        }
        return colliding;
    };

    Physics.prototype.entityToBox = function(entity) {
        var box = {};
        box.x = entity.pos.x - entity.anchor.x*entity.width;
        box.w = entity.width;
        box.y = entity.pos.y + entity.anchor.y*entity.height;
        box.h = entity.height;
        return box;
    };

    Physics.prototype.lineCircle = function(start, end, c) {
        var s = {
            x: start.x - c.pos.x,
            y: start.y - c.pos.y
        };
        var e = {
            x: end.x - c.pos.x,
            y: end.y - c.pos.y
        };
        var dx = e.x - s.x;
        var dy = e.y - s.y;
        var dr = Math.sqrt(dx*dx+dy*dy);
        var deter = s.x*e.y-e.x*s.y;
        var discriminant = c.radius*c.radius*dr*dr - deter*deter;
        return (discriminant >= 0);
    };

    Physics.prototype.circleCircle = function(entity1, entity2, dist) {
        return (dist < entity1.radius + entity2.radius);
    };

    return Physics;

});