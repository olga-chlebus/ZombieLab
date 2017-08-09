'use strict';

//var supportedEvents = ['Drop', 'Move']; //TODO

const Item = function (obj) {
	Object.assign(this, obj);
};

//attachEventHandler(Item, supportedEvents); //TODO

Item.prototype.drop = function (tile) {
	var key = _.findIndex(tile.itemSlots, function (slot) {
		return !slot.item;
	});
	if (key > -1) {
		tile.itemSlots[key].item = this;
		this.slot.item = null;
		this.slot = tile.itemSlots[key];
		this.fireDrop();
		return true;
	}
	console.error('No space to drop the item');
	return false;
};

Item.prototype.isWeapon = function () {
	return this.model.category === 'weapons';
};

Item.prototype.isRangedWeapon = function () {
	return !!(this.isWeapon() && this.model.ammoType);
};
