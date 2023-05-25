// ----- Selectors and queries ------

const combatQueries = {
	screenContainer: document.querySelector(".textContainer"),
	turnTracker: {
		player: document.querySelector("#player-turn"),
		enemy: document.querySelector("#enemy-turn"),
	},
};

const panelQueries = {
	player: {
		panel: document.querySelector(".player-panel"),
		button: {
			container: document.querySelector(".panel-buttons-container"),
			one: document.querySelector("#button1"),
			two: document.querySelector("#button2"),
			three: document.querySelector("#button3"),
			four: document.querySelector("#button4"),
		},
	},
	enemy: {
		panel: document.querySelector(".enemy-panel"),
	},
};

const characterCreatorQueries = {
	container: document.querySelector("#character-creator-container"),
	rogue: document.querySelector(".character-choice-button.rogue"),
	hunter: document.querySelector(".character-choice-button.hunter"),
	knight: document.querySelector(".character-choice-button.knight"),
	confirm: document.querySelector(".confirm-character-button"),
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

const introQueries = {
	container: document.querySelector("#character-creation-intro"),
	paragraph: {
		one: document.querySelector(".intro-paragraph.one"),
		two: document.querySelector(".intro-paragraph.two"),
		three: document.querySelector(".intro-paragraph.three"),
	},
	button: document.querySelector(".character-choice-button"),
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
		this.health = 100 + Math.round(3 * this.constitution);
		this.energy = 10;
		this.armor = 0 + Math.round(0.25 * this.constitution);
		this.parry = 10 + Math.round(0.25 * this.agility);
		this.accuracy = 10 + Math.round(1 * this.agility);
		this.damage = 0; //will depend on the weapon equipped

		//equipment storage array
		this.equipmentArray = equipmentArray || [];
		this.applyEquipmentBonus();
	}

	applyEquipmentBonus() {
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
		panelQueries.enemy.panel.style.display = "flex";
		introQueries.container.style.display = "none";
		characterCreatorQueries.container.style.display = "none";
		console.log(fight);

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
			attacker.accuracy * 0.5 + Math.floor(Math.random() * attacker.accuracy);

		let attackMessage = null;

		console.log(hitValue);
		if (hitValue >= defender.parry) {
			let damage =
				Math.floor(attacker.damage * (0.5 + Math.random() * 0.5)) -
				defender.armor;
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
				combatQueries.screenContainer.textContent = " ";
				this.end();
				updatePlayerStats();
				sendMessageToScreen(
					`You have been rewarded ${enemy.gold} gold pieces for your performance.`
				);
			}, 3000);
		} else if (this.player <= 0) {
			this.end();
			combatQueries.screenContainer.textContent = " ";
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
		characterCreatorQueries.container.style.display = "none";
		combatQueries.turnTracker.enemy.style.display = "none";
		combatQueries.turnTracker.player.style.display = "none";
		panelQueries.enemy.panel.style.display = "none";

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
panelQueries.player.button.one.addEventListener("click", () => {
	console.log("button1 clicked");
	if (player.turn === true) {
		fight.attack(player, enemy);
	}
});

panelQueries.player.button.three.addEventListener("click", () => {});
panelQueries.player.button.four.addEventListener("click", () => {});

introQueries.button.addEventListener("click", () => {
	characterCreation();
});

characterCreatorQueries["rogue"].addEventListener("click", () => {
	panelQueries.player.panel.style.display = "flex";
	panelQueries.player.button.container.style.display = "none";
	player = new Unit(
		"Player Rogue",
		[10, 15, 12],
		[armor.leatherArmor, swords.bronzeSword, shields.ironBuckler]
	);
	updatePlayerStats();
	characterCreatorQueries.confirm.style.display = "flex";
	console.log(player);
});

characterCreatorQueries["hunter"].addEventListener("click", () => {
	panelQueries.player.panel.style.display = "flex";
	panelQueries.player.button.container.style.display = "none";
	player = new Unit(
		"Player Hunter",
		[12, 13, 13],
		[armor.commonClothes, bows.shortBow]
	);
	updatePlayerStats();
	characterCreatorQueries.confirm.style.display = "flex";
	console.log(player);
});

characterCreatorQueries["knight"].addEventListener("click", () => {
	panelQueries.player.panel.style.display = "flex";
	panelQueries.player.button.container.style.display = "none";
	player = new Unit(
		"Player Knight",
		[13, 10, 15],
		[armor.mailArmor, swords.bronzeSword, shields.ironShield]
	);
	updatePlayerStats();
	characterCreatorQueries.confirm.style.display = "flex";
	console.log(player);
});

/* characterChoiceButtons.forEach((button) => {
	button.addEventListener("click", (event) => {
		button.classList.remove("active");

		event.target.classList.add("active");
	});
}); */

if (panelQueries.player.panel.style.display === "flex") {
	characterCreatorQueries.confirm.addEventListener("click", () => {});
}

characterCreatorQueries.confirm.addEventListener("click", () => {
	enemy = new Unit(
		"Lowly Bandit",
		[10, 10, 10],
		[swords.bronzeSword, shields.ironShield]
	);
	characterCreatorQueries.container.style.display = "none";
	panelQueries.player.button.container.style.display = "flex";

	console.log(player, enemy);
	fight = new Combat(player, enemy);
	fight.start();
});

// ----- Functions -----

function updateTurnTracker() {
	if (player.turn) {
		combatQueries.turnTracker.enemy.style.display = "none";
		combatQueries.turnTracker.player.style.display = "block";
	} else if (enemy.turn) {
		combatQueries.turnTracker.enemy.style.display = "block";
		combatQueries.turnTracker.player.style.display = "none";
	} else {
		combatQueries.turnTracker.enemy.style.display = "none";
		combatQueries.turnTracker.player.style.display = "none";
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
	combatQueries.screenContainer.textContent =
		message + "\n" + combatQueries.screenContainer.textContent;

	let colisionCheck = checkColision(
		panelQueries.player.panel,
		combatQueries.screenContainer
	);

	if (colisionCheck === true) {
		combatQueries.screenContainer.textContent = message;
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

function characterCreation() {
	characterCreatorQueries.container.style.display = "flex";
	combatQueries.turnTracker.enemy.style.display = "none";
	combatQueries.turnTracker.player.style.display = "none";
	panelQueries.enemy.panel.style.display = "none";
	panelQueries.player.panel.style.display = "none";
	introQueries.paragraph.one.style.display = "none";
	introQueries.paragraph.two.style.display = "none";
	introQueries.paragraph.three.style.display = "none";
	introQueries.button.style.display = "none";
	characterCreatorQueries.confirm.style.display = "none";
}

function startIntro() {
	characterCreatorQueries.container.style.display = "none";
	combatQueries.turnTracker.enemy.style.display = "none";
	combatQueries.turnTracker.player.style.display = "none";
	panelQueries.enemy.panel.style.display = "none";
	panelQueries.player.panel.style.display = "none";
	introQueries.paragraph.one.style.display = "none";
	introQueries.paragraph.two.style.display = "none";
	introQueries.paragraph.three.style.display = "none";
	introQueries.button.style.display = "none";

	introQueries.container.style.display = "flex";
	introQueries.paragraph.one.style.display = "flex";
	setTimeout(() => {
		introQueries.paragraph.two.style.display = "flex";
		setTimeout(() => {
			introQueries.paragraph.three.style.display = "flex";
			setTimeout(() => {
				introQueries.button.style.display = "flex";
			}, 5000);
		}, 5000);
	}, 5000);
}
/* function updateStats(unit) {
	for (let property in unitStatQueries) {
		unitStatQueries[property].textContent = `${property}: ${[unit][property]}`;
	}
} couldn't manage to make the two updatestats functions generic*/

// Testing

let enemy = null;
let player = null;

startIntro();
/* characterCreation(); */
