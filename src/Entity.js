define(function() {

    var Entity = function(sprite) {
        this.sprite = sprite;
        this.pos = this.sprite.position;
        this.scale = this.sprite.scale;
    };

    Entity.prototype.moveLeft = function(delta) {
        this.sprite.position.x -= delta;
    };

    Entity.prototype.moveRight = function(delta) {
        this.sprite.position.x += delta;
    };

    Entity.prototype.rescale = function(s) {
        this.sprite.scale.x *= s;
        this.sprite.scale.y *= s;
    };

    return Entity;
});