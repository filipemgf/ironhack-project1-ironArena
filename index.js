class Player {
	constructor() {
		//character base stats
		this.strength = null;
		this.agility = null;
		this.constitution = null;
		this.level = 1;
		this.gold = 200;

		//character derived stats
		this.health = 20 + Math.round(0.5 * this.constitution);
		this.energy = 10;
		this.armor = 0 + Math.round(0.25 * this.constitution);
		this.speed = 10 + Math.round(0.25 * this.agility);
		this.damage = null; //will depend on the weapon equipped

		//equipment storage array
		this.equipment = [];
	}

	applyEquipmentBonus() {
		this.equipment.forEach((equipmentObject) => {
			this.damage += equipmentObject.damage || 0;
			this.armor += equipmentObject.armor || 0;
			this.speed += equipmentObject.speed || 0;
		});
	}
}

class Enemy {
	constructor() {
		this.health = 20 + Math.round(0.5 * this.constitution);
		this.energy = 10;
		this.armor = 0 + Math.round(0.25 * this.constitution);
		this.speed = 10 + Math.round(0.25 * this.agility);
		this.damage = null; //will depend on the weapon equipped
	}
}

class BronzeSword {
	constructor() {
		this.type = "sword";
		this.price = 100;
		this.damage = 10 + this.strength;
		this.armor = 0;
		this.speed = 0;
	}
}

class Equipment {
	constructor() {
		this.armor = null;
		this.damage = null;
		this.speed = null;
	}

	addEquipment(equipmentObject) {
		this.equipment.push(equipmentObject);
	}
}
