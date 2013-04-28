define(['Screen' ,'Input', 'Map', 'Camera', 'Entity', 'Player', 'Enemy', 'EnemyManager'],
        function(Screen, Input, Map, Camera, Entity, Player, Enemy, EnemyManager) {

    var Game = function(main, renderer, sound, physics) {
        Screen.call(this, main, renderer, sound, physics);
        this.reset(true);
    };

    Game.constructor = Game;
    Game.prototype = Object.create(Screen.prototype);

    Game.prototype.loadStage = function(firstLoad) {

        if (firstLoad) {
            // tile texture
            var tileTexture = PIXI.Texture.fromImage("assets/sprites/tiles.png");
            this.tilingSprite = new PIXI.TilingSprite(tileTexture, Conf.canvas.width, Conf.canvas.height);
            this.addToStage(this.tilingSprite);
            // map
            this.map = new Map();
            this.renderer.addMapToStage(this.map, this.stage);
            // initialize camera
            this.camera = new Camera();
            // aiming line
            var aimSprite = PIXI.Sprite.fromFrame("aim.png");
            this.aim = new Entity(aimSprite);
            this.addToStage(this.aim.sprite);
            // player
            var playerSprite = PIXI.Sprite.fromFrame("player.png");
            this.player = new Player(playerSprite);
            this.addToStage(this.player.sprite);
            // enemies container
            this.enemyManager = new EnemyManager(this);
            this.enemyManager.addContainersToStage();
            // items text
            this.itemsText = new PIXI.Text("Items: " + this.items, "bold 60px Peralta", "#000000", "#d5f6ff", 3);
            this.ui.addChild(this.itemsText);
            // timer text
            this.timerText = new PIXI.Text('00\'00"', "bold 60px Peralta", "#000000", "#d5f6ff", 3);
            this.ui.addChild(this.timerText);
            // lose text
            this.endText = new PIXI.Text('You survived ', "bold 60px Peralta", "#000000", "#d5f6ff", 3);
            this.ui.addChild(this.endText);
            // restart text
            this.restartText = new PIXI.Text('Restart?', "bold 60px Peralta", "#000000", "#d5f6ff", 3);
            this.restartText.click = $.proxy(function() {
                this.restart();
            }, this);
            this.ui.addChild(this.restartText);
        }

        // tile texture
        this.tilingSprite.tileScale.x = 1;
        this.tilingSprite.tileScale.y = 1;
        // reset map
        // TODO

        // initialize camera
        this.camera.init(this.map.bounds);
        // aim
        this.aim.anchor.x = this.aim.anchor.y = 0.5;
        this.aim.scale.x = 100;
        this.aim.scale.y = 5;

        // player
        this.player.anchor.x = this.player.anchor.y = 0.5;
        this.player.pos.x = Conf.canvas.width/2;
        this.player.pos.y = Conf.canvas.height/2;

        this.aim.pos = this.player.pos;

        // items text
        this.itemsText.setText("Items: " + this.items);
        this.itemsText.position.x = 20;
        this.itemsText.position.y = 20;

        // timer text
        this.timerText.setText('00\'00"');
        this.timerText.position.x = Conf.canvas.width - 20;
        this.timerText.position.y = 20;
        this.timerText.anchor.x = 1;

        // lose text
        this.endText.setText('You survived ');
        this.endText.position.x = Conf.canvas.width/2;
        this.endText.position.y = Conf.canvas.height/2 - 100;
        this.endText.anchor.x = this.endText.anchor.y = 0.5;

        // restart text
        this.restartText.setText('Restart?');
        this.restartText.position.x = Conf.canvas.width/2;
        this.restartText.position.y = Conf.canvas.height/2 + 100;
        this.restartText.anchor.x = this.restartText.anchor.y = 0.5;
    };

    Game.prototype.setupInputs = function(firstLoad) {
        if (!firstLoad) return;
        var self = this;
        this.renderer.renderer.view.addEventListener("mousemove", function(data) {
            self.mouse = data;
        }, true);


        this.clickListener = function(data) {
            if (self.focus && self.player.state == Conf.player.states.PLAYING) {
                self.sound.play("beam");
                var mouseWorld = self.camera.canvasToWorld(data.global);
                self.fireEvents.push(mouseWorld);
            }
        };

        //this.renderer.renderer.view.addEventListener("click", self.clickListener, true);
        this.stage.click = self.clickListener;

        // keyboard inputs
        this.input = new Input();
    };

    Game.prototype.reset = function(firstLoad) {
        this.loadStage(firstLoad);
        this.setupInputs(firstLoad);
        this.items = 1; // only the weapon
        this.timer = 0;
        this.fireEvents = [];
        this.last = new Date().getTime();
    };

    Game.prototype.start = function() {
        this.input = new Input();
        this.endText.visible = false;
        this.restartText.visible = false;
        this.endText.setInteractive(false);
        this.restartText.setInteractive(false);
        this.player.state = Conf.player.states.PLAYING;
     };

     Game.prototype.dispose = function() {
        this.enemyManager.dispose();
     };

     Game.prototype.restart = function() {
        this.reset();
        this.start();
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

        switch (this.player.state) {
            case Conf.player.states.LOST:
                this.endText.setText("You survived " + Utils.secondsToString(this.timer));
                return;

        }
        // update timer game
        this.timer += dt;
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

        if (this.items >= Conf.player.maxItems) {
            this.lose();
            return;
        }

        // updates
        this.enemyManager.update(dt, fireEvent);
        this.performActions(dt);
        this.updateCamera();
        this.boundsCheck(this.player);
        // texts
        this.itemsText.setText("Items: " + this.items);
        this.timerText.setText(Utils.secondsToString(this.timer));

        // TWEEN
        TWEEN.update();
    };

    Game.prototype.lose = function() {
        this.player.state = Conf.player.states.LOST;
        this.endText.setInteractive(true);
        this.restartText.setInteractive(true);
        this.endText.visible = true;
        this.restartText.visible = true;
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