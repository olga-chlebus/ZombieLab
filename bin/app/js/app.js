'use strict';

const mainMenu = {template: '<main-menu>main-menu</main-menu>'};
const teamSetup = {template: '<team-setup>team-setup</team-setup>'};
const game = {template: '<game>game</game>'};
const other = {template: '<start>start</start>'};

const routes = {
  '/main-menu': mainMenu,
  '/team-setup': teamSetup,
  '/game': game
};

const ZombieLabApp = new Vue({
  el: '#ZombieLabApp',
  data: {
    currentRoute: window.location.hash.replace('#','')
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || other
    }
  },
  render (h) { console.log(this.ViewComponent); return h(this.ViewComponent) }
});

window.addEventListener('popstate', () => {
  ZombieLabApp.currentRoute = window.location.hash.replace('#','')
});



/*angular.module('ZombieLabApp', ['ngRoute', 'ngTouch'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/main-menu', {
			templateUrl: 'partials/main-menu.html',
			controller: 'mainMenuController'
		})
		.when('/team-setup', {
			templateUrl: 'partials/team-setup.html',
			controller: 'teamSetupController'
		})
		.when('/game', {
			templateUrl: 'partials/game.html',
			controller: 'gameController'
		})
		.otherwise({
			templateUrl: 'partials/start.html',
			controller: 'startController'
		});
})

.controller('zombieLabController', function ($scope, gameService, modalService) {
	$scope.model = {
		loading: gameService.gameLoading,
		pauseScreen: false
	};

	$scope.togglePause = gameService.togglePause;

	$scope.enablePauseScreen = function (event) {
		if (!gameService.gamePaused) {
			gameService.togglePause();

			var modal = modalService.open({
				template: 'game-pause-modal.html',
				scope: $scope
			});

			modal.on('close', function () {
				gameService.unpause();
			});
		}
		event.preventDefault();
	};

	document.addEventListener('deviceready', function () {
		document.addEventListener('backbutton', $scope.enablePauseScreen, false);
	}, false);
});*/
