define(['Screen'], function(Screen) {

    var Intro = function(main, renderer, sound, physics) {
        Screen.call(this, main, renderer, sound, physics);

        this.texts = Conf.intro.sentences;
        this.posText = 0;
        this.ancientSpeaking = true;
        this.tweenTime = 100; // 2000
        this.loadStage();
        this.loadTweens();
        this.last = new Date().getTime();
    };

    Intro.constructor = Intro;
    Intro.prototype = Object.create(Screen.prototype);

    Intro.prototype.loadStage = function() {
        // text
        this.text = new PIXI.Text(this.texts[this.posText], "30px Peralta", "#000000", "#d5f6ff", 4);
        this.text.position.x = Conf.canvas.width/2;
        this.text.position.y = Conf.canvas.height/2-100;
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;
        this.text.alpha = 0;
        this.ui.addChild(this.text);

        // hero
        this.playerNoWeapon = PIXI.Sprite.fromFrame("player_noweapon.png");
        this.playerNoWeapon.anchor.x = this.playerNoWeapon.anchor.y = 0.5;
        this.playerNoWeapon.position.x = 300;
        this.playerNoWeapon.position.y = 2*Conf.canvas.height/3;
        this.addToStage(this.playerNoWeapon);

        this.player = PIXI.Sprite.fromFrame("player.png");
        this.player.anchor.x = this.player.anchor.y = 0.5;
        this.player.position.x = 300;
        this.player.position.y = 2*Conf.canvas.height/3;
        this.player.visible = false;
        this.addToStage(this.player);

        // ancient
        this.enemy = PIXI.Sprite.fromFrame("oldEnemy_1.png");
        this.enemy.anchor.x = this.enemy.anchor.y = 0.5;
        this.enemy.position.x = Conf.canvas.width - 300;
        this.enemy.position.y = 2*Conf.canvas.height/3;
        this.addToStage(this.enemy);

    };

    Intro.prototype.loadTweens = function() {
        var self = this;
        var position = {val:0};
        var target = {val:1};
        this.tweenFadeIn = new TWEEN.Tween(position).to(target, self.tweenTime);
        this.tweenFadeIn.onUpdate(function() {
            self.text.alpha = position.val;
        });
        this.tweenFadeIn.onComplete(function() {
            self.tweenWait.start();
        });
        this.tweenFadeIn.easing(TWEEN.Easing.Cubic.In);

        var position1 = {val:0};
        var target1 = {val:1};
        this.tweenWait = new TWEEN.Tween(position1).to(target1, self.tweenTime);
        this.tweenWait.onUpdate(function() {
            // nothing
        });
        this.tweenWait.onComplete(function() {
            self.tweenFadeOut.start();
        });
        this.tweenWait.easing(TWEEN.Easing.Cubic.In);

        var position2 = {val:0};
        var target2 = {val:1};
        this.tweenFadeOut = new TWEEN.Tween(position2).to(target2, self.tweenTime);
        this.tweenFadeOut.onUpdate(function() {
            self.text.alpha = 1-position2.val;
        });
        this.tweenFadeOut.onComplete(function() {
            self.posText++;
            switch(self.posText) {
                case 4: // finished
                    self.playerNoWeapon.visible = false;
                    self.player.visible = true;
                    self.text.setText(self.texts[self.posText]);
                    self.tweenFadeIn.start();
                    break;
                case self.texts.length: // finished
                    self.main.intro.hide();
                    self.main.game.show();
                    self.main.game.start();
                    break;
                default:
                    self.text.setText(self.texts[self.posText]);
                    self.tweenFadeIn.start();
                    break;
            }
        });
        this.tweenFadeOut.easing(TWEEN.Easing.Cubic.Out);
    };

    Intro.prototype.start = function() {
        this.tweenFadeIn.start();
    };

    Intro.prototype.tick = function() {
        if (!this.focus) return;
        var current = new Date().getTime();
        var dt = (current - this.last) / 1000;
        this.update(dt);
        this.renderer.render(this.stage);
        this.last = current;
        requestAnimFrame(this.tick.bind(this));
    };

    Intro.prototype.update = function(dt) {

        TWEEN.update();
    };

    return Intro;
});