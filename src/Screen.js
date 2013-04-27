define(function() {

    var Screen = function(main, renderer, sound, physics) {
        this.main = main;
        this.renderer = renderer;
        this.sound = sound;
        this.physics = physics;
        this.focus = false;
        this.stage = new PIXI.Stage(0x97c56e, true); // interactive
        this.ui = [];
    };

    Screen.prototype.show = function() {
        if (this.focus) return; // already displayed
        for (var i in this.ui) {
            this.ui[i].visible = true;
        }
        this.last = new Date().getTime();
        this.focus = true;
        requestAnimFrame(this.tick.bind(this));
    };

    Screen.prototype.hide = function() {
        this.focus = false;
        for (var i in this.ui) {
            this.ui[i].visible = false;
        }
    };

    return Screen;
});