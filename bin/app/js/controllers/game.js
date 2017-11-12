'use strict';

Vue.component('game',{
	data(){
		return {
			team: characterService.team,
			ammo: equipmentService.ammo,
			teamTired: 0, // indicates taking part in shootout
			map: mapService.map,
			lootingRoom: false,
			selectedCharacter: null,
			gameReady: false,
			floor: 1,
			allHoldFire: false,
			currentAction: {
				actionObject: null,
				target: null,
				progress: 0
			}
		}
	},
	methods:{
		init() {
			//* START: quick setup /
			if (characterService.team.length === 0) {
				//$location.path('main-menu');

				gameService.resetGame();

				characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['warrior']));
				characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['medic']));
				characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['hacker']));
				characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['grenadier']));

				console.log('---- The team:')
				console.log(characterService.team);
				mapGeneratorService.createNewMap();
				console.log('---- The map:')
				console.log(mapService.map);
			}
			//* END: quick setup /

			$scope.bindKeys();

			$scope.mainLoop();

			gameService.finishLoading(200).then(function () {
				$scope.gameReady = true;
			});
		}
	},
	created(){
		this.init();
	},
	template:`
		<div ng-init="init();" class="game" ng-class="{'game-ready': gameReady}">
			<div class="team-panel">
				<div ng-repeat="id in [0,1,2,3]">
					<character-panel character="team[id]" disable-items="!team[id].alive" character-hold-action="showCharacterInfo(team[id]);" character-click-action="clickCharacter(team[id]);" main-frame="true"></character-panel>
				</div>
			</div>
			<div class="game-area" id="game-area">
				<div data-ng-repeat="direction in ['N', 'E', 'W', 'S', '']" class="action-direction" ng-class="direction ? direction : 'center'" ng-click="inputDirection(direction);"></div>
				<div class="team">
					<div class="pulse"></div>
				</div>
				<div class="loot-window" ng-show="lootingRoom">
					<item-slot ng-repeat="item in getTeamLocation().itemSlots track by $index" slot="loot" item-slot="getTeamLocation().itemSlots[$index]" allowed-large="true" slot-type="floor"></item-slot>
				</div>
				<game-map map="map" ng-style="{top: getMapTopOffset(), left: getMapLeftOffset()}"></game-map>
				<div class="top-left-info-panel">
					FLOOR: {{floor}}
					<div class="team-caution" data-ng-show="teamTired > 0">
						CAUTION!
					</div>
				</div>
				<div class="ammo-status">
					<div class="ammo-slot" v-for="(quantity, type) in ammo"><img class="ammo-icon" :src="'imgs/items/ammo/' + type + '.png'" />{{quantity}}</div>
				</div>
				<div class="action-panel">
					<div class="action-progress" ng-show="currentAction.actionObject">
						<div class="progress-bar" ng-style="{width: currentAction.progress / 10 + '%'}"></div>
					</div>
					<div class="action hold-fire" data-ng-click="toggleHoldFire();">{{allHoldFire ? 'FIRE' : 'HOLD'}}</div>
					<div class="action next-level" ng-show="canFinishLevel();" ng-click="finishLevel();">></div>
					<div class="action search" ng-show="canSearchRoom();" ng-click="searchRoom();">Search</div>
					<div class="action cancel" ng-show="currentAction.actionObject" data-ng-click="cancelAction();">X</div>
				</div>
			</div>
			<div class="game-over" data-ng-show="isGameOver();">
				<div class="big-button-wrapper">
					<div class="big-button" ng-click="backToMenu();">
						Back to Menu
					</div>
				</div>
			</div>

			<script type="text/ng-template" id="character-info-modal.html">
				<div class="character-info-modal">
					<character-panel character="selectedCharacter" disable-items="true"></character-panel>
					<div class="skills">
						<skill-bar ng-repeat="(skill, value) in selectedCharacter.skills" skill="skill" value="value"></skill-bar>
					</div>
					<div ng-click="$close();" class="modal-close">X</div>
				</div>
			</script>
		</div>`
});

