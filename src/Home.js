define(['Screen'], function(Screen) {

    var Home = function(main, renderer, sound) {
        Screen.call(this, main, renderer, sound);

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

        // textures for play button
        var playTexture = PIXI.Texture.fromImage("play.png");

        // button
        this.playButton = new PIXI.Sprite(playTexture);
        this.playButton.position.x = Conf.canvas.width / 2 - this.playButton.width / 2;
        this.playButton.position.y = Conf.canvas.height / 2;

        this.playButton.setInteractive(true);
        this.playButton.click = $.proxy(this.onPlayClicked, this);

        this.stage.addChild(this.playButton);
        this.ui.push(this.playButton);
    };

    Home.prototype.onPlayClicked = function(data) {
        console.log("clicked on playButton!");
        this.sound.play("channel_created");
        this.hide();
        this.main.game.show();
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
    };

    return Home;

});