define(function() {

    var Entity = function(sprite) {
        this.sprite = sprite;
        this.position = this.sprite.position;
        this.scale = this.sprite.scale;
        this.anchor = this.sprite.anchor;
        this.sprite.rotation = 0;
        this.pos = {x: sprite.position.x, y: sprite.position.y};
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.radius = Math.max(this.width/2, this.height/2);
    };

    Entity.prototype.moveLeft = function(delta) {
        this.pos.x -= delta;
    };

    Entity.prototype.moveRight = function(delta) {
        this.pos.x += delta;
    };

    Entity.prototype.rotation = function(r) {
        this.sprite.rotation = r;
    };

    Entity.prototype.getRotation = function() {
        return this.sprite.rotation;
    };

    Entity.prototype.rescale = function(s) {
        this.scale.x *= s;
        this.scale.y *= s;
    };

    Entity.prototype.lookAt = function(target) {
        var deltaX = target.x - this.pos.x;
        var deltaY = target.y - this.pos.y;
        this.rotation(Math.atan2(deltaY, deltaX) - Math.PI/2);
    };

    Entity.prototype.move = function(target, dt) {
        var deltaX = target.x - this.pos.x;
        var deltaY = target.y - this.pos.y;
        var normalized = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
        this.pos.x += (deltaX/normalized) * Conf.enemy.speed * dt;
        this.pos.y += (deltaY/normalized) * Conf.enemy.speed * dt;
    };

    return Entity;
});