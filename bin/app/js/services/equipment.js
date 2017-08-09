'use strict';

const equipmentService = {
	//var service = this;

	itemTypesByName: {},
	itemTypes: {},
	ammo: {},

	registerItem(item) {
		item.price = item.price || 0;
		item.size = item.size || 'small';
		item.isLarge = item.isLarge || false;
		item.image = item.image || item.name.replace(/ /g, '_').toLowerCase();
		equipmentService.itemTypes[item.category] = equipmentService.itemTypes[item.category] || {};
		equipmentService.itemTypesByName[item.name] = item;
		equipmentService.itemTypes[item.category][item.name] = item;
	},

	registerItems(data) {
		_.each(data, function (items, category) {
			_.each(items, function (item) {
				item.category = category;
				equipmentService.registerItem(item);
			});
		});
	},

	removeAmmo() {
		_.each(equipmentService.ammo, function (qty, type) {
			equipmentService.ammo[type] = 0;
		});
	},

	addAmmo(type, qty) {
		equipmentService.ammo[type] = equipmentService.ammo[type] || 0;
		equipmentService.ammo[type] += qty;
	},

	newItemByName(itemName) {
		if (!equipmentService.itemTypesByName[itemName]) {
			throw new Error('No such item as ' + itemName);
		}
		return equipmentService.newItem(equipmentService.itemTypesByName[itemName]);
	},

	newItem(itemModel) {
		var newItem = new Item({
			model: itemModel
		});
		if (newItem.isWeapon()) {
			newItem.ammo = itemModel.clipSize;
		} else {
			newItem.charges = itemModel.charges;
		}
		return newItem;
	}
};
