//game14.js: Swiping  the Sapceship 

var game; //contains my Game
//will contain colours for title screen background
var bgColors = [0xF16745, 0xFFC65D, 0x7BC8A4, 0x4CC3D9, 0x93648D, 0x7c786a, 0x588c73, 0x8c4646, 0x2a5b84, 0x73503c];
//width of the tunnel
var tunnelWidth= 256;
var shipVerticalSpeed = 15000;

var shipHorizontalSpeed= 100;
var shipMoveDelay = 0;
var swipeDistance = 10;

window.onload = function() {	
    console.log("==window  on load event");
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
    
	//adding different states to the phaser game
    game.state.add("Boot", boot);
    game.state.add("Preload", preload); 
    game.state.add("TitleScreen", titleScreen);
    game.state.add("PlayGame", playGame);
    game.state.add("GameOverScreen", gameOverScreen);
    //kickstart the game with the Boot stae
    game.state.start("Boot");
    
};


// the boot state is an object with a prototype method and it accepts the game object as an argument
var boot = function(game){};
boot.prototype = {
    //preload function runs before the create function
  	preload: function(){
         console.log("==boot state. Preload method");
        //preloading an asset that will be a preloading bar
         this.game.load.image("loading","assets/sprites/loading.png"); 
	},
    //create function sets up how the gamescreen is positioned
  	create: function(){
         console.log("==boot state. Create method");
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
        //keeps original aspect ratio while maximising size in browser window
         game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		//triggering the next state
        this.game.state.start("Preload");
	}      
};


//Preload state: loads assets, dipsays a loadingbar. 
var preload = function(game) {};
preload.prototype = {
	preload: function() {
		console.log("==preload state. Preload.");
		 var loadingBar = this.add.sprite(game.width / 2, game.height / 2, "loading");
         //change the registration point to the center of graphic
         loadingBar.anchor.setTo(0.5, 0.5);
         game.load.setPreloadSprite(loadingBar);
            
         game.load.image("title", "assets/sprites/title.png");
         game.load.image("playbutton", "assets/sprites/playbutton.png");
		 game.load.image("backsplash", "assets/sprites/backsplash.png");
		 //tunnel graphics
         game.load.image("tunnelbg", "assets/sprites/tunnelbg.png");
         game.load.image("wall", "assets/sprites/wall.png");
		 //Spaceship
        game.load.image("ship", "assets/sprites/ship.png");
         //smoke
        game.load.image("smoke", "assets/sprites/smoke.png");
        
	},
	
	create: function() {
		console.log("==preload state. Create mehtod.");
		this.game.state.start("TitleScreen");
	}
	
}

//title State
var titleScreen = function(game){};
titleScreen.prototype = { 
	
	create: function() {
		console.log("==titleScreen state. Create method.");
		
		 //creating a tiled background from backsplash tile
         var titleBG = game.add.tileSprite(0, 0, game.width, game.height, "backsplash");
         titleBG.tint = bgColors[game.rnd.between(0, bgColors.length - 1)];
         console.log(titleBG.tint);
		
		game.stage.backgroundColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
		var title = game.add.image(game.width / 2, 210, "title");
        title.anchor.set(0.5);
		var playButton = game.add.button(game.width / 2, game.height - 150, "playbutton", this.startGame);
        playButton.anchor.set(0.5);
		//adding a tween to the button
        var tween = game.add.tween(playButton).to({
               width: 220,
               height:220
          }, 1500, "Linear", true, 0, -1); 
        tween.yoyo(true);
		
		
	},
	
	//will be triggered by button interaction
    startGame: function(){
         console.log("play the Game");
         game.state.start("PlayGame"); 
    }
}

