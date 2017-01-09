var game; //contains my Game


window.onload = function() {	
    console.log("==window  on load event");
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
    
	//adding different states to the phaser game
    game.state.add("Boot", boot);
    game.state.add("Preload", preload); 
    //game.state.add("TitleScreen", titleScreen);
    //game.state.add("PlayGame", playGame);
    //game.state.add("GameOverScreen", gameOverScreen);
    //kickstart the game with the Boot stae
    game.state.start("Boot");
    
};

var boot = function(game) {};
boot.prototype = {
	preload: function() {
		console.log("==boot state. Preload mehtod.");
	},
	
	create: function() {
		console.log("==boot state. Create mehtod mehtod.");
		this.game.state.start("Preload");
	}
	
}


var preload = function(game) {};
preload.prototype = {
	preload: function() {
		console.log("==preload state. Preload mehtod.");
	},
	
	create: function() {
		console.log("==preload state. Create mehtod mehtod.");
		//this.game.state.start("Preload");
	}
	
}
