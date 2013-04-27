define(['Entity'], function(Entity) {

    var Enemy = function(sprite) {
        Entity.call(this, sprite);
    };

    Enemy.constructor = Enemy;
    Enemy.prototype = Object.create(Entity.prototype);

    return Enemy;
});