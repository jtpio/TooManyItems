define(['Enemy'], function(Enemy){

    var EnemyManager = function(game) {
        this.game = game;
        this.nb = 20; // number of enemies
        this.enemies = [];
        this.enemiesSprites = new PIXI.DisplayObjectContainer();
    };

    EnemyManager.prototype.update = function(dt, fireEvent) {
        var g = this.game;
        this.toDie = [];
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            enemy.update(dt);

            // enemy hits the player ?
            if (g.collide(g.player, enemy)) {
                g.sound.play("hurt");
                g.items++;
                console.log("Haha you got an item!");
                this.toDie.push(i);
            }
            // enemy killed
            else if (fireEvent && g.physics.lineCircle(g.player.pos, fireEvent, enemy)) {
                console.log("enemy KILLED!!");
                this.toDie.push(i);
            }
        }

        this.killEnemies();

        // spawn new enemies
        if (Math.random() < 0.02) this.spawEnemy();
    };

    EnemyManager.prototype.updateCamera = function() {
        for (var i = 0; i < this.enemies.length; i++) {
            this.game.updateEntityCamera(this.enemies[i]);
        }
    };

    EnemyManager.prototype.killEnemies = function() {
        for (var i = this.toDie.length-1; i >= 0; --i) {
            this.enemiesSprites.removeChild(this.enemies[i].sprite);
            this.enemies.splice(i, 1);
        }
    };

    EnemyManager.prototype.spawEnemy = function() {
        // new enemy
        var enemySprite = PIXI.Sprite.fromFrame("enemy.png");

        var enemyWalkingTextures = [];
        for (var i = 0; i < 7; i++)  {
            var texture = PIXI.Texture.fromFrame("enemy_" + (i+1) + ".png");
            enemyWalkingTextures.push(texture);
        }
        var enemyWalking = new PIXI.MovieClip(enemyWalkingTextures);

        var enemy = new Enemy(enemyWalking);
        enemy.anchor.x = enemy.anchor.y = 0.5;
        enemy.pos.x = Conf.canvas.width;
        enemy.pos.y = Utils.random(0, Conf.canvas.height);
        enemy.map = this.game.map;
        enemy.setTarget({pos:{
            x: enemy.pos.x + 10,
            y: enemy.pos.y + 10
        }});
        enemy.state = Conf.enemy.states.CRAZY;

        this.enemies.push(enemy);
        this.enemiesSprites.addChild(enemy.sprite);

        // start animation
        enemyWalking.loop = true;
        enemyWalking.animationSpeed = 0.3;
        enemyWalking.play();
    };

    return EnemyManager;
});