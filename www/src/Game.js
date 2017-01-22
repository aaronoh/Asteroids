var gameProperties = {
    screenWidth: 400,
    screenHeight: 750,
};

var states = {
    game: "game",
};

var fontStyle = {font: '24px Arial', fill: '#FFFFFF', align: 'center'};
var thruster = false;
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
    startingLives: 3,
    timeToReset: 1,
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

var asteroidParameters = {
    //no. of asteroids that appear at the begining
    startingAsteroids: 4,
    //max no. of asteroids on the canvas
    maxAsteroids: 70,
    //number to increase by per round
    incrementAsteroids: 2,
    //min max  velocity = speed min/max AngularVelocity = Rotation
    asteroidS: { minVelocity: 50, maxVelocity: 300, minAngularVelocity: 0, maxAngularVelocity: 200, score: 50 },
    asteroidM: { minVelocity: 50, maxVelocity: 200, minAngularVelocity: 0, maxAngularVelocity: 200, score: 20, splinters: 2, nextSize: 'asteroidS' },
    asteroidL: { minVelocity: 50, maxVelocity: 150, minAngularVelocity: 0, maxAngularVelocity: 200, score: 10, splinters: 2, nextSize: 'asteroidM' },
    
    
};

var gameState = function(game){
    this.shipSprite;
    
    this.key_left;
    this.key_right;
    this.key_thrust;
    
    this.bulletGroup;
    this.bulletInterval = 0;
    
    this.asteroidGroup;
    this.asteroidsCount = asteroidParameters.startingAsteroids;
    //keep track of lives
    this.lives = shipParameters.startingLives;
    //display remaining
    this.remainingLives;
    
};

