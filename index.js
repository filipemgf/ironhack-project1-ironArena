// ----- Selectors and queries ------

const screen = document.querySelector(".screen");
const characterCreatorContainer = document.querySelector(
	"#character-creator-container"
);
const textScreenContainer = document.querySelector(".textContainer");
const playerTurnTracker = document.querySelector("#player-turn");
const enemyTurnTracker = document.querySelector("#enemy-turn");

const playerPanel = document.querySelector(".player-panel");

const enemyPanel = document.querySelector(".enemy-panel");

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");

const characterChoiceButtons = document.querySelectorAll(
	".character-choice-button"
);

const characterChoiceQueries = {
	rogue: document.querySelector(".character-choice-button.rogue"),
	hunter: document.querySelector(".character-choice-button.hunter"),
	knight: document.querySelector(".character-choice-button.knight"),
};

const enemyStatQueries = {
	level: document.querySelector(".enemyStats .level"),
	health: document.querySelector(".enemyStats .health"),
	gold: document.querySelector(".enemyStats .gold"),
	strength: document.querySelector(".enemyStats .strength"),
	agility: document.querySelector(".enemyStats .agility"),
	constitution: document.querySelector(".enemyStats .constitution"),
};

const playerStatQueries = {
	level: document.querySelector(".playerStats .level"),
	health: document.querySelector(".playerStats .health"),
	gold: document.querySelector(".playerStats .gold"),
	strength: document.querySelector(".playerStats .strength"),
	agility: document.querySelector(".playerStats .agility"),
	constitution: document.querySelector(".playerStats .constitution"),
};
// ----- Classes ------

class Unit {
	constructor(name, statsArray, equipmentArray) {
		this.name = name;
		this.turn = false;
		//character base stats
		const [strength, agility, constitution] = statsArray;

		this.strength = strength;
		this.agility = agility;
		this.constitution = constitution;
		this.level = 1;
		this.gold = 200;

		//character derived stats
		this.health = 100 + Math.round(2 * this.constitution);
		this.energy = 10;
		this.armor = 0 + Math.round(0.25 * this.constitution);
		this.parry = 10 + Math.round(0.25 * this.agility);
		this.accuracy = 10 + Math.round(0.25 * this.agility);
		this.damage = 0; //will depend on the weapon equipped

		//equipment storage array
		this.equipmentArray = equipmentArray || [];
		this.applyEquipmentBonus();
	}

	applyEquipmentBonus() {
		/* add gear like this */
		this.equipmentArray.forEach((equipmentObject) => {
			this.armor += equipmentObject.armor || 0;
			this.parry += equipmentObject.parry || 0;
			this.damage += Math.round(equipmentObject.damage + this.strength * 0.25);
		});
	}

	addEquipment(equipmentObject) {
		this.equipmentArray.push(equipmentObject);
	}
}

class Combat {
	constructor(player, enemy) {
		this.player = player;
		this.enemy = enemy;

		this.player.applyEquipmentBonus();
		this.enemy.applyEquipmentBonus();

		this.roundCounter = 0;
		/* 	this.playerTurn = null; */
	}

	start() {
		enemyPanel.style.display = "flex";
		updateEnemyStats();

		if (player.agility > enemy.agility) {
			sendMessageToScreen(`You move faster than the enemy!`);
			player.turn = true;
			updateTurnTracker();
		} else {
			sendMessageToScreen("The enemy is faster than you!");
			enemy.turn = true;
			updateTurnTracker();

			setTimeout(() => {
				this.attack(enemy, player);
			}, 2000);
		}

		console.log(player.turn, enemy.turn);
	}

	attack(attacker, defender) {
		//TODO: find better calc for acc/parry interaction

		let hitValue =
			Math.floor(Math.random() * (attacker.accuracy + 1)) +
			Math.floor(attacker.accuracy / 2);

		let attackMessage = null;

		if (hitValue >= defender.parry) {
			let damage = attacker.damage - defender.armor;
			attackMessage = `${attacker.name} deals ${damage} damage to ${defender.name}.`;

			defender.health -= damage;
		} else if (hitValue < defender.parry) {
			attackMessage = `${defender.name} parries the attack!`;
		}

		sendMessageToScreen(attackMessage);
		updateEnemyStats();
		updatePlayerStats();

		if (this.enemy.health <= 0) {
			sendMessageToScreen(
				"Your enemy has fallen and you live to fight another day!"
			);
			player.gold += enemy.gold;

			setTimeout(() => {
				textScreenContainer.textContent = " ";
				this.end();
				updatePlayerStats();
				sendMessageToScreen(
					`You have been rewarded ${enemy.gold} gold pieces for your performance.`
				);
			}, 3000);
		} else if (this.player <= 0) {
			this.end();
			textScreenContainer.textContent = " ";
			sendMessageToScreen(
				"Your injuries are too much too much to bear. A noble death!"
			);
		} else {
			if (enemy.turn) {
				enemy.turn = false;
				player.turn = true;
				updateTurnTracker();
			} else if (player.turn) {
				enemy.turn = true;
				player.turn = false;
				updateTurnTracker();
				setTimeout(() => {
					this.attack(enemy, player);
				}, 2000);
			}
		}
	}

	addEquipment(equipmentObject) {
		this.equipmentArray.push(equipmentObject);
	}

