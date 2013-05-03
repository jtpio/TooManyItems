define(['Screen' ,'Input', 'Map', 'Camera', 'Entity', 'Player', 'Enemy', 'EnemyManager'],
        function(Screen, Input, Map, Camera, Entity, Player, Enemy, EnemyManager) {

    var Game = function(main, renderer, sound, physics) {
        Screen.call(this, main, renderer, sound, physics);
        this.reset(true);
    };

    Game.constructor = Game;
    Game.prototype = Object.create(Screen.prototype);

    Game.prototype.loadStage = function(firstLoad) {
        var self = this;
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
            // items text
            this.itemsText = new PIXI.Text("Items: " + this.items + "/" + Conf.player.maxItems, "bold 60px Peralta", "#000000", "#d5f6ff", 5);
            this.ui.addChild(this.itemsText);
            // timer text
            this.timerText = new PIXI.Text('00\'00"', "bold 60px Peralta", "#000000", "#d5f6ff", 5);
            this.ui.addChild(this.timerText);
            // ammo
            this.ammoSprite = PIXI.Sprite.fromFrame("ammo.png");
            this.ui.addChild(this.ammoSprite);
            // lose text
            this.endText = new PIXI.Text('You survived ', "bold 60px Peralta", "#000000", "#d5f6ff", 6);
            this.ui.addChild(this.endText);
            // restart text
            this.restartText = new PIXI.Text('Restart?', "bold 100px Peralta", "#000000", "#d5f6ff", 10);
            this.restartText.click = $.proxy(function() {
                this.sound.play("buttonReleased");
                this.restart();
            }, this);
            this.restartText.mouseover = $.proxy(function() {
                this.restartText.scale.x = this.restartText.scale.y = 1;
            }, this);
            this.restartText.mouseout = $.proxy(function() {
                this.restartText.scale.x = this.restartText.scale.y = 0.8;
            }, this);
            this.restartText.scale.x = this.restartText.scale.y = 0.8;
            this.ui.addChild(this.restartText);

        }

        // tile texture
        this.tilingSprite.tileScale.x = 1;
        this.tilingSprite.tileScale.y = 1;
        // reset map
        this.map.init();

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
        this.player.reload();
        this.aim.pos = this.player.pos;

        // enemies container
        this.enemyManager = new EnemyManager(this);
        this.enemyManager.addContainersToStage();

        // items text
        this.itemsText.setText("Items: " + this.items);
        this.itemsText.position.x = 20;
        this.itemsText.position.y = 20;

        // timer text
        this.timerText.setText('00\'00"');
        this.timerText.position.x = Conf.canvas.width - 20;
        this.timerText.position.y = 20;
        this.timerText.anchor.x = 1;

        // ammo
        this.ammoSprite.anchor.x = 0;
        this.ammoSprite.anchor.y = 0.5;
        this.ammoSprite.position.x = 20;
        this.ammoSprite.position.y = Conf.canvas.height - 50;
        this.ammoSprite.scale.x = this.player.shots;

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

        this.offsetCanvasX = $('canvas').offset().left;
        this.offsetCanvasY = $('canvas').offset().top;

        this.renderer.renderer.view.addEventListener("mousemove", function(data) {
            var realData = {
                x: Math.max(1, data.pageX - self.offsetCanvasX),
                y: Math.max(1, data.pageY - self.offsetCanvasY)
            };
            self.mouse = realData;
        }, true);

        this.clickListener = function(data) {
            if (self.focus && self.player.state == Conf.player.states.PLAYING) {
                var mouseWorld = self.camera.canvasToWorld(data.global);
                self.fireEvents.push(mouseWorld);
            }
        };

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
        this.sound.play('music_main');
     };

     Game.prototype.dispose = function() {
        this.enemyManager.dispose();
     };

     Game.prototype.restart = function() {
        this.dispose();
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
                this.sound.stop('music_main');
                this.endText.setText("You survived " + Utils.secondsToString(this.timer));
                return;
            case Conf.player.states.WAIT:
                this.sound.stop('music_main');
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
            if (this.player.shots === 0) {
                fireEvent = -1; // consume
            } else {
                this.player.shoot();
                if (this.player.shots === 0) {
                    setTimeout(function(){
                        self.player.reload();
                    }, 3000);
                }
                self.sound.play("beam");
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
        // UI
        this.itemsText.setText("Items: " + this.items + "/" + Conf.player.maxItems);
        this.timerText.setText(Utils.secondsToString(this.timer));
        if (!this.player.reloading) this.ammoSprite.scale.x = this.player.shots;

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