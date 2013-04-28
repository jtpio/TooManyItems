define(['Screen' ,'Input', 'Map', 'Camera', 'Entity', 'Player', 'Enemy', 'EnemyManager'],
        function(Screen, Input, Map, Camera, Entity, Player, Enemy, EnemyManager) {

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
        this.addToStage(this.tilingSprite);

        // map
        this.map = new Map();
        this.renderer.addMapToStage(this.map, this.stage);

        // initialize camera
        this.camera = new Camera();
        this.camera.init(this.map.bounds);

        // aiming line
        var aimSprite = PIXI.Sprite.fromFrame("aim.png");
        this.aim = new Entity(aimSprite);
        this.aim.anchor.x = this.aim.anchor.y = 0.5;
        this.aim.scale.x = 100;
        this.aim.scale.y = 5;
        this.addToStage(this.aim.sprite);

        // player
        var playerSprite = PIXI.Sprite.fromFrame("player.png");
        this.player = new Player(playerSprite);
        this.player.anchor.x = this.player.anchor.y = 0.5;
        this.player.pos.x = Conf.canvas.width/2;
        this.player.pos.y = Conf.canvas.height/2;
        this.addToStage(this.player.sprite);

        this.aim.pos = this.player.pos;

        // add enemies container
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.addContainersToStage(this.stage);

        // items text
        this.itemsText = new PIXI.Text("Items: " + this.items, "bold 60px Peralta", "#000000", "#d5f6ff", 3);
        this.itemsText.position.x = 20;
        this.itemsText.position.y = 20;
        this.ui.addChild(this.itemsText);

        // timer text
        this.timerText = new PIXI.Text('00\'00"', "bold 60px Peralta", "#000000", "#d5f6ff", 3);
        this.timerText.position.x = Conf.canvas.width - 20;
        this.timerText.position.y = 20;
        this.timerText.anchor.x = 1;

        this.ui.addChild(this.timerText);

        // sounds
        this.sound.sounds["footsteps_1"].playing = false;
    };

    Game.prototype.setupInputs = function() {
        var self = this;
        this.renderer.renderer.view.addEventListener("mousemove", function(data) {
            self.mouse = data;
        }, true);

        this.renderer.renderer.view.addEventListener("click", function(data) {
            console.log("click on stage");
            self.sound.play("beam");
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
        var self = this;
        // update timer game
        this.timer += dt;

        if (this.items >= Conf.player.maxItems) {
            this.player.states = Conf.player.states.LOST;
            return;
        }

        this.camera.targetEntity(this.player);

        var mouseWorld = {
            pos: this.camera.canvasToWorld(this.mouse)
        };
        this.player.lookAt(mouseWorld);
        this.aim.rotation(this.player.getRotation() + Math.PI/2);

        // consume fire event
        var fireEvent = this.fireEvents.shift();

        // draw laser beam on fire event
        if (fireEvent) {
            var beamSprite = PIXI.Sprite.fromFrame("beam.png");
            beamSprite.anchor.x = beamSprite.anchor.y = 0.5;
            beamSprite.x = this.player.pos.x;
            beamSprite.y = this.player.pos.y;
            beamSprite.scale.x = 200;
            beamSprite.scale.y = 0.25;
            beamSprite.rotation = this.player.getRotation() + Math.PI/2;
            this.addToStage(beamSprite);
            this.stage.swapChildren(beamSprite, this.player.sprite);

            var alphaStart = {val:0}; var alphaEnd = {val:1};
            var tween = new TWEEN.Tween(alphaStart).to(alphaEnd, 1500);
            tween.onUpdate(function(){
                beamSprite.alpha = 1-alphaStart.val;
                var newPos = self.camera.transform(beamSprite);
                beamSprite.position.x = newPos.x;
                beamSprite.position.y = newPos.y;
            });
            tween.onComplete(function() {
                self.stage.removeChild(beamSprite);
            });
            tween.easing(TWEEN.Easing.Bounce.InOut);
            tween.start();
        }

        this.enemyManager.update(dt, fireEvent);

        // inputs
        this.performActions(dt);

        // physics
        //this.collisions(dt);

        // updates
        this.updateCamera();
        // player bounds check (enemies can go out of the screen, WHO CARES??)
        this.boundsCheck(this.player);

        // texts
        this.itemsText.setText("Items: " + this.items);
        this.timerText.setText(Utils.secondsToString(this.timer));

        // TWEEN
        TWEEN.update();
    };

    // convert from world coordinates to camera coordinates
    Game.prototype.updateCamera = function() {
        // tiling sprite (background)
        this.tilingSprite.tilePosition.x = this.camera.x;
        this.tilingSprite.tilePosition.y = -this.camera.y;
        // player
        this.updateEntityCamera(this.player);
        // aim
        this.updateEntityCamera(this.aim);
        // enemies
        this.enemyManager.updateCamera();
        // map
        this.map.update(this.camera);
    };

    Game.prototype.updateEntityCamera = function(entity) {
        if (!this.camera.isVisible(entity)) entity.sprite.visible = false;
        entity.sprite.visible = true;
        var posScreen = this.camera.transform(entity.pos);
        entity.position.x = posScreen.x;
        entity.position.y = posScreen.y;
    };

    Game.prototype.boundsCheck = function(entity) {
        if (entity.pos.x - entity.width/2 < this.map.limits.xmin) entity.pos.x = this.map.limits.xmin + entity.width/2;
        if (entity.pos.x + entity.width/2 > this.map.limits.xmax) entity.pos.x = this.map.limits.xmax - entity.width/2;
        if (entity.pos.y - entity.height/2 < this.map.limits.ymin) entity.pos.y = this.map.limits.ymin + entity.height/2;
        if (entity.pos.y + entity.height/2 > this.map.limits.ymax) entity.pos.y = this.map.limits.ymax - entity.height/2;
    };

    /*
    Game.prototype.collisions = function(dt) {
        // player
        var neighbors = this.map.getAllNeighbors(this.player);
        for (var i = 0; i < neighbors.length; i++) {
            if (neighbors[i] !== -1) {
                var c = this.collide(this.player, neighbors[i]);
                if (Utils.getBit(c, this.physics.LEFT)) {
                    this.player.pos.x = neighbors[i].pos.x + neighbors[i].width + 15;
                }
                if (Utils.getBit(c, this.physics.TOP)) {
                    //this.player.pos.y = neighbors[i].pos.y - neighbors[i].height + 15;
                }
                if (Utils.getBit(c, this.physics.DOWN)) {
                    this.player.pos.y = neighbors[i].pos.y + neighbors[i].height -15;
                }
                if (Utils.getBit(c, this.physics.RIGHT)) {
                    //this.player.pos.x = neighbors[i].pos.x - neighbors[i].height - 15;
                }

            }
        }
    };
    */

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
        var movement = false;
        switch(action) {
            case Conf.actions.up:
                this.player.pos.y -= Conf.player.speed * dt;
                movement = true;
            break;
            case Conf.actions.down:
                this.player.pos.y +=  Conf.player.speed * dt;
                movement = true;
            break;
            case Conf.actions.left:
                this.player.pos.x -=  Conf.player.speed * dt;
                movement = true;
            break;
            case Conf.actions.right:
                this.player.pos.x +=  Conf.player.speed * dt;
                movement = true;
            break;
        }

    };

    return Game;

});