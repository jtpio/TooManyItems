var Conf = Conf || {};

Conf.canvas = {
    width: 1024,
    height: 550
};

Conf.home = {
    nbObjects: 20
};

Conf.objects = [
    'tv',
    'potato',
    'potatoSource'
];

Conf.intro = {
    sentences: [
        'Welcome young hero ...',
        'Your quest is to save - wait for it -',
        'The princess!',
        'But before leaving, you will need my help.',
        'It is dangerous to leave alone, take this laser beam!',
        'Oh wait!',
        'You will also need this TV',
        'and this potato'
    ]
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
    speed: 180,
    maxItems: 42,
    states: {
        WAIT: 1,
        PLAYING: 2,
        LOST: 3,
        WIN: 4
    }
};

Conf.enemy = {
    max: 50,
    speed: 200,
    states: {
        STOPPED: 1,
        FETCHING: 2,
        BRINGING: 3,
        CRAZY: 4
    },
    actions: {
        NONE: 0,
        NEW_ITEM: 1,
        GAVE_ITEM: 2
    }
};

Conf.map = {
    width: 50, // in blocks of 32px
    height: 50,// in blocks of 32px
    tileSize: 32
};