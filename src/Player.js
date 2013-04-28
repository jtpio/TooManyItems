define(['Entity'], function(Entity) {

    var Player = function(sprite) {
        Entity.call(this, sprite);
        this.state = Conf.player.states.WAIT;
        this.shots = Conf.player.nbShots;
    };

    Player.constructor = Entity;
    Player.prototype = Object.create(Entity.prototype);

    Player.prototype.shoot = function() {
        if (this.shots === 0) return;
        this.shots--;
    };

    Player.prototype.reload = function() {
        this.shots = Conf.player.nbShots;
    };

    return Player;
});