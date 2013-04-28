var Conf = Conf || {};

Conf.canvas = {
    width: 1024,
    height: 550
};


Conf.camera = {
    width: 1024,
    height: 550
};

// to go fullscreen
Conf.ratios = {
    x: window.innerWidth / Conf.canvas.width,
    y: window.innerHeight / Conf.canvas.height
};

Conf.actions = {
    up: "up",
    down: "down",
    left: "left",
    right: "right"
};

Conf.player = {
    speed: 180
};

Conf.enemy = {
    speed: 200,
    states: {
        STOPPED: 1,
        FETCHING: 2,
        BRINGING: 3,
        CRAZY: 4
    }
};

Conf.map = {
    width: 50, // in blocks of 32px
    height: 50,// in blocks of 32px
    tileSize: 32
};