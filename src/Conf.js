var Conf = Conf || {};

Conf.canvas = {
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