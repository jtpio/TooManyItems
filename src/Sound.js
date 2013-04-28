define(function() {

    var Sound = function() {
        this.sounds = {};
    };

    Sound.prototype.add = function(name, sound) {
        this.sounds[name] = sound;
        this.sounds[name].playing = false;
        this.sounds[name].onplay = function() {
            this.sounds[name].playing = true;
        };
        this.sounds[name].onend = function() {
            this.sounds[name].playing = false;
        };
    };

    Sound.prototype.play = function(soundName) {
        this.sounds[soundName].play();
        this.sounds[soundName].playing = true;
    };

    Sound.prototype.stop = function(soundName) {
        this.sounds[soundName].stop();
        this.sounds[soundName].playing = false;
    };

    Sound.prototype.isPlaying = function(soundName) {
        return this.sounds[soundName].playing;
    };

    return Sound;
});