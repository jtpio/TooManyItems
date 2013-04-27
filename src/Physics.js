define(function() {

    var Physics = function() {

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
        return (
            box2.x < box1.x + box1.w &&
            box2.x + box2.w > box1.x &&
            box2.y < box1.y + box1.h &&
            box2.y + box2.h > box1.y
        );
    };

    Physics.prototype.entityToBox = function(entity) {
        var box = {};
        box.x = entity.pos.x - entity.anchor.x*entity.width;
        box.w = entity.width;
        box.y = entity.pos.y + entity.anchor.y*entity.height;
        box.h = entity.height;
        return box;
    };

    Physics.prototype.lineSegment = function(a, b, o, p) {
        var ao = {};
        var ap = {};
        var ab = {};
        ab.x = b.x - a.x;
        ab.y = b.y - a.y;
        ap.x = p.x - a.x;
        ap.y = p.y - a.y;
        ao.x = o.x - a.x;
        ao.y = o.y - a.y;
        return ((ab.x*ap.y - ab.y*ap.x)*(ab.x*ao.y - ab.y*ao.x)<0);
    };

    Physics.prototype.segmentSegment = function(a, b, o, p) {
        if (!this.lineSegment(a,b,o,p)) return false;
        if (!this.lineSegment(o,p,a,b)) return false;
        return true;
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

    return Physics;

});