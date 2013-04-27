define(['Screen' ,'Input', 'Map', 'Camera', 'Entity', 'Player', 'Enemy'], function(Screen, Input, Map, Camera, Entity, Player, Enemy) {

    var Game = function(main, renderer, sound, physics) {
        Screen.call(this, main, renderer, sound, physics);

        this.loadStage();
        this.setupInputs();
        this.mouse = {x: 10, y: 10};

        this.fireEvents = [];

        this.items = 1; // only the weapon
        this.timer = 0;

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

        // map
        this.map = new Map();
        this.renderer.addMapToStage(this.map, this.stage);

        // initialize camera
        this.camera = new Camera();
        this.camera.init(this.map.bounds);

        // player
        var playerSprite = PIXI.Sprite.fromFrame("player.png");
        this.player = new Player(playerSprite);
        this.player.anchor.x = this.player.anchor.y = 0.5;
        this.player.pos.x = Conf.canvas.width/2;
        this.player.pos.y = Conf.canvas.height/2;
        this.stage.addChild(this.player.sprite);

        var beamSprite = PIXI.Sprite.fromFrame("beam.png");
        this.beam = new Entity(beamSprite);
        this.beam.anchor.x = this.beam.anchor.y = 0.5;
        this.beam.pos = this.player.pos;
        this.beam.scale.y = 30;
        this.beam.scale.x = 2;
        this.stage.addChild(this.beam.sprite);

        // add enemies container
        this.enemies = [];
        this.enemiesSprites = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.enemiesSprites);

        // items text
        this.itemsText = new PIXI.Text("Items: " + this.items, "bold 60px Arial", "#000000", "#a4410e", 3);
        this.itemsText.position.x = 20;
        this.itemsText.position.y = 20;
        this.stage.addChild(this.itemsText);

        // timer text
        this.timerText = new PIXI.Text('00\'00"', "bold 60px Arial", "#000000", "#a4410e", 3);
        this.timerText.position.x = Conf.canvas.width - 20;
        this.timerText.position.y = 20;
        this.timerText.anchor.x = 1;

        this.stage.addChild(this.timerText);
    };

    Game.prototype.setupInputs = function() {
        var self = this;
        this.renderer.renderer.view.addEventListener("mousemove", function(data) {
            self.mouse = data;
        }, true);

        this.renderer.renderer.view.addEventListener("click", function(data) {
            console.log("click on stage");
            self.sound.play("sound_muted");
            var mouseWorld = self.camera.canvasToWorld(data);
            self.fireEvents.push(mouseWorld);
        }, true);

        // keyboard inputs
        this.input = new Input();
    };

    Game.prototype.tick = function() {
        if (!this.focus) return;
        this.renderer.stats.begin();
        var current = new Date().getTime();
        var dt = (current - this.last) / 1000; // seconds
        this.update(dt);
        this.renderer.render(this.stage);
        this.last = current;
        this.renderer.stats.end();
        requestAnimFrame(this.tick.bind(this));
    };

    Game.prototype.update = function(dt) {
        // update timer game
        this.timer += dt;

        this.camera.targetEntity(this.player);

        var mouseWorld = this.camera.canvasToWorld(this.mouse);
        var deltaX = mouseWorld.x - this.player.pos.x;
        var deltaY = mouseWorld.y - this.player.pos.y;
        this.player.rotation(Math.atan2(deltaY, deltaX) - Math.PI/2);

        this.beam.rotation(this.player.getRotation());

        if (Math.random() < 0.01) this.spawEnemy();

        // consume fire event
        var fireEvent = this.fireEvents.shift();

        // update enemies
        this.toDie = []; // list of dead enemies
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            deltaX = this.player.pos.x - enemy.pos.x;
            deltaY = this.player.pos.y - enemy.pos.y;
            enemy.rotation(Math.atan2(deltaY, deltaX) - Math.PI/2);

            // move
            var normalized = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
            enemy.pos.x += (deltaX/normalized) * Conf.enemy.speed * dt;
            enemy.pos.y += (deltaY/normalized) * Conf.enemy.speed * dt;

            // enemy hits the player ?
            if (this.collide(this.player, enemy)) {
                this.items++;
                console.log("Haha you got an item!");
                this.toDie.push(i);
            }
            // enemy killed
            else if (fireEvent && this.physics.lineCircle(this.player.pos, fireEvent, enemy)) {
                console.log("enemy KILLED!!");
                this.toDie.push(i);
                fireEvent = -1; // consume event
            }
            /*
            else if (fireEvent &&
                fireEvent.x > enemy.pos.x - enemy.width/2 &&
                fireEvent.x < enemy.pos.x + enemy.width/2 &&
                fireEvent.y > enemy.pos.y - enemy.height/2 &&
                fireEvent.y < enemy.pos.y + enemy.height/2) {
                console.log("enemy KILLED!!");
                this.toDie.push(i);
                fireEvent = -1; // consume event
            }
            */

            // enemy out of the screen? => IMPOSSIBLE if map built correctly
        }

        this.performActions(dt);

        this.killEnemies();
        this.updateCamera();

        // texts
        this.itemsText.setText("Items: " + this.items);
        this.timerText.setText(Utils.secondsToString(this.timer));
    };

    Game.prototype.killEnemies = function() {
        for (var i = this.toDie.length-1; i >= 0; --i) {
            this.enemiesSprites.removeChild(this.enemies[i].sprite);
            this.enemies.splice(i, 1);
        }
    };

    // convert from world coordinates to camera coordinates
    Game.prototype.updateCamera = function() {
        // tiling sprite (background)
        this.tilingSprite.tilePosition.x = this.camera.x;
        this.tilingSprite.tilePosition.y = -this.camera.y;
        // player
        this.updateEntity(this.player);
        // beam
        this.updateEntity(this.beam);
        // enemies
        for (var i = 0; i < this.enemies.length; i++) {
            this.updateEntity(this.enemies[i]);
        }
        this.map.update(this.camera);
    };

    Game.prototype.updateEntity = function(entity) {
        var posScreen = this.camera.transform(entity.pos);
        entity.position.x = posScreen.x;
        entity.position.y = posScreen.y;
    };

    Game.prototype.collide = function(a, b) {
        return this.physics.collisionAABB(a,b);
    };

    Game.prototype.performActions = function(dt) {
        for (var i in this.input.actions) {
            if (this.input.actions[i])
                this.performAction(i, dt);
        }
    };

    Game.prototype.performAction = function(action, dt) {
        switch(action) {
            case Conf.actions.up:
                this.player.pos.y -= Conf.player.speed * dt;
            break;
            case Conf.actions.down:
                this.player.pos.y +=  Conf.player.speed * dt;
            break;
            case Conf.actions.left:
                this.player.pos.x -=  Conf.player.speed * dt;
            break;
            case Conf.actions.right:
                this.player.pos.x +=  Conf.player.speed * dt;
            break;
        }
    };

    Game.prototype.spawEnemy = function() {
        // new enemy
        var enemySprite = PIXI.Sprite.fromFrame("enemy.png");
        var enemy = new Enemy(enemySprite);
        enemy.anchor.x = enemy.anchor.y = 0.5;
        enemy.pos.x = Conf.canvas.width;
        enemy.pos.y = Utils.random(0, Conf.canvas.height);
        this.enemies.push(enemy);
        this.enemiesSprites.addChild(enemy.sprite);
    };

    return Game;

});