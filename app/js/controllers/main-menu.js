'use strict';

angular.module('ZombieLabApp')

.controller('mainMenuController', function ($scope, $location, characterService, mapService, mapGeneratorService, gameService) {
	$scope.startNewGame = function () {
		gameService.resetDifficulty();
		characterService.buildNewRoster(6);
		mapGeneratorService.createNewMap();
		$location.path('team-setup');
	}
});

