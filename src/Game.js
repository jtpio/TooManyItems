define(['Screen' ,'Input'], function(Screen, Input) {

    var Game = function(main, renderer, sound) {
        Screen.call(this, main, renderer, sound);
        this.loadStage();
        this.setupInputs();
        this.mouse = {x: 0, y: 0};

        this.fireEvents = [];

        this.items = 1; // only the weapon

        this.last = new Date().getTime();
    };

    Game.constructor = Game;
    Game.prototype = Object.create(Screen.prototype);

    Game.prototype.loadStage = function() {
        // tile texture
        var texture = PIXI.Texture.fromImage("assets/sprites/tiles.png");
        this.tilingSprite = new PIXI.TilingSprite(texture, Conf.canvas.width, Conf.canvas.height);
        this.tilingSprite.tileScale.x = 1;
        this.tilingSprite.tileScale.y = 1;
        this.stage.addChild(this.tilingSprite);

        // player
        this.player = PIXI.Sprite.fromFrame("player.png");
        this.player.anchor.x = this.player.anchor.y = 0.5;
        this.player.position.x = Conf.canvas.width/2;
        this.player.position.y = Conf.canvas.height/2;
        this.stage.addChild(this.player);

        this.beam = PIXI.Sprite.fromFrame("beam.png");
        this.beam.anchor.x = 0.5;
        this.beam.position = this.player.position;
        this.beam.scale.y = 10;
        this.beam.scale.x = 2;
        this.stage.addChild(this.beam);

        // add enemies container
        this.enemies = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.enemies);

        // items text
        this.itemsText = new PIXI.Text("Items: " + this.items, "bold 60px Arial", "#000000", "#a4410e", 3);
        this.itemsText.position.x = 20;
        this.itemsText.position.y = Conf.canvas.height - 50;
        this.itemsText.anchor.y= 0.5;
        this.stage.addChild(this.itemsText);
    };

    Game.prototype.setupInputs = function() {
        var self = this;
        this.renderer.renderer.view.addEventListener("mousemove", function(data) {
            self.mouse.x = data.x;
            self.mouse.y = data.y;
        }, true);

        this.renderer.renderer.view.addEventListener("click", function(data) {
            console.log("click on stage");
            self.sound.play("sound_muted");
            self.fireEvents.push(data);
        }, true);

        // keyboard inputs
        this.input = new Input();
    };

    Game.prototype.tick = function() {
        if (!this.focus) return;
        this.renderer.stats.begin();
        var current = new Date().getTime();
        var dt = (current - this.last) / 1000;
        this.update(dt);
        this.renderer.render(this.stage);
        this.last = current;
        this.renderer.stats.end();
        requestAnimFrame(this.tick.bind(this));
    };

    Game.prototype.update = function(dt) {
        //this.tilingSprite.tilePosition.x += 1;
        var deltaX = this.mouse.x - this.player.position.x;
        var deltaY = this.mouse.y - this.player.position.y;
        this.player.rotation = Math.atan2(deltaY, deltaX) - Math.PI/2;

        this.beam.rotation = this.player.rotation;

        if (Math.random() < 0.01) this.spawEnemy();

        // consume fire event
        var fireEvent = this.fireEvents.shift();

        // update enemies
        for (var i = 0; i < this.enemies.children.length; i++) {
            var enemy = this.enemies.children[i];
            deltaX = this.player.position.x - enemy.position.x;
            deltaY = this.player.position.y - enemy.position.y;
            enemy.rotation = Math.atan2(deltaY, deltaX) - Math.PI/2;

            // move
            var normalized = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
            enemy.position.x += deltaX/normalized;
            enemy.position.y += deltaY/normalized;

            // enemy hits the player ?
            if (this.collide(this.player, enemy)) {
                this.items++;
                console.log("Haha you got an item!");
                this.enemies.removeChild(enemy);
            }

            // enemy out of the screen?
            if (enemy.position.x < -enemy.width) {
                //console.log("removed an enemy");
                this.enemies.removeChild(enemy);
            }

            // enemy killed
            if (fireEvent &&
                fireEvent.x > enemy.position.x - enemy.width/2 &&
                fireEvent.x < enemy.position.x + enemy.width/2 &&
                fireEvent.y > enemy.position.y - enemy.height/2 &&
                fireEvent.y < enemy.position.y + enemy.height/2) {
                console.log("enemy KILLED!!");
                this.enemies.removeChild(enemy);
                fireEvent = -1; // consume event
            }
        }

        this.performActions();

        // items
        this.itemsText.setText("Items: " + this.items);
    };

    Game.prototype.collide = function(a, b) {
        var x1 = a.position.x - a.anchor.x*a.width;
        var x2 = a.position.x + (1-a.anchor.x)*a.width;
        var y1 = a.position.y + a.anchor.y*a.height;
        var y2 = a.position.y + (1-a.anchor.y)*a.height;
        var p1 = {x: x1, y: y1};
        var p2 = {x: x2, y: y1};
        var p3 = {x: x1, y: y2};
        var p4 = {x: x2, y: y2};
        return (
            this.pointAABB(p1, b) ||
            this.pointAABB(p2, b) ||
            this.pointAABB(p3, b) ||
            this.pointAABB(p4, b)
        );
    };

    Game.prototype.pointAABB = function(point, entity) {
        return (
            point.x < entity.position.x + entity.width/2 &&
            point.x > entity.position.x - entity.width/2 &&
            point.y > entity.position.y - entity.height/2 &&
            point.y < entity.position.y + entity.height/2
        );
    };

    Game.prototype.performActions = function() {
        for (var i in this.input.actions) {
            if (this.input.actions[i])
                this.performAction(i);
        }
    };

    Game.prototype.performAction = function(action) {
        switch(action) {
            case Conf.actions.up:
                this.player.position.y -= 4;
            break;
            case Conf.actions.down:
                this.player.position.y += 4;
            break;
            case Conf.actions.left:
                this.player.position.x -= 4;
            break;
            case Conf.actions.right:
                this.player.position.x += 4;
            break;
        }
    };

    Game.prototype.spawEnemy = function() {
        // new enemy
        var enemy = PIXI.Sprite.fromFrame("enemy.png");
        enemy.anchor.x = enemy.anchor.y = 0.5;
        if (Math.random() < 0.5) enemy.position.x = Conf.canvas.width + enemy.width;
        else enemy.position.x = -enemy.width;
        enemy.position.y = Utils.random(0, Conf.canvas.height);
        this.enemies.addChild(enemy);
    };

    return Game;

});