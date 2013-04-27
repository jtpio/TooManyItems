define(function() {

    var Sound = function() {
        this.sounds = {};
    };

    Sound.prototype.add = function(name, sound) {
        this.sounds[name] = sound;
    };

    Sound.prototype.play = function(soundName) {
        this.sounds[soundName].play();
    };

    return Sound;
});