	end() {
		characterCreatorContainer.style.display = "none";
		enemyTurnTracker.style.display = "none";
		playerTurnTracker.style.display = "none";
		enemyPanel.style.display = "none";

		enemy.turn = false;
		player.turn = false;
	}
}

// ----- Equipment organized as objects -----

const swords = {
	bronzeSword: {
		name: "Bronze Sword",
		type: "sword",
		price: 100,
		damage: 10,
		armor: 0,
		parry: 1,
	},
};

const bows = {
	shortBow: {
		name: "Short Bow",
		type: "bow",
		price: 100,
		damage: 15,
		armor: 0,
		parry: 0,
	},
};

const shields = {
	ironShield: {
		name: "Iron Shield",
		type: "shield",
		price: 100,
		damage: 0,
		armor: 2,
		parry: 2,
	},
	ironBuckler: {
		name: "Iron Buckler",
		type: "shield",
		price: 50,
		damage: 0,
		armor: 1,
		parry: 1,
	},
};

const armor = {
	leatherArmor: {
		name: "Leather Armor",
		type: "armor",
		price: 100,
		damage: 0,
		armor: 2,
		parry: 0,
	},
	commonClothes: {
		name: "Common Clothes",
		type: "armor",
		price: 10,
		damage: 0,
		armor: 1,
		parry: 0,
	},
	mailArmor: {
		name: "Mail Armor",
		type: "armor",
		price: 200,
		damage: 0,
		armor: 4,
		parry: 0,
	},
};

//----- Event Listeners -----

//Buttons
button1.addEventListener("click", () => {
	console.log("button1 clicked");
	if (player.turn === true) {
		fight.attack(player, enemy);
	}
});

button3.addEventListener("click", () => {
	enemy = new Unit(
		"Lowly Bandit",
		[10, 10, 10],
		[swords.bronzeSword, shields.ironShield]
	);
	console.log(player, enemy);

	fight = new Combat(player, enemy);
	fight.start();
});
button4.addEventListener("click", () => {
	characterCreation();
});

characterChoiceQueries["rogue"].addEventListener("click", () => {
	player = new Unit(
		"Player Rogue",
		[10, 15, 12],
		[armor.leatherArmor, swords.bronzeSword, shields.ironBuckler]
	);
	updatePlayerStats();
	console.log(player);
});

characterChoiceQueries["hunter"].addEventListener("click", () => {
	player = new Unit(
		"Player Hunter",
		[12, 13, 13],
		[armor.commonClothes, bows.shortBow]
	);
	updatePlayerStats();
	console.log(player);
});

characterChoiceQueries["knight"].addEventListener("click", () => {
	player = new Unit(
		"Player Knight",
		[13, 10, 15],
		[armor.mailArmor, swords.bronzeSword, shields.ironShield]
	);
	updatePlayerStats();
	console.log(player);
});

/* characterChoiceButtons.forEach((button) => {
	button.addEventListener("click", (event) => {
		button.classList.remove("active");

		event.target.classList.add("active");
	});
}); */

// ----- Functions -----

function updateTurnTracker() {
	if (player.turn) {
		enemyTurnTracker.style.display = "none";
		playerTurnTracker.style.display = "block";
	} else if (enemy.turn) {
		enemyTurnTracker.style.display = "block";
		playerTurnTracker.style.display = "none";
	} else {
		enemyTurnTracker.style.display = "none";
		playerTurnTracker.style.display = "none";
	}
}

function checkColision(element1, element2) {
	const rect1 = element1.getBoundingClientRect();
	const rect2 = element2.getBoundingClientRect();

	return (
		rect1.left < rect2.right &&
		rect1.right > rect2.left &&
		rect1.top < rect2.bottom &&
		rect1.bottom > rect2.top
	);
}

function sendMessageToScreen(message) {
	textScreenContainer.textContent =
		message + "\n" + textScreenContainer.textContent;

	let colisionCheck = checkColision(playerPanel, textScreenContainer);

	if (colisionCheck === true) {
		textScreenContainer.textContent = message;
	}
}

function updatePlayerStats() {
	for (let property in playerStatQueries) {
		playerStatQueries[
			property
		].textContent = `${property}: ${player[property]}`;
	}
}

function updateEnemyStats() {
	for (let property in enemyStatQueries) {
		enemyStatQueries[property].textContent = `${property}: ${enemy[property]}`;
	}
}

/* function updateStats(unit) {
	for (let property in unitStatQueries) {
		unitStatQueries[property].textContent = `${property}: ${[unit][property]}`;
	}
} couldn't manage to make the two updatestats functions generic*/

// Testing

function characterCreation() {
	characterCreatorContainer.style.display = "block";
}

function characterChoiceDetails() {}

characterCreatorContainer.style.display = "none";
enemyTurnTracker.style.display = "none";
playerTurnTracker.style.display = "none";
enemyPanel.style.display = "none";

let enemy = null;
let player = null;

characterCreation();

/* player = new Unit(
	"Player Hero",
	[12, 14, 10],
	[swords.bronzeSword, shields.ironShield]
); */

/* updatePlayerStats(player); */

/* updatePlayerStats(); */
/* updateStats(player, level); */
/* statQueryContainer.player.level.textContent = `Level: ${player.level}`; */
