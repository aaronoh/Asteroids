var gameProperties = {
    screenWidth: 640,
    screenHeight: 960,
};

var states = {
    game: "game",
};

var shipParameters = {
    startX: gameProperties.screenWidth * 0.5,
    startY: gameProperties.screenHeight * 0.5,
    //speed of velocity increase
    acceleration: 300,
    //friction - slows down sprite 
    drag: 100,
    //max 'speed'
    maxVelocity: 300,
    //max rotation 'speed'
    angularVelocity: 200,
};

var bulletParameters = {
    //max rendered at a time
    maxCount: 30,
    //velocity
    speed: 400,
    //milliseconds per round
    interval: 250,
    //time it will be exist
    lifespan: 2000,
};

var gameState = function(game){
    this.shipSprite;
    
    this.key_left;
    this.key_right;
    this.key_thrust;
    this.bulletGroup;
    this.bulletInterval = 0;
};

gameState.prototype = {
    
    preload: function () {
        //preload image - name + url
        //game.load.image('ship', './asset/ship.png');
        game.load.image('bullet', './asset/bullet.png');        
        game.load.image('asteroidS', './asset/asteroidS.png');
        game.load.image('asteroidM', './asset/asteroidM.png');
        game.load.image('asteroidL', './asset/asteroidL.png');
        game.load.spritesheet('shipSprite','./asset/newSpriteSheet.png', 80, 48, 10);   
    },
    
    create: function () {
        this.initAssets();
        this.initPhysics();
    },

    update: function () {
        this.userInput();
        //let ship go from edge to edge of canvas
        this.canvasBoundaries(this.shipSprite);
        //let bullets go from edge to edge of canvas
        this.bulletGroup.forEachExists(this.canvasBoundaries, this);
        
    },
    //placxing the ship sprite on the canvas 
    initAssets: function () {
        this.shipSprite = game.add.sprite(shipParameters.startX, shipParameters.startY,'shipSprite');
        //this.shipSprite = game.add.sprite(shipParameters.startX, shipParameters.startY, 'ship');
        this.shipSprite.angle = 0;
        this.shipSprite.anchor.set(0.1, 0.1);
                
        this.shipSprite.animations.add('shipMovement');
        this.shipSprite.animations.play('shipMovement',5, true);
        
        this.bulletGroup = game.add.group();
    },
    

    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipParameters.drag);
        this.shipSprite.body.maxVelocity.set(shipParameters.maxVelocity);
        //initalize the phaser physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipParameters.drag);
        this.shipSprite.body.maxVelocity.set(shipParameters.maxVelocity);
        
        this.bulletGroup.enableBody = true;
        this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this.bulletGroup.createMultiple(bulletParameters.maxCount, 'bullet');
        this.bulletGroup.setAll('anchor.x', 0);
        this.bulletGroup.setAll('anchor.y', 0);
        this.bulletGroup.setAll('lifespan', bulletParameters.lifespan);
        
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.key_fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    userInput: function () {
        if (this.key_left.isDown) {
            this.shipSprite.body.angularVelocity = -shipParameters.angularVelocity;
        } else if (this.key_right.isDown) {
            this.shipSprite.body.angularVelocity = shipParameters.angularVelocity;
        } else {
            this.shipSprite.body.angularVelocity = 0;
        }
        
        if (this.key_thrust.isDown) {
            console.log(this.shipSprite.rotation);
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation - 3.14/2, shipParameters.acceleration, this.shipSprite.body.acceleration);
        } else {
            this.shipSprite.body.acceleration.set(0);
        }
        
        if (this.key_fire.isDown) {
            this.fire();
        }
    },
    
//stop sprite from leaving canvas - can go from edge to edge
    canvasBoundaries: function (sprite) {
        if (sprite.x < 0) {
            sprite.x = game.width;
        } else if (sprite.x > game.width) {
            sprite.x = 0;
        } 
 
        if (sprite.y < 0) {
            sprite.y = game.height;
        } else if (sprite.y > game.height) {
            sprite.y = 0;
        }
    },
    

    fire: function () {
        if (game.time.now > this.bulletInterval) {            
            var bullet = this.bulletGroup.getFirstExists(false);
            
            if (bullet) {
                var length = this.shipSprite.width * 0.5;
                var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
                var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);
                
                bullet.reset(x, y);
                bullet.lifespan = bulletParameters.lifespan;
                bullet.rotation = this.shipSprite.rotation;
                
                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation, bulletParameters.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletParameters.interval;
            }
        }
    },

    fire: function () {
        //check that game clock has passed interval 
        if (game.time.now > this.bulletInterval) {   
            //get first object in group, false - doesnt exist
            var bullet = this.bulletGroup.getFirstExists(false);
            ///if bullet successfully retrieved 
            if (bullet) {
                //place bullet at front of ship
                var length = this.shipSprite.width * 0.5;
                //calculate co ords (x,y) of ship based on length and rotation
                var x = this.shipSprite.x + (Math.cos(this.shipSprite.rotation) * length);
                var y = this.shipSprite.y + (Math.sin(this.shipSprite.rotation) * length);
                //creates sprite
                bullet.reset(x, y);
                bullet.lifespan = bulletParameters.lifespan;
                bullet.rotation = this.shipSprite.rotation;
                //set speed of bullet
                game.physics.arcade.velocityFromRotation(this.shipSprite.rotation - 3.5/2, bulletParameters.speed, bullet.body.velocity);
                //update bullet interval
                this.bulletInterval = game.time.now + bulletParameters.interval;
            }
        }
    },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'game');
game.state.add(states.game, gameState);
game.state.start(states.game);