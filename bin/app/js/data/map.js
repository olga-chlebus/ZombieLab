'use strict';

angular.module('ZombieLabApp')

.run(function (mapService) {
	mapService.roomTypes = {
		laboratory: {
			chance: 100,
			enemies: 1,
			enemiesSpecial: 1,
			specials: {
				lightsOff: 1
			}
		},
		office: {
			chance: 100,
			enemies: 1,
			enemiesSpecial: 1,
			items: {
				ammo: 0.8
			},
			specials: {
				lightsOff: 1
			}
			// bit of ammo / small misc item
		},

		restrooms: {
			chance: 30,
			enemies: 0.6,
			spawn: 1,
			items: {
				medications: 0.6
			},
			specials: {
				lightsOff: 1
			}
		},
		sewers: {
			chance: 15,
			enemies: 0.6,
			spawn: 1.5,
			spawnSpecial: true,
			specials: {
				lightsOff: 60
			}
		},

		lockerRoom: {
			chance: 20,
			enemies: 0.6,
			items: {
				ammo: 0.6,
				misc: 0.6,
				medications: 0.3
			},
			specials: {
				lightsOff: 1
			}
			//misc items
		},
		lounge: {
			chance: 20,
			enemies: 3,
			enemiesSpecial: 1,
			specials: {
				lightsOff: 1
			}
			//mini-tension room?
		},

		security: {
			// hack for map / guns
			chance: 10,
			security: 1,
			enemies: 0.5,
			items: {
				hacking: 1,
				weapons: 0.7,
				ammo: 1
			},
			specials: {
			}
		},
		storage: {
			chance: 10,
			items: {
				misc: 0.6
			},
			specials: {
				lightsOff: 1,
				explosiveBarrels: 5
			}
			//better misc items
		},
		workshop: {
			chance: 10,
			security: 1,
			enemies: 0.5,
			items: {
				explosives: 1,
				misc: 0.5
			},
			specials: {
				explosiveBarrels: 20
			}
			//explosives?
			// +1 lock difficulty
		},
		medbay: {
			chance: 10,
			enemies: 0.5,
			items: {
				medications: 1.5
			},
			specials: {
				lightsOff: 1
			}
			//med supplies
		},
		armory: {
			chance: 10,
			security: 1,
			enemies: 1,
			enemiesSpecial: 2,
			items: {
				ammo: 2,
				weapons: 1.6
			},
			specials: {
				explosiveBarrels: 2
			}
			// GUNS / ammo
		},
		checkpoint: {
			chance: 10,
			security: 1,
			enemies: 1,
			enemiesSpecial: 2,
			items: {
				misc: 0.6
			}
			// turrets
		},
		serverRoom: {
			chance: 10,
			security: 1,
			enemies: 0.5,
			specials: {
				lightsOff: 5
			}
			// +1 lock difficulty
		},
		VIPoffice: {
			chance: 10,
			security: 2,
			enemies: 1,
			enemiesSpecial: 5
			// story? credits?
		},
		morgue: {
			chance: 10,
			enemies: 8
			// tension room
		}

		// laundry: {

		// },
		// kitchen: {
		// 	// special zombie?
		// },
	};
});
