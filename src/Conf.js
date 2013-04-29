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
        'Welcome young Hero.',
        'Your quest is about to start.',
        'Go to the castle to save ...',
        '... the princess!',
        'But before leaving, you will need my help.',
        'It is dangerous to go alone, take this!',
        'Oh wait!',
        'You will need a lot of useful items.',
        'No thanks, this gun is perfectly fine ...',
        'Take this TV!',
        'But ...',
        'And this potato',
        'WTF?',
        'And also this table ... ',
        'Oh stop that!',
        'I have a minimalist way of life.',
        'Not more than a few items in my bag is enough',
        'Nooo you don\'t understand, they are essential!',
        'Come here and take them',
        'No way, go away!'

    ],
    who: [
        'old',
        'old',
        'old',
        'old',
        'old',
        'old',
        'old',
        'old',
        'hero',
        'old',
        'hero',
        'old',
        'hero',
        'old',
        'hero',
        'hero',
        'hero',
        'old',
        'old',
        'hero'
    ]
};

Conf.camera = {
    width: 1024,
    height: 550
};

// to go fullscreen?
Conf.ratios = {
    x: window.innerWidth / Conf.canvas.width,
    y: window.innerHeight / Conf.canvas.height
};

Conf.actions = {
    up: "up",
    down: "down",
    left: "left",
    right: "right",
    escape: "escape",
    enter: "enter",
    c: "c"
};

Conf.player = {
    speed: 180,
    maxItems: 20,
    states: {
        WAIT: 1,
        PLAYING: 2,
        LOST: 3,
        WIN: 4
    },
    nbShots: 7
};

Conf.enemy = {
    max: 50,
    baseSpeed: 200,
    speed: 200,
    maxSpeed: 500,
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
    tileSize: 32,
    nbSourceSpots: 7
};