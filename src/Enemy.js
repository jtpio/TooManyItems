define(['Entity'], function(Entity) {

    var Enemy = function(sprite) {
        Entity.call(this, sprite);
        this.state = Conf.enemy.states.STOPPED;
        this.item = null;
    };

    Enemy.constructor = Enemy;
    Enemy.prototype = Object.create(Entity.prototype);

    Enemy.prototype.setTarget = function(target) {
        this.target = target;
    };

    Enemy.prototype.update = function(dt) {
        var action = Conf.enemy.actions.NONE;
        var g = this.game;
        this.lookAt(this.target);

        switch(this.state) {
            case Conf.enemy.states.STOPPED:

                break;
            case Conf.enemy.states.FETCHING:
                if (this.destinationReached()) {
                    this.createNewItem();
                    // bring it to player
                    this.setTarget(g.player);
                    action = Conf.enemy.actions.NEW_ITEM;
                    this.state = Conf.enemy.states.BRINGING;
                }
                break;
            case Conf.enemy.states.BRINGING:
                var dist = this.distanceToTarget();
                if (g.physics.circleCircle(this, this.target, dist)) {
                    action = Conf.enemy.actions.GAVE_ITEM;
                    this.state = Conf.enemy.states.FETCHING;
                    this.setTarget(g.map.randomSourceSpot());
                }
                break;
            case Conf.enemy.states.CRAZY:
                if (this.destinationReached()) {
                    this.setTarget(g.map.randomSourceSpot());
                }
                break;
        }

        this.move(this.target, dt);

        return action;
    };

    Enemy.prototype.createNewItem = function() {
        this.item = new Entity(PIXI.Sprite.fromFrame(this.target.item+".png"));
        this.item.pos = this.pos;
        this.item.rescale(0.6);
    };

    Enemy.prototype.destinationReached = function() {
        return Utils.euclidian(this.pos, this.target.pos) < 10;
    };

    Enemy.prototype.distanceToTarget = function() {
        return Utils.euclidian(this.pos, this.target.pos);
    };

    return Enemy;
});