//playGame State
var playGame = function(game){};
playGame.prototype = {  
  	create: function(){
			  console.log("==playGame state. Create method");
			
			 var tintColor = bgColors[game.rnd.between(0, bgColors.length - 1)]
			 //tunnel
			 var tunnelBG = game.add.tileSprite(0, 0, game.width, game.height, "tunnelbg");
			 tunnelBG.tint = tintColor;
			 //leftWall
			 var leftWallBG = game.add.tileSprite(- tunnelWidth / 2, 0, game.width /2, game.height, "wall");
			 leftWallBG.tint = tintColor;
			 //right Wall
			 var rightWallBG = game.add.tileSprite((game.width + tunnelWidth) / 2, 0, game.width / 2, game.height, "wall");
			 rightWallBG.tint = tintColor;
			 rightWallBG.tileScale.x = -1;
			 
			// array of shipPosition, 2 members   
			this.shipPositions = [(game.width - tunnelWidth) / 2 + 32, (game.width + tunnelWidth) / 2 - 32];
			this.ship = game.add.sprite(this.shipPositions[0], 860, "ship");
			this.ship.side = 0;
			this.ship.anchor.set(0.5);
			 //enable physice
			this.game.physics.enable(this.ship, Phaser.Physics.ARCADE);
			 //boolean to check that ship can Move
            this.ship.canMove = true;
			//react to tap or click
            game.input.onDown.add(this.moveShip, this);
            //game14.js - Spaceship Swipe
            game.input.onUp.add(function() {
            this.ship.canSwipe = false;
            }, this);
        
            //smoke emitter game12.js
            this.smokeEmitter = game.add.emitter(this.ship.x, this.ship.y +10, 20);
            this.smokeEmitter.makeParticles("smoke");
            this.smokeEmitter.setXSpeed(-30,30);
            this.smokeEmitter.setYSpeed(50, 100);
            this.smokeEmitter.setAlpha(0.5,1);
            this.smokeEmitter.start(false, 1000,40);
        
            //game13.js - Spaceship Vertical Tween
            //ship rises over 15 seconds
             this.verticalTween = game.add.tween(this.ship).to({
                 y:0
             }, shipVerticalSpeed, Phaser.Easing.Linear.None, true);

             //game14.js - Spaceship Swipe
             this.ship.canSwipe = false;
			
	},
	
	moveShip: function(){
        
        //game14.js - Spaceship Swipe
        this.ship.canSwipe = true;    

        if(this.ship.canMove){
            this.ship.canMove = false;
            this.ship.side = 1 - this.ship.side; //toggles between 0 and 1.
            //add a tween to this.ship.side
            var horizontalTween = game.add.tween(this.ship).to({
            x: this.shipPositions[this.ship.side]
            }, shipHorizontalSpeed, Phaser.Easing.Linear.None, true);
            //on complete event
            horizontalTween.onComplete.add(function(){
                //add a delay
                game.time.events.add(shipMoveDelay, function(){
                    this.ship.canMove = true;
                }, this);
            }, this);
		}
	},
    
    //added in game12.js 
    update: function() {
        this.smokeEmitter.x = this.ship.x;
        this.smokeEmitter.y = this.ship.y;
        //game14.js - Spaceship Swipe
        //check for swipe event 
        if (this.ship.canSwipe) {
              console.log("swipe")
            if (Phaser.Point.distance(game.input.activePointer.positionDown, game.input.activePointer.position) > swipeDistance) {
              
                this.restartShip();
            }
         }
        
    },

    //game14.js - Spaceship Swipe
    restartShip: function() {
        this.ship.canSwipe = false;
        this.verticalTween.stop();
        this.verticalTween = game.add.tween(this.ship).to({
            y: 860
        }, 100, Phaser.Easing.Linear.None, true);
        this.verticalTween.onComplete.add(function() {
            this.verticalTween = game.add.tween(this.ship).to({
              y:0
            }, shipVerticalSpeed, Phaser.Easing.Linear.None, true);
        }, this)
        
    }    

};

//gameOver State
var gameOverScreen = function(game){};
gameOverScreen.prototype = { 
		 
};
