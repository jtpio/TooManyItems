define(['Entity'], function(Entity) {

    var Enemy = function(sprite) {
        Entity.call(this, sprite);
        this.state = Conf.enemy.states.STOPPED;
    };

    Enemy.constructor = Enemy;
    Enemy.prototype = Object.create(Entity.prototype);

    Enemy.prototype.setTarget = function(target) {
        this.target = target;
    };

    Enemy.prototype.update = function(dt) {

        this.lookAt(this.target);

        switch(this.state) {
            case Conf.enemy.states.STOPPED:

                break;
            case Conf.enemy.states.FETCHING:

                break;
            case Conf.enemy.states.BRINGING:

                break;
            case Conf.enemy.states.CRAZY:
                if (this.destinationReached()) {
                    this.setTarget(this.map.randomSourceSpot());
                }
                break;
        }


        this.move(this.target, dt);

    };

    Enemy.prototype.destinationReached = function() {
        return Utils.euclidian(this.pos, this.target.pos) < 10;
    };

    return Enemy;
});