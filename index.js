class Player {
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

		if (hitValue >= target.parry) {
			let damage = this.damage - target.armor;
			return `You deal ${damage} damage to ${target.name}.\n`;
		} else if (hitValue < target.parry) {
			return `The ${target.name} parries your attack!`;
		}

		this.playerTurn === false;
		this.roundCounter += 1;
	}
}

class LowlyBandit extends Player {
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
		if (this.player.agility > this.enemy.agility) {
			this.playerTurn = true;
			console.log(`You move faster than the enemy!`);
			this.player.attack;
		} else {
			this.playerTurn = false;
			console.log(`The enemy is faster than you!`);
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

// Testing
const player = new Player(10, 12, 14);
console.log("New player:", player);

const bronzeSword = new BronzeSword();

bronzeSword.addEquipment(bronzeSword);

const enemy = new LowlyBandit(1, 10);
console.log("New enemy:", enemy);

const fight = new Combat(player, enemy);
fight.roundStart();

let playerAttack = player.attack(enemy);
console.log("The player attacks:", playerAttack);

let enemyAttack = enemy.attack(player);
console.log("The enemy attacks:", enemyAttack);

//----- Event Listeners -----

//Buttons
const button1 = document.querySelector("#button1");
button1.addEventListener("click", () => {
	let playerAttack = player.attack(enemy);
	console.log("The player attacks:", playerAttack);
});

const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");

// Text displays

const textScreen = document.querySelector(".screen");
textScreen.textContent += playerAttack;
console.log(textScreen);