gameState.prototype = {
    
    preload: function () {
        //preload image - name + url
        //game.load.image('ship', './asset/ship.png');
        game.load.image('bullet', './asset/bullet.png');        
        game.load.image('asteroidS', './asset/asteroidS.png');
        game.load.image('asteroidM', './asset/asteroidM.png');
        game.load.image('asteroidL', './asset/asteroidL.png');
        game.load.image('upArrow', './asset/up-arrow.png');
        game.load.image('leftArrow', './asset/left-arrow.png');
        game.load.image('rightArrow', './asset/right-arrow.png');
        game.load.image('fire', './asset/rec.png');
        game.load.spritesheet('shipSprite','./asset/newSpriteSheet.png', 48, 48, 10);   
    },
    
    create: function () {
        this.initAssets();
        this.initPhysics();
        this.resetAsteroids();

    },

    update: function () {
        this.userInput();
        //let ship go from edge to edge of canvas
        this.canvasBoundaries(this.shipSprite);
        //let bullets go from edge to edge of canvas
        this.bulletGroup.forEachExists(this.canvasBoundaries, this);
        //let asteroids go from edge to edge of canvas
        this.asteroidGroup.forEachExists(this.canvasBoundaries, this);
        //check if bullet and asteroid overlap, pass effected bullet and asteroid to asteroidCollision function
        game.physics.arcade.overlap(this.bulletGroup, this.asteroidGroup, this.asteroidCollision, null, this);
        //check if ship and asteroid overlap, pass effected asteroid and ship to asteroidCollision function
        game.physics.arcade.overlap(this.shipSprite, this.asteroidGroup, this.asteroidCollision, null, this);
        
    },
    //placxing the ship sprite on the canvas 
    initAssets: function () {
        this.shipSprite = game.add.sprite(shipParameters.startX, shipParameters.startY,'shipSprite');
        //this.shipSprite = game.add.sprite(shipParameters.startX, shipParameters.startY, 'ship');
        this.shipSprite.angle = 0;
        this.shipSprite.anchor.set(0.1, 0.1);
        this.shipSprite.scale.setTo(1.5, 1.5);
                
        this.shipSprite.animations.add('shipMovement');
        this.shipSprite.animations.play('shipMovement',5, true);
        
        this.bulletGroup = game.add.group();
        this.asteroidGroup = game.add.group();
        
        //x,y,text,style
        this.remainingLives = game.add.text(20, 10, shipParameters.startingLives, fontStyle);
        
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
        //enabling physics and setting default engine 
        this.asteroidGroup.enableBody = true;
        this.asteroidGroup.physicsBodyType = Phaser.Physics.ARCADE;
        
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
                        
        thrustButton = game.add.button(10, 700, 'upArrow', thrust, this);
        thrustButton.onInputOver.add(thrust, this);
        thrustButton.onInputOut.add(thrust, this);
        thrustButton.onInputUp.add(thrust, this);
        thrustButton.onInputDown.add(thrust, this);  
     function thrust() {
         game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation - 3.14/2, shipParameters.acceleration, this.shipSprite.body.acceleration);
     }
        
        leftButton = game.add.button(300, 700, 'leftArrow', left, this);
        leftButton.onInputOver.add(thrust, this);
        leftButton.onInputOut.add(thrust, this);
        leftButton.onInputUp.add(thrust, this);
        leftButton.onInputDown.add(thrust, this);  
     function left() {
         this.shipSprite.body.angularVelocity = -shipParameters.angularVelocity;
     }
        
        rightButton = game.add.button(375, 700, 'rightArrow', right, this);
        rightButton.onInputOver.add(thrust, this);
        rightButton.onInputOut.add(thrust, this);
        rightButton.onInputUp.add(thrust, this);
        rightButton.onInputDown.add(thrust, this);  
     function right() {
         this.shipSprite.body.angularVelocity = shipParameters.angularVelocity;
     }
        
        fireButton = game.add.button(150, 700, 'fire', fire, this);
        fireButton.onInputOver.add(fire, this);
        fireButton.onInputOut.add(fire, this);
        fireButton.onInputUp.add(fire, this);
        fireButton.onInputDown.add(fire, this);  
     function fire() {
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

     createAsteroid: function (x, y, size, asteroidSize, splinters) {
         //if there is no value defined for no. of splinters, set it to one
        if (splinters === undefined) { splinters = 1; }
        
        for (var i=0; i<splinters; i++) {
            //create new asteroid, adding to asteroid group
            var asteroid = this.asteroidGroup.create(x, y, size);
            asteroid.anchor.set(0.5, 0.5);
            //physics - random velocity
            asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidParameters[size].minAngularVelocity, asteroidParameters[size].maxAngularVelocity);
            //random angle between 180 & -180
            var randomAngle = game.math.degToRad(game.rnd.angle());
            //sets random velocity value for new asteroid
            var randomVelocity = game.rnd.integerInRange(asteroidParameters[size].minVelocity, asteroidParameters[size].maxVelocity);
 
            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },
   
    //create individual asteroids, randomly postion them
    resetAsteroids: function () {
        for (var i=0; i < this.asteroidsCount; i++ ) {
            //returns 0 or 1, left or right
            var side = Math.round(Math.random());
            var x, y;
            //if side is one/true, asteroid is started on left or right of screen 
            if (side) {
                //x value is 0 or 1 multiplied by screenwidth
                x = Math.round(Math.random()) * gameProperties.screenWidth;
                //y value is random value between 0 and full width
                y = Math.random() * gameProperties.screenHeight;
            } 
             //if side is zero/false, asteroid is started on top or bottom of screen 
            else {
                //x value is random value between 0 and full width
                x = Math.random() * gameProperties.screenWidth;
                //y value is 0 or 1 multiplied by screenwidth
                y = Math.round(Math.random()) * gameProperties.screenHeight;
            }
            
            //create asteroid function, pass in x/y/asteroid size(Asset Name)
            this.createAsteroid(x, y,'asteroidL');
            console.log("x: " + x + " y: " +y);
        }
    },



    asteroidCollision: function (target, asteroid) {
        target.kill();
        asteroid.kill();
        //if the target passed into the function is the ship, call the destroy ship function  
        if (target.key == 'shipSprite') {
            this.destroyShip();
        }
        //on collision call the splinter asteroid function(gradual breakdown)
        this.splinterAsteroid(asteroid);
    },
    destroyShip: function () {
        this.lives -= 1;
        this.remainingLives.text = this.lives;
        //if theres lives left (value !0), call reset ship on a timer 
         if (this.lives) {
             //timer - multiply the phaser second timer function by the timetoReset vairable, call the reset function, context(the ship)
            game.time.events.add(Phaser.Timer.SECOND * shipParameters.timeToReset, this.resetShip, this);
        }
    },
    //reset ship after collision with asteroid, place in original start position (centre)
    resetShip: function () {
        this.shipSprite.reset(shipParameters.startX, shipParameters.startY);
        this.shipSprite.angle = 0;
    },
    
    
    splinterAsteroid: function (asteroid) {
        //cheeck if the effected asteroid has a next size
        if (asteroidParameters[asteroid.key].nextSize) {
            //create a new asteroid, with the new size, in the exact same place
            this.createAsteroid(asteroid.x, asteroid.y, asteroidParameters[asteroid.key].nextSize, asteroidParameters[asteroid.key].splinters);
        }
    },

};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'game');
game.state.add(states.game, gameState);
game.state.start(states.game);