/*angular.module('ZombieLabApp')

.controller('gameController', function ($scope, $location, $document, $interval, modalService, characterService, enemyService, mapService, mapGeneratorService, gameService, equipmentService, eventService) {
	var controller = this;

	$scope.= {
		team: characterService.team,
		ammo: equipmentService.ammo,
		teamTired: 0, // indicates taking part in shootout
		map: mapService.map,
		lootingRoom: false,
		selectedCharacter: null,
		gameReady: false,
		floor: 1,
		allHoldFire: false,
		currentAction: {
			actionObject: null,
			target: null,
			progress: 0
		}
	};
	var intervalTime = 40,
		interval,
		actions = {
			openDoor: {
				progress: function (delta) {
					$scope.currentAction.progress += delta / (0.2 + Math.pow($scope.currentAction.target.security, 3) * 5);
				},
				complete: function () {
					mapService.openDoor($scope.currentAction.target);
				}
			},
			walk: {
				start: function () {
					$scope.currentAction.target.teamWalkingTo = true;
				},
				progress: function (delta) {
					$scope.currentAction.progress += delta / ($scope.teamTired > 0 ? 1.2 : 0.4);
				},
				complete: function () {
					$scope.currentAction.target.teamWalkingTo = false;
					mapService.moveTeam($scope.currentAction.target);
				},
				cancel: function () {
					$scope.currentAction.target.teamWalkingTo = false;
				}
			},
			searchRoom: {
				start: function () {
				},
				progress: function (delta) {
					$scope.currentAction.target.searchProgress += delta / ($scope.teamTired > 0 ? 2 : 1);
					$scope.currentAction.progress = 1000 * $scope.currentAction.target.searchProgress / 2000;
				},
				complete: function () {
					$scope.lootingRoom = true;
				},
				cancel: function () {
				}
			},
			useItem: {
				start: function () {
					$scope.currentAction.itemOwner = gameService.getSelectedItemOwner();
					if ($scope.currentAction.itemOwner) {
						$scope.currentAction.itemSlot = gameService.getSelectedItemSlot();
						$scope.currentAction.item = gameService.getSelectedItem();
						$scope.currentAction.itemSlot.inUse = true;
						$scope.currentAction.itemOwner.active = false;
						if ($scope.currentAction.item.useChargeAtStart) {
							if ($scope.currentAction.item.charges && !(--$scope.currentAction.item.charges)) {
								$scope.currentAction.itemSlot.item = null;
							}
						}
					} else {
						$scope.cancelAction();
					}
				},
				progress: function (delta) {
					if ($scope.currentAction.itemOwner.canPerformAction()) {
						var continueAction = true;
						var timeTaken = $scope.currentAction.item.actionTime;
						if ($scope.currentAction.item.progress) {
							continueAction = $scope.currentAction.item.progress($scope.currentAction.itemSlot, $scope.currentAction.itemOwner, $scope.currentAction.target, delta / (timeTaken * 10));
						}
						if (timeTaken) {
							$scope.currentAction.progress += delta / timeTaken;
						} else {
							$scope.currentAction.progress += delta / continueAction;
						}
						if (!continueAction) {
							$scope.cancelAction();
						}
					} else {
						$scope.cancelAction();
					}
				},
				complete: function () {
					$scope.currentAction.item.use($scope.currentAction.itemSlot, $scope.currentAction.itemOwner, $scope.currentAction.target);
					$scope.currentAction.itemSlot.inUse = false;
					$scope.currentAction.itemOwner.active = true;
					if (!$scope.currentAction.item.useChargeAtStart) {
						if ($scope.currentAction.item.charges && !(--$scope.currentAction.item.charges)) {
							$scope.currentAction.itemSlot.item = null;
						}
					}
					$scope.currentAction.item = null;
					$scope.currentAction.itemOwner = null;
				},
				cancel: function () {
					if ($scope.currentAction.itemOwner) {
						$scope.currentAction.itemOwner.active = true;
						$scope.currentAction.itemSlot.inUse = false;
					}
					$scope.currentAction.item = null;
					$scope.currentAction.itemOwner = null;
				}
			}
		};

	$scope.getMapTopOffset = function () {
		return $('#game-area').height() / 2 - mapService.getTileSize() / 2 - mapService.teamLocation.y * mapService.tileSize;
	};

	$scope.getMapLeftOffset = function () {
		return $('#game-area').width() / 2 - mapService.getTileSize() / 2 - mapService.teamLocation.x * mapService.tileSize;
	};

	$scope.showCharacterInfo = function (character) {
		$scope.selectedCharacter = character;
		gameService.pause();
		var modal = modalService.open({
			template: 'character-info-modal.html',
			scope: $scope
		});

		modal.on('close', function () {
			gameService.unpause();
		});
	};

	$scope.clickCharacter = function (character) {
		if (gameService.isItemSelected()) {
			var item = gameService.getSelectedItem();
			if (item.target === 'character' && character.alive) {
				$scope.startAction(actions.useItem, character);
			}
			gameService.deselectItem();
			return;
		} else {
			character.holdFire = !character.holdFire;
			$scope.checkIfAllHoldFire();
		}
	};

	$scope.bindKeys = function () {
		$document.bind('keydown', function (event) {
			var direction = null;
			switch (event.keyCode) {
				case 32:
					$scope.inputDirection('');
					break;
				case 37:
					$scope.inputDirection('W');
					break;
				case 38:
					$scope.inputDirection('N');
					break;
				case 39:
					$scope.inputDirection('E');
					break;
				case 40:
					$scope.inputDirection('S');
					break;
				$scope.$apply();
			}
		});
	};

	$scope.inputDirection = function (direction) {
		if (gameService.isGameOver) {
			// ignore action if the game's over
			return;
		};
		$scope.finishSearching();
		if ($scope.currentAction.actionObject) {
			if ($scope.isTeamMoving() && (!direction || $scope.currentAction.target !== mapService.getNextAreaForTeam(direction))) {
				// user tapped another direction
				$scope.cancelAction();
			}
			return;
		}
		if (gameService.isItemSelected()) {
			var item = gameService.getSelectedItem();
			if (item.target === 'area') {
				$scope.startAction(actions.useItem, direction);
			}
			gameService.deselectItem();
			return;
		}
		var path = mapService.getDirectionPathForTeam(direction);
		switch (true) {
			case !path: 
				return;
			case path.door && path.closed: 
				$scope.startAction(actions.openDoor, path);
				return;
			default:
				$scope.startAction(actions.walk, mapService.getNextAreaForTeam(direction));
		}
	};

	$scope.isTeamMoving = function () {
		return $scope.currentAction.actionObject === actions.walk;
	};

	$scope.startAction = function (action, target) {
		if (!$scope.currentAction.actionObject) {
			$scope.currentAction.actionObject = action;
			$scope.currentAction.progress = 0;
			$scope.currentAction.target = target;
			if ($scope.currentAction.actionObject.start) {
				$scope.currentAction.actionObject.start();
			}
		} else {
			console.error('Another action in progress');
		}
	};

	$scope.cancelAction = function () {
		if ($scope.currentAction.actionObject.cancel) {
			$scope.currentAction.actionObject.cancel();
		}
		$scope.currentAction.actionObject = null;
		$scope.currentAction.progress = 0;
		$scope.currentAction.target = null;
	};

	$scope.mainLoop = function () {
		var lastTime = new Date();
		interval = $interval(function () {
			if (gameService.isGameOver) {
				return;
			}
			var currentTime = new Date(),
				delta = currentTime - lastTime;
			lastTime = currentTime;
			if (gameService.gamePaused) {
				return;
			}
			controller.updateTeamSpeed(delta);
			controller.progressAction(delta);
			controller.doTheShooting(delta);
			controller.doTheWalking(delta);
			controller.spawnZombies(delta);
			eventService.fireUpdate(delta);
		}, intervalTime);
	};

	controller.spawnZombies = function (delta) {
		_.each(mapService.spawners, function (spawnerTile) {
			if (spawnerTile.teamHeat) {
				spawnerTile.spawnTimer -= delta;
				if (spawnerTile.spawnTimer < 0) {
					var random = _.random(1, 100);
					var specialEnemies = enemyService.getEnemyTypesSpecialsForLevel();
					if (specialEnemies.length && random < 3) {
						var enemy = _.sample(specialEnemies);
					} else {
						var enemy = _.sample(enemyService.enemyTypesFillers);
					}
					spawnerTile.enemies.push(enemyService.newEnemy(enemy, spawnerTile));
					mapService.checkVisibility();
					spawnerTile.spawnTimer += _.random(10000, 16000) / spawnerTile.spawnRate;
				}
			}
		});
	};

	controller.updateTeamSpeed = function (delta) {
		if ($scope.teamTired > 0) {
			$scope.teamTired -= delta;
		}
	};

	controller.progressAction = function (delta) {
		if ($scope.currentAction.actionObject) {
			$scope.currentAction.actionObject.progress(delta);
			if ($scope.currentAction.progress >= 1000) {
				$scope.currentAction.actionObject.complete();
				$scope.currentAction.actionObject = null;
			}
		}
	};

	controller.doTheShooting = function (delta) {
		_.each(_.shuffle(characterService.team), function (character) {
			if (character.canShoot() && character.weapon.item && character.weapon.item.isWeapon()) {
				if ((character.weapon.item.ammo > 0 || !character.weapon.item.clipSize) && character.reloadingTimer <= 0) {
					if (!character.holdFire) {
						var validTargets = _.groupBy(mapService.getValidTargets(), 'distance');
						var target = null;
						_.each(validTargets, function (targetsGroup, distance) {
							if (!target && character.weapon.item.range >= distance) {
								target = _.sample(targetsGroup);
							}
						});
						if (target) {
							$scope.teamTired = 3000;
							if (character.rofTimer <= 0) {
								controller.shootAt(target, character);
								character.resetAim();
							} else {
								character.rofTimer -= delta;
							}
						} else {
							character.resetAim();
						}
					}
				} else {
					characterService.reloading(character, delta);
					character.resetAim();
				}
			}
		});
	};

	controller.shootAt = function (target, character) {
		var chanceToHit = character.weapon.item.baseChanceToHit * character.skillModifier('weapons', character.weapon.item.skillRequired);

		character.weapon.item.ammo -= 1;
		if (character.weapon.item.ammo === 0) {
			characterService.startReloading(character);
		}

		var weaponFrame = character.$element.find('.weapon');
		if (_.random(1, 100) < chanceToHit) {
			enemyService.damage(target.enemy, _.random(character.weapon.item.dmgMin, character.weapon.item.dmgMax));
			weaponFrame.find('.weapon-miss').css({opacity: 0});
			// TODO: turn into CSS animation to support Zepto  in some shape or form
			weaponFrame.find('.weapon-hit').stop(true).css({opacity: 1}).animate({opacity: 1}, 600, function () {
				weaponFrame.find('.weapon-hit').animate({opacity: 0}, 400);
			});
		} else {
			target.enemy.tile.fireMiss(character);
			weaponFrame.find('.weapon-hit').css({opacity: 0});
			// TODO: turn into CSS animation to support Zepto  in some shape or form
			weaponFrame.find('.weapon-miss').stop(true).css({opacity: 1}).animate({opacity: 1}, 600, function () {
				weaponFrame.find('.weapon-miss').animate({opacity: 0}, 400);
			});
		}
	};

	controller.doTheBiting = function (enemy) {
		enemy.attackTimer += _.random(900, 1100); // fixed for now
		var attackedTeamMember = _.sample(characterService.getAliveMembers());
		if (attackedTeamMember) {
			$scope.teamTired = 3000;
			attackedTeamMember.damage(_.random(Math.floor(enemy.type.damage * 0.8), enemy.type.damage));
		};
	};

	controller.doTheWalking = function (delta) {
		_.each(mapService.areas, function (tile) {
			_.each(tile.enemies, function (enemy) {
				if (tile.teamPresent) {
					enemy.walking = 0;
					if (enemy.attackTimer <= 0) {
						controller.doTheBiting(enemy);
					}
				} else {
					enemy.attackTimer = _.random(900, 1100); // fixed for now
					if (tile.enemyDirection) {
						enemy.walking += delta;
						if (enemy.walking > enemy.speed) {
							enemy.walking -= enemy.speed;
							var chanceToWalk = Math.max(100 - Math.max(mapService.teamSteps - tile.teamHeat - 3, 0) * 5, 50);
							if (_.random(1, 100) < chanceToWalk) {
								var targetTile = mapService.getTileInDirection(tile, tile.enemyDirection);
								if (mapService.isOpen(tile.enemyDirection, tile)) {
									mapService.moveEnemy(enemy, targetTile);
									_.each(tile.enemies, function (otherEnemiesInTheRoom) {
										if (otherEnemiesInTheRoom !== enemy) {
											otherEnemiesInTheRoom.walking -= 250;
										}
									});
								}
							}
						}
					}
				}
				if (enemy.attackTimer > 0) {
					enemy.attackTimer -= delta;
				}
			});
		});
	};

	$scope.checkIfAllHoldFire = function () {
		$scope.allHoldFire = true;
		_.each(characterService.team, function (character) {
			$scope.allHoldFire = $scope.allHoldFire && character.holdFire;
		});
	};

	$scope.toggleHoldFire = function () {
		_.each(characterService.team, function (character) {
			character.holdFire = !$scope.allHoldFire;
		});
		$scope.checkIfAllHoldFire();
	};

	$scope.backToMenu = function () {
		$interval.cancel(interval);
		$location.path('main-menu');
	};

	$scope.getTeamLocation = function () {
		return mapService.teamLocation;
	};

	$scope.canFinishLevel = function () {
		return mapService.teamLocation.finish;
	};

	$scope.canSearchRoom = function () {
		return mapService.teamLocation.hasItems() && mapService.teamLocation.isLit() && !$scope.currentAction.actionObject;
	};

	$scope.searchRoom = function () {
		$scope.startAction(actions.searchRoom, mapService.teamLocation);
	};

	$scope.finishSearching = function () {
		$scope.lootingRoom = false;
	};

	$scope.finishLevel = function () {
		$scope.gameReady = false;
		gameService.startLoading().then(function () {
			gameService.increaseDifficulty();
			mapGeneratorService.createNewMap();
			$scope.floor++;
			gameService.finishLoading(200).then(function () {
				$scope.gameReady = true;
			});
		});
	};

	$scope.isGameOver = function () {
		return gameService.isGameOver;
	};

	$scope.init = function () {
		//* START: quick setup /
		if (characterService.team.length === 0) {
			//$location.path('main-menu');

			gameService.resetGame();

			characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['warrior']));
			characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['medic']));
			characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['hacker']));
			characterService.addToTeam(characterService.createNewCharacter(characterService.archetypes['grenadier']));

			console.log('---- The team:')
			console.log(characterService.team);
			mapGeneratorService.createNewMap();
			console.log('---- The map:')
			console.log(mapService.map);
		}
		//* END: quick setup /

		$scope.bindKeys();

		$scope.mainLoop();

		gameService.finishLoading(200).then(function () {
			$scope.gameReady = true;
		});
	};
});*/
