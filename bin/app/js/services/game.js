'use strict';

//angular.module('ZombieLabApp')

//.service('gameService', function ($q, $timeout, equipmentService) {
const gameService = {
	//service: this,
	difficulty: null,
	/*isGameOver = false;
	service.isMainGame = false;
	service.selectedItemSlot = null;
	service.names = ['Alan', 'Arthur', 'Jake', 'Jane', 'Hilda', 'Thomas', 'Natalie', 'John', 'Martha', 'Ashley'];
	service.availableNames = null;
	service.tutorialEnabled = false;
	service.gamePaused = 0;*/
	gameLoading: {
		isLoading: true
	},
	loadingTransition: parseFloat($('.loading-overlay').css('transition') && $('.loading-overlay').css('transition').match(/[0-9]*\.?[0-9]s/) ? $('.loading-overlay').css('transition').match(/[0-9]*\.?[0-9]s/)[0] : 0.4),

	/*service.togglePause = function () {
		service.gamePaused = service.gamePaused ? 0 : 1;
	};
	service.pause = function () {
		service.gamePaused++;
	};
	service.unpause = function () {
		service.gamePaused--;
	};
	service.isPaused = function () {
		return service.gamePaused > 0;
	};
*/
	startLoading () {
		gameService.gameLoading.isLoading = true;
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, loadingTransition * 1000 + 100);
		});
	},
	finishLoading (delay) {
		return new Promise((resolve) => {
			setTimeout(function () {
				gameService.gameLoading.isLoading = false;
				setTimeout(() => {
					resolve();
				}, loadingTransition * 1000);
			}, delay);
		})
	}

	/*service.resetGame = function () {
		difficulty = 100;
		service.availableNames = angular.copy(service.names);
		equipmentService.removeAmmo();
		service.isGameOver = false;
		service.isMainGame = true;
	};

	service.getNewName = function () {
		var idx = _.random(0, service.availableNames.length - 1);
		var name = service.availableNames[idx];
		service.availableNames.splice(idx, 1);
		return name;
	};

	service.gameOver = function () {
		service.isMainGame = false;
		service.isGameOver = true;
	};

	service.getDifficulty = function () {
		return difficulty;
	};

	service.setDifficulty = function (d) {
		difficulty = d;
	};

	service.increaseDifficulty = function () {
		difficulty += 45;
	};

	service.isItemSelected = function () {
		return !!service.selectedItemSlot;
	};

	service.getSelectedItemSlot = function () {
		return service.selectedItemSlot;
	};

	service.getSelectedItem = function () {
		return service.selectedItemSlot.item;
	};

	service.getSelectedItemOwner = function () {
		return service.selectedItemSlot.character;
	};

	service.deselectItem = function () {
		service.selectedItemSlot = null;
	};

	service.destroySelectedItem = function () {
		service.selectedItemSlot.item = null;
	};

	return service;*/
};

