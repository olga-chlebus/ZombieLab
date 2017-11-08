'use strict';

Vue.component('team-setup', {
	data(){
		return{
			roster: characterService.roster,
			charactersSelectedCount: 0,
			targetTeamSize: 4
		};
	},
	created(){
		if (characterService.roster.length === 0) {
			//$location.path('main-menu');
			console.log('Navigating back to main menu...');
			window.location.href = '#/main-menu';
		}
	},
	methods: {
		selectCharacter(character) {
			if (this.charactersSelectedCount < this.targetTeamSize || character.selected) {
				character.selected = !character.selected;
				this.charactersSelectedCount += character.selected ? +1 : -1;
			}
		},
		startGame() {
			gameService.startLoading().then(function () {
				characterService.wipeTeam();
				_.each(characterService.roster, function (character) {
					if (character.selected) {
						characterService.addToTeam(character);
					}
				});
				window.location.href = '#/game';
			});
		}
	},
	template: //`<div>test</div>`
		`<div class="team-setup" ng-init="init();">
			<div class="characters">
				<div class="character-wrapper" v-for="character in roster" @click="selectCharacter(character);" :class="{selected: character.selected}">
					<character-panel :character="character" :disable-items="true"></character-panel>
					<div class="skills">
						<skill-bar v-for="(value, skill) in character.skills" :skill="skill" :value="value"></skill-bar>
					</div>
				</div>
			</div>
			<div>Team members selected: {{charactersSelectedCount}} / {{targetTeamSize}}
				<button class="start-game" @click="startGame();" :disabled="charactersSelectedCount != targetTeamSize">
					Go!
				</button>
			</div>
		</div>`
});