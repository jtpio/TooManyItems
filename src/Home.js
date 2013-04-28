define(['Screen'], function(Screen) {

    var Home = function(main, renderer, sound, physics) {
        Screen.call(this, main, renderer, sound, physics);

        this.loadStage();
        this.setupInputs();

        this.last = new Date().getTime();
    };

    Home.constructor = Home;
    Home.prototype = Object.create(Screen.prototype);

    Home.prototype.loadStage = function() {
    };

    Home.prototype.setupInputs = function() {
        var self = this;

        // bg
        this.bg = new PIXI.Sprite.fromFrame("bg.png");
        this.addToStage(this.bg);

        // title text
        this.title = new PIXI.Text("Too Many Items", "80px Peralta", "#006680", "#000000", 10);
        this.title.position.x = Conf.canvas.width/2;
        this.title.position.y = Conf.canvas.height/2 - 100;
        this.title.anchor.x = 0.5;
        this.title.anchor.y = 0.5;
        this.ui.addChild(this.title);

        this.playButton = new PIXI.Text("PLAY", "Bold 100px Peralta", "#000000", "#d5f6ff", 4);
        this.playButton.position.x = Conf.canvas.width/2;
        this.playButton.position.y = Conf.canvas.height/2 + 100;
        this.playButton.anchor.x = 0.5;
        this.playButton.anchor.y = 0.5;
        this.playButton.scale.x = this.playButton.scale.y = 0.8;
        this.playButton.setInteractive(true);
        this.playButton.click = $.proxy(this.onPlayClicked, this);
        this.playButton.mouseover = $.proxy(this.onPlayHovered, this);
        this.playButton.mouseout = $.proxy(this.onPlayOut, this);

        this.ui.addChild(this.playButton);

        this.flyingObjects = new PIXI.DisplayObjectContainer();
        for (var i = 0; i < Conf.home.nbObjects; i++) {
            var r = Utils.random(0, Conf.objects.length - 1);
            var sprite = PIXI.Sprite.fromFrame(Conf.objects[r] + ".png");
            sprite.anchor.x = sprite.anchor.y = 0.5;
            sprite.position.x = Utils.random(0, Conf.canvas.width);
            sprite.position.y = Utils.random(0, Conf.canvas.height);
            sprite.incX = Math.random();
            sprite.incY = Math.random();
            sprite.scale.x = sprite.scale.y = 0.6;
            this.flyingObjects.addChild(sprite);
        }

        this.addToStage(this.flyingObjects);
    };

    Home.prototype.onPlayClicked = function(data) {
        console.log("clicked on playButton!");
        this.sound.play("buttonPressed");
        this.hide();
        this.main.intro.show();
        this.main.intro.start();
    };

    Home.prototype.onPlayHovered = function(data) {
        this.playButton.scale.x = this.playButton.scale.y = 1;
    };

    Home.prototype.onPlayOut = function(data) {
        this.playButton.scale.x = this.playButton.scale.y = 0.8;
    };

    Home.prototype.tick = function() {
        if (!this.focus) return;
        var current = new Date().getTime();
        var dt = (current - this.last) / 1000;
        this.update(dt);
        this.renderer.render(this.stage);
        this.last = current;
        requestAnimFrame(this.tick.bind(this));
    };

    Home.prototype.update = function(dt) {
        for (var i = 0; i < this.flyingObjects.children.length; i++) {
            var obj = this.flyingObjects.children[i];
            obj.rotation += dt;
            obj.position.x += obj.incX * dt * 50;
            obj.position.y += obj.incY * dt * 50;
            if (obj.position.x > Conf.canvas.width || obj.position.x < 0) obj.incX *= -1;
            if (obj.position.y > Conf.canvas.height || obj.position.y < 0) obj.incY *= -1;
        }
    };

    return Home;

});