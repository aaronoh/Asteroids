var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};

var Assets = {
    //array of assests used in the game, the images for the asteroids/bullet/ship, each with a name and url 
    ship:{URL:'./asset/ship.png', name:'ship'},
    bullet:{URL:'./asset/bullet.png', name:'bullet'},    
    asteroidS:{URL:'./asset/asteroidS.png', name:'asteroidSmall'},
    asteroidM:{URL:'./asset/asteroidM.png', name:'asteroidMedium'},
    asteroidL:{URL:'./asset/asteroidL.png', name:'asteroidLarge'},
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

var gameState = function(game){
    this.shipSprite;
    
    this.key_left;
    this.key_right;
    this.key_thrust;
};

gameState.prototype = {
    
    preload: function () {
        //preload image - name + url
        game.load.image(Assets.ship.name, Assets.ship.URL);
        game.load.image(Assets.bullet.name, Assets.bullet.URL);        
        game.load.image(Assets.asteroidS.name, Assets.asteroidS.URL);
        game.load.image(Assets.asteroidM.name, Assets.asteroidM.URL);
        game.load.image(Assets.asteroidL.name, Assets.asteroidL.URL);   
       
    },
    
    create: function () {
        this.initShip();
        this.initPhysics();
    },

    update: function () {
        this.userInput();
        this.canvasBoundaries(this.shipSprite);
        
    },
    //placxing the ship sprite on the canvas 
    initShip: function () {
        this.shipSprite = game.add.sprite(shipParameters.startX, shipParameters.startY, Assets.ship.name);
        this.shipSprite.angle = -90;
        this.shipSprite.anchor.set(0.5, 0.5); 
    },
    

    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipParameters.drag);
        this.shipSprite.body.maxVelocity.set(shipParameters.maxVelocity);
    },

    initPhysics: function () {
        //initalize the phaser physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.enable(this.shipSprite, Phaser.Physics.ARCADE);
        this.shipSprite.body.drag.set(shipParameters.drag);
        this.shipSprite.body.maxVelocity.set(shipParameters.maxVelocity);
        
        this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.key_thrust = game.input.keyboard.addKey(Phaser.Keyboard.UP);
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
            game.physics.arcade.accelerationFromRotation(this.shipSprite.rotation, shipParameters.acceleration, this.shipSprite.body.acceleration);
        } else {
            this.shipSprite.body.acceleration.set(0);
        }
    },
    
//stop sprite from leaving canvas - can go from edge to edge
    checkBoundaries: function (sprite) {
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
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'game');
game.state.add(states.game, gameState);
game.state.start(states.game);