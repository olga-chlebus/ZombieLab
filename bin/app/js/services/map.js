'use strict';

const mapService = {
	directionOffsets: {
		'N': [0, -1],
		'S': [0, 1],
		'E': [1, 0],
		'W': [-1, 0]
	},
	directions: ['N', 'E', 'S', 'W'],
	tileSize: 20, // Needed for the camera
	map: [],
	areas: [],
	paths: [],
	spawners: [],
	mapSizeX: 10,
	mapSizeY: 8,
	startTile: null,
	finishTile: null,
	roomCount: 0,
	areaCount: 0,
	mapMargins: 2, // determines start/finish locations distance from borders
	teamLocation: null,
	validTargets: [],
	teamSteps: 10,

	getTileElement (tile) {
		return $('.map .column').eq(tile.x).find('.tile').eq(tile.y);
	},

	getTileSize () {
		if (!mapService.tileSize) {
			mapService.tileSize = $('.tile').outerHeight();
		}
		return mapService.tileSize;
	},

	getAllAreas () {
		return mapService.areas;
	},

	getNeighbouringAreas (x, y) {
		var result = [];
		if (mapService.map[x+1]) result.push(mapService.map[x+1][y]);
		if (mapService.map[x-1]) result.push(mapService.map[x-1][y]);
		if (mapService.map[x][y+1]) result.push(mapService.map[x][y+1]);
		if (mapService.map[x][y-1]) result.push(mapService.map[x][y-1]);
		result = _.filter(result, function (tile) {
			return tile.area;
		});
		return result;
	},

	getAccessibleAreas (tile, onlyOpen) {
		var result = {};
		_.each(directionOffsets, function (offset, direction) {
			if (tile[direction] && (!onlyOpen || mapService.isOpen(direction, tile))) {
				result[direction] = mapService.map[tile.x + offset[0]][tile.y + offset[1]];
			}
		});
		return result;
	},

	moveTeam (tile) {
		if (mapService.teamLocation) {
			mapService.teamLocation.teamPresent = false;
			mapService.teamLocation.teamHeat = mapService.teamSteps;
		}
		mapService.teamLocation = tile;
		mapService.teamSteps++;
		mapService.teamLocation.teamHeat = mapService.teamSteps;
		mapService.teamLocation.teamPresent = true;
		mapService.checkVisibility();
		mapService.calculateEnemyPaths();
		eventService.fireTeamMove('test', 5);
	},

	moveEnemy (enemy, tileTo) {
		enemy.tile.enemies = _.without(enemy.tile.enemies, _.findWhere(enemy.tile.enemies, enemy));
		tileTo.enemies.push(enemy);
		enemy.tile = tileTo;
		mapService.checkVisibility();
	},

	registerValidTargets (tile, distance) {
		if (!tile.isLit()) {
			return;
		}
		_.each(tile.enemies, function (enemy) {
			if (enemy.health > 0) {
				mapService.validTargets.push({
					tile: tile,
					enemy: enemy,
					distance: distance
				});
			}
		});
	},

	checkVisibility () {
		for (var x = 0; x < mapService.mapSizeX; x++) {
			for (var y = 0; y < mapService.mapSizeY; y++) {
				mapService.map[x][y].visible = false;
			}
		}
		mapService.map[mapService.teamLocation.x][mapService.teamLocation.y].visible = true;
		mapService.map[mapService.teamLocation.x][mapService.teamLocation.y].revealed = true;
		mapService.validTargets = [];
		mapService.registerValidTargets(mapService.teamLocation, 0);
		_.each(mapService.directions, function (direction) {
			var currentTile = mapService.teamLocation;
			var distance = 0;
			var directionOffset = directionOffsets[direction];
			do {
				var currentWay = currentTile[direction];
				if (!mapService.map[currentTile.x + directionOffset[0]]) {
					break;
				}
				currentTile = mapService.map[currentTile.x + directionOffset[0]][currentTile.y + directionOffset[1]];
				if (!currentTile || !currentWay || currentWay.closed) {
					break;
				}
				currentTile.visible = true;
				currentTile.revealed = true;
				distance++;
				currentTile.teamHeat = mapService.teamSteps - distance;
				mapService.registerValidTargets(currentTile, distance);
				if (currentTile.room || true) {// only 1 sq sight range
					break;
				}
			} while (true);
		});
	},

	calculateEnemyPaths () {
		_.each(mapService.areas, function (currentTile) {
			var neighbouring = mapService.getAccessibleAreas(currentTile, true);
			var bestHeat = currentTile.teamHeat;
			var bestHeatDirection = '';
			_.each(neighbouring, function (tile, direction) {
				if (bestHeat < tile.teamHeat) {
					bestHeat = tile.teamHeat;
					bestHeatDirection = direction;
				}
			});
			currentTile.enemyDirection = bestHeat !== 0 ? bestHeatDirection : '';
		});
	},

	getDirectionPathForTeam (direction) {
		return mapService.teamLocation[direction];
	},

	getTileInDirection (tile, direction) {
		var offset = directionOffsets[direction];
		return mapService.map[tile.x + offset[0]][tile.y + offset[1]];
	},

	getNextAreaForTeam (direction) {
		if (!direction) {
			return mapService.teamLocation;	
		}
		return mapService.map[mapService.teamLocation.x + directionOffsets[direction][0]][mapService.teamLocation.y + directionOffsets[direction][1]];
	},

	isOpen (direction, tile) {
		tile = tile || mapService.teamLocation;
		return tile[direction] && (!tile[direction].door || !tile[direction].closed);
	},

	isDoor (direction, tile) {
		tile = tile || mapService.teamLocation;
		return tile[direction] && tile[direction].door;
	},

	openDoor (path) {
		path.closed = false;
		mapService.checkVisibility();
		mapService.calculateEnemyPaths();
	},

	closeDoor (path, security) {
		path.closed = true;
		path.security = security || 0;
		mapService.checkVisibility();
	},

	getValidTargets () {
		return mapService.validTargets;
	},

	addAnimation (tile, animation, duration) {
		var idx = _.size(tile.animations);
		tile.animations[idx] = animation;
		if (duration) {
			$timeout(function () {
				delete tile.animations[idx];
			}, duration);
		}
	}
};

