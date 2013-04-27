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

    return Physics;

});