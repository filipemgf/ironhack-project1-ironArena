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
	}

	applyEquipmentBonus() {
		/* add gear like this */
		this.equipmentArray.forEach((equipmentObject) => {
			this.armor += equipmentObject.armor || 0;
			this.parry += equipmentObject.parry || 0;
			this.damage += Math.round(equipmentObject.damage + this.strength * 0.25);
		});
	}

	attack(target) {
		//TODO: find better calc for acc/parry interaction

		let hitValue =
			Math.floor(Math.random() * (this.accuracy + 1)) +
			Math.floor(this.accuracy / 2);

		let attackMessage = null;

		if (hitValue >= target.parry) {
			let damage = this.damage - target.armor;
			attackMessage = `${this.name} deals ${damage} damage to ${target.name}.`;
		} else if (hitValue < target.parry) {
			attackMessage = `${target.name} parries the attack!`;
		}

		if (enemy.turn) {
			enemy.turn = false;
			player.turn = true;
			updateTurnTracker();
		} else if (player.turn) {
			enemy.turn = true;
			player.turn = false;
			updateTurnTracker();
			setTimeout(() => {
				enemy.attack(player);
			}, 2000);
		}
		sendMessageToScreen(attackMessage);
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

		if (player.agility > enemy.agility) {
			sendMessageToScreen(`You move faster than the enemy!`);
			player.turn = true;
			updateTurnTracker();
		} else {
			sendMessageToScreen("The enemy is faster than you!");
			enemy.turn = true;
			updateTurnTracker();

			setTimeout(() => {
				enemy.attack(player);
			}, 2000);
		}

		console.log(player.turn, enemy.turn);
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
		parry: 1,
	},
};

//----- Event Listeners -----

//Buttons
button1.addEventListener("click", () => {
	console.log("button1 clicked");
	if (player.turn === true) {
		player.attack(enemy);
	}
});

button3.addEventListener("click", () => {
	enemy = new Unit("Lowly Bandit", [10, 10, 10], [shields.ironShield]);
	player = new Unit(
		"Player Hero",
		[10, 10, 10],
		[swords.bronzeSword, shields.ironShield]
	);
	console.log(player, enemy);

	let fight = new Combat(player, enemy);
	fight.start();
});
button4.addEventListener("click", () => {
	characterCreation();
});

// ----- Functions -----

function characterCreation() {
	characterCreatorContainer.style.display = "block";
}

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

// Testing

characterCreatorContainer.style.display = "none";
enemyTurnTracker.style.display = "none";
playerTurnTracker.style.display = "none";
enemyPanel.style.display = "none";

/* playerTurn = null; */
/* updateTurnTracker(); */

let enemy = null;
let player = null;

/* const player = new Unit("Player Hero", [10, 12, 14]);
const enemy = new Unit("Lowly Bandit", [10, 10, 10]); */

//equipment as classes (decided against this)
/* class Equipment {
	constructor() {
		this.armor = null;
		this.damage = null;
		this.parry = null;
	}

	addEquipment(equipmentObject) {
		player.equipment.push(equipmentObject);
	}
} */

/* class BronzeSword extends Equipment {
	constructor() {
		super();
		this.type = "sword";
		this.price = 100;
		this.damage = 10;
		this.armor = 0;
		this.parry = 0;
	}
} */

/* class ironShield extends Equipment {
	constructor() {
		super();
		this.armor = 3;
	}

	shieldRiposte() {
		//doubles parry for one round, if an attack is parried, deal damage
		this.parry *= 2;
	}
} */
