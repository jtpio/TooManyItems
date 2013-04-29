define(['Screen', 'Input'], function(Screen, Input) {

    var Intro = function(main, renderer, sound, physics) {
        Screen.call(this, main, renderer, sound, physics);

        this.texts = Conf.intro.sentences;
        this.whos = Conf.intro.who;
        this.posText = 0;
        this.ancientSpeaking = true;
        this.tweenTime = 1000;
        this.loadStage();
        this.loadTweens();
        this.last = new Date().getTime();
    };

    Intro.constructor = Intro;
    Intro.prototype = Object.create(Screen.prototype);

    Intro.prototype.loadStage = function() {
        // text
        this.text = new PIXI.Text("", "30px Peralta", "#000000", "#d5f6ff", 4);
        this.text.position.x = Conf.canvas.width/2;
        this.text.position.y = Conf.canvas.height/2-100;
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;
        this.text.alpha = 0;
        this.ui.addChild(this.text);

        // escape to skip
        this.escapeToSkip = new PIXI.Text("Escape to skip", "20px Peralta", "#000000", "#d5f6ff", 4);
        this.escapeToSkip.position.x = Conf.canvas.width - 20;
        this.escapeToSkip.position.y = 20;
        this.escapeToSkip.anchor.x = 1;
        this.escapeToSkip.anchor.y = 0;
        this.ui.addChild(this.escapeToSkip);

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

        // tv
        this.tv = PIXI.Sprite.fromFrame("tv_bg.png");
        this.tv.anchor.x = this.tv.anchor.y = 0.5;
        this.tv.position.x = 200;
        this.tv.position.y = 2*Conf.canvas.height/3;
        this.tv.visible = false;
        this.addToStage(this.tv);

        // potato
        this.potato = PIXI.Sprite.fromFrame("potato.png");
        this.potato.anchor.x = this.potato.anchor.y = 0.5;
        this.potato.position.x = 150;
        this.potato.position.y = 2*Conf.canvas.height/3;
        this.potato.visible = false;
        this.addToStage(this.potato);

        // mark
        this.mark = PIXI.Sprite.fromFrame("mark.png");
        this.mark.anchor.x = this.mark.anchor.y = 0.5;
        this.mark.position.x = 300;
        this.mark.position.y = Conf.canvas.height/2;
        this.addToStage(this.mark);

        // instru
        this.instru = PIXI.Sprite.fromFrame("instru.png");
        this.instru.anchor.x = this.instru.anchor.y = 0.5;
        this.instru.position.x = Conf.canvas.width/2;
        this.instru.position.y = Conf.canvas.height/2;
        this.instru.visible = false;
        this.addToStage(this.instru);

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
            if (self.whos[self.posText] == 'hero') {
                self.mark.position.x = self.player.position.x;
            } else {
                self.mark.position.x = self.enemy.position.x;
            }
            switch(self.posText) {
                case 5:
                    self.playerNoWeapon.visible = false;
                    self.player.visible = true;
                    self.text.setText(self.texts[self.posText]);
                    self.tweenFadeIn.start();
                    break;
                case 9:
                    self.tv.visible = true;
                    self.text.setText(self.texts[self.posText]);
                    self.tweenFadeIn.start();
                    break;
                case 11:
                    self.potato.visible = true;
                    self.text.setText(self.texts[self.posText]);
                    self.tweenFadeIn.start();
                    break;
                case self.texts.length: // finished
                    self.instructions(self);
                    break;
                default:
                    self.text.setText(self.texts[self.posText]);
                    self.tweenFadeIn.start();
                    break;
            }
            self.posText++;
        });
        this.tweenFadeOut.easing(TWEEN.Easing.Cubic.Out);
    };

    Intro.prototype.start = function() {
        this.sound.play("music_intro");
        this.input = new Input();
        this.tweenFadeIn.start();
    };

    Intro.prototype.instructions = function() {
        this.text.visible = false;
        this.playerNoWeapon.visible = false;
        this.player.visible = false;
        this.enemy.visible = false;
        this.tv.visible = false;
        this.potato.visible = false;
        this.mark.visible = false;
        this.instru.visible = true;
    };

    Intro.prototype.play = function(self) {
        this.sound.stop('music_intro');
        self.main.intro.hide();
        self.main.game.show();
        self.main.game.start();
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
        this.performActions(dt);
        TWEEN.update();
    };

    Intro.prototype.performActions = function(dt) {
        for (var i in this.input.actions) {
            if (this.input.actions[i])
                this.performAction(i, dt);
        }
    };

    Intro.prototype.performAction = function(action, dt) {
        switch(action) {
            case Conf.actions.escape:
                this.play(this);
            break;
        }
    };

    return Intro;
});