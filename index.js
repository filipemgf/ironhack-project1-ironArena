// ----- Selectors and queries ------

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");

const screen = document.querySelector(".screen");
const textScreenContainer = document.querySelector(".textContainer");
const flexContainer = document.querySelector(".flexContainer");

const playerTurnTracker = document.querySelector("#player-turn");
const enemyTurnTracker = document.querySelector("#enemy-turn");

// ----- Operational Functions -----

function updateTurnTracker() {
	if (playerTurn === true) {
		enemyTurnTracker.style.display = "none";
		playerTurnTracker.style.display = "block";
	} else if (playerTurn === false) {
		enemyTurnTracker.style.display = "block";
		playerTurnTracker.style.display = "none";
	} else if (playerTurn === null) {
		enemyTurnTracker.style.display = "none";
		playerTurnTracker.style.display = "none";
	}
}

function sendMessageToScreen(message) {
	textScreenContainer.textContent =
		message + "\n" + textScreenContainer.textContent;
	if (textScreenContainer.scrollHeight > screen.offsetHeight) {
		textScreenContainer.textContent = message;
	}
}

// ----- Classes ------

class Unit {
	constructor(strength, agility, constitution) {
		this.name = "TEST";

		//character base stats
		this.strength = strength;
		this.agility = agility;
		this.constitution = constitution;
		this.level = 1;
		this.gold = 200;

		//character derived stats
		this.health = 20 + Math.round(0.5 * this.constitution);
		this.energy = 10;
		this.armor = 0 + Math.round(0.25 * this.constitution);
		this.parry = 10 + Math.round(0.25 * this.agility);
		this.accuracy = 10 + Math.round(0.25 * this.agility);
		this.damage = 0; //will depend on the weapon equipped

		//equipment storage array
		this.equipment = [];
	}

	applyEquipmentBonus() {
		/* add gear like this */
		this.equipment.forEach((equipmentObject) => {
			this.armor += equipmentObject.armor || 0;
			this.parry += equipmentObject.parry || 0;
			this.damage += Math.round(equipmentObject.damage + this.strength * 0.25);
		});
	}

	attack(target) {
		//TODO: find better calc for acc/parry interaction

		let hitValue = Math.floor(
			Math.random() *
				(2 * this.accuracy - this.accuracy / 2 + this.accuracy / 2)
		);

		let attackMessage = null;

		if (hitValue >= target.parry) {
			let damage = this.damage - target.armor;
			attackMessage = `${this.name} deals ${damage} damage to ${target.name}.`;
		} else if (hitValue < target.parry) {
			attackMessage = `${target.name} parries the attack!`;
		}

		sendMessageToScreen(attackMessage);
	}
}

class LowlyBandit extends Unit {
	constructor(armor, damage) {
		super(10, 10, 10);
		this.name = "Lowly Bandit";
		this.damage = damage;
		this.armor = armor;
	}
}

class Combat {
	constructor(player, enemy) {
		this.player = player;
		this.enemy = enemy;
		this.player.applyEquipmentBonus();
		this.roundCounter = 0;
		this.playerTurn = null;
	}

	roundStart() {
		this.playerTurn === null;
		updateTurnTracker();

		if (this.player.agility > this.enemy.agility) {
			sendMessageToScreen(`You move faster than the enemy!`);
			playerTurn = true;
			updateTurnTracker();
		} else {
			sendMessageToScreen("The enemy is faster than you!");
			playerTurn = false;
			updateTurnTracker();
		}
	}
}
class Equipment {
	constructor() {
		this.armor = null;
		this.damage = null;
		this.parry = null;
	}

	addEquipment(equipmentObject) {
		player.equipment.push(equipmentObject);
	}
}

class BronzeSword extends Equipment {
	constructor() {
		super();
		this.type = "sword";
		this.price = 100;
		this.damage = 10;
		this.armor = 0;
		this.parry = 0;
	}
}

class ironShield extends Equipment {
	constructor() {
		super();
		this.armor = 3;
	}

	shieldRiposte() {
		//doubles parry for one round, if an attack is parried, deal damage
		this.parry *= 2;
	}
}

//----- Event Listeners -----

//Buttons
button1.addEventListener("click", () => {
	if (playerTurn === true) {
		player.attack(enemy);
		playerTurn = false;
		updateTurnTracker();

		setTimeout(() => {
			enemy.attack(player);
			playerTurn = true;
			updateTurnTracker();
		}, 2000);
	}
});

// Testing

/* createCharacter(); */

/* function createCharacter() {
	textScreenContainer.display = "none";
} */

playerTurn = null;
updateTurnTracker();

const player = new Unit(10, 12, 14);
console.log("New player:", player);

const bronzeSword = new BronzeSword();

bronzeSword.addEquipment(bronzeSword);

const enemy = new LowlyBandit(1, 10);
console.log("New enemy:", enemy);

const fight = new Combat(player, enemy);
fight.roundStart();

console.log(enemy, player);
