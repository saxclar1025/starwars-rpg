var character = function(n, h, a, c, i) {
	this.name = n;
	this.health = h;
	this.baseHealth = h;
	this.attackMultiplier = 1;
	this.attackPower = a;
	this.counterPower = c;
	this.id = i;

	this.isAlive = function() {
		return this.health > 0;
	};

	this.currentAttackPower = function() {
		return this.attackPower * this.attackMultiplier;
	}

	this.attack = function(target) {
		target.health -= this.currentAttackPower();
		this.attackMultiplier++;
		if (target.isAlive()) {
			this.health -= target.counterPower;
		}
	};

	this.reset = function() {
		this.health = this.baseHealth;
		this.attackMultiplier = 1;
	};
};

// var rey = new Character("Rey", 100, 10, 5, "#rey");
// var luke = new Character("Luke", 120, 8, 15, "#luke");
// var kyloRen = new Character("Kylo Ren", 100, 12, 25, "#kylo-ren");
// var snoke = new Character("Supreme Leader Snoke", 150, 5, 20, "#snoke");

var game = {
	characters: [ 	new character("Rey", 100, 10, 5, "rey"),
					new character("Luke", 120, 8, 15, "luke"),
					new character("Kylo Ren", 100, 12, 25, "kylo-ren"),
					new character("Supreme Leader Snoke", 150, 5, 20, "snoke")
				],

	playerCharacter: null,
	enemies: [],
	defender: null,
	graveyard: [],

	getCharacterByID: function(id) {
		for (var i = 0; i < this.characters.length; i++) {
			if (this.characters[i].id === id) {
				return this.characters[i];
			}
			else {
				return null;
			}
		}
	},

	characterChosen: function() {
		return this.playerCharacter !== null;
	},

	defenderChosen: function() {
		return this.defender !== null;
	},

	reset: function() {
		this.playerCharacter = null;
		this.enemies = [];
		this.defender = null;
		this.graveyard = [];

		for (var i = 0; i < this.characters.length; i++) {
			this.characters[i].reset();
			$("#" + this.characters[i].id).removeClass("enemy defender hidden").appendTo("#your-character");
			$("#" + this.characters[i].id + " .health").text(this.characters[i].health);
		}

		$("#character-prompt").text("Choose a Character");
		$("#defender-prompt").text("Enemies");
		$("#message").empty();
		$("#restart-button").addClass("hidden");
		$("#music").attr("src", "assets/audio/star-wars-theme.mp3").trigger("play");
	},

	chooseCharacter: function(id) {
		for (var i = 0; i < this.characters.length; i++) {
			if(this.characters[i].id === id) {
				this.playerCharacter = this.characters[i];
			}
			else {
				this.enemies.push(this.characters[i]);
				$("#" + this.characters[i].id).appendTo("#enemies").addClass("enemy");
			}
		}

		$("#character-prompt").text("Your Character");
		$("#defender-prompt").text("Choose a Defender");
	},

	chooseDefender: function(id) {
		for (var i = 0; i < this.enemies.length; i++) {
			if( this.enemies[i].id === id ) {
				this.defender = this.enemies[i];
			}
		}
		$("#" + this.defender.id).appendTo("#defender").addClass("defender");
		this.enemies = this.enemies.filter(function(c) {
			return c !== this.defender;
		});

		$("#defender-prompt").text("Enemies");
	},

	attack: function() {
		$("#message").html(	"<p>You dealt " + this.playerCharacter.currentAttackPower() +
							" damage to " + this.defender.name + "</p><p>" + this.defender.name +
							" counter-attacked and dealt " + this.defender.counterPower + " damage");

		this.playerCharacter.attack(this.defender);
		$("#" + this.playerCharacter.id + " .health").text(this.playerCharacter.health);
		$("#" + this.defender.id + " .health").text(this.defender.health);
		if (!this.defender.isAlive()) {
			$("#message").html("<p>" + this.defender.name + " has been killed");
			this.removeDefender();
			if (this.enemies.length === this.graveyard.length) {
				this.processWin();
			}
		}
		else if (!this.playerCharacter.isAlive()) {
			this.processLoss();
		}
	},

	removeDefender: function() {
		$("#" + this.defender.id).appendTo("#graveyard").addClass("hidden");
		this.graveyard.push(this.defender);
		this.defender = null;
		$("#defender-prompt").text("Choose a Defender");
	},

	processLoss: function() {
		$("#message").html("<p>You have been defeated... GAME OVER!!!</p>");
		$("#restart-button").removeClass("hidden");
		$("#music").attr("src", "assets/audio/imperial-march.mp3").trigger("play");
	},

	processWin: function() {
		$("#message").html("<p>You Won!!!! GAME OVER!!!</p>");
		$("#restart-button").removeClass("hidden");
		$("#music").attr("src", "assets/audio/victory-celebration.mp3").trigger("play");
	}
};

$(document).ready( function(){
	

	game.reset();

	$(".character").click(function() {
		if(game.characterChosen()) {
			return;
		}
		else {
			game.chooseCharacter($(this).attr("id"));
			$("#music").attr("src", "assets/audio/battle.mp3").trigger("play");

			$(".enemy").click(function() {
				if(game.defenderChosen()) {
					return;
				}
				else {
					game.chooseDefender($(this).attr("id"));
				}
			});
		}
	});

	// $(".enemy").click(function() {
	// 	console.log("enemy clicked");
	// 	if(game.defenderChosen()) {
	// 		return;
	// 	}
	// 	else {
	// 		game.chooseDefender($(this).attr("id"));
	// 	}
	// });

	$("#attack-button").click(function() {
		if(!game.playerCharacter.isAlive()) {
			return;
		}
		else if(game.defenderChosen()) {
			game.attack();
		}
		else {
			$("#message").text("There is nobody to attack, please choose a defender.");
		}
	});

	$("#restart-button").click(function() {
		game.reset();
	});
} );

	