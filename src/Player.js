define(['Entity'], function(Entity) {

    var Player = function(sprite) {
        Entity.call(this, sprite);
    };

    Player.constructor = Entity;
    Player.prototype = Object.create(Entity.prototype);

    return Player;
});