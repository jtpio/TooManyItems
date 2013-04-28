define(function() {

    var Screen = function(main, renderer, sound, physics) {
        this.main = main;
        this.renderer = renderer;
        this.sound = sound;
        this.physics = physics;
        this.focus = false;
        this.stage = new PIXI.Stage(0x000000, true); // interactive
        this.ui = new PIXI.DisplayObjectContainer();
        this.stage.addChild(this.ui);
    };

    Screen.prototype.show = function() {
        if (this.focus) return; // already displayed
        for (var i in this.ui.children) {
            this.ui.children[i].visible = true;
        }
        this.last = new Date().getTime();
        this.focus = true;
        requestAnimFrame(this.tick.bind(this));
    };

    Screen.prototype.hide = function() {
        this.focus = false;
        for (var i in this.ui.children) {
            this.ui.children[i].visible = false;
        }
    };

    // always keep the ui on top of everything
    Screen.prototype.addToStage = function(displayObject) {
        this.stage.addChild(displayObject);
        this.stage.swapChildren(displayObject, this.ui);
    };

    return Screen;
});