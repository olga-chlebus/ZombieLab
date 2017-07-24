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
			window.location.href = '#/main-menu';
		}
	},
	methods: {
		selectCharacter(character) {
			if ($scope.model.charactersSelectedCount < $scope.model.targetTeamSize || character.selected) {
				character.selected = !character.selected;
				$scope.model.charactersSelectedCount += character.selected ? +1 : -1;
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
				$location.path('game');
			});
		}
	},
	template: `<div>test</div>`
		/*<div class="team-setup" ng-init="init();">
			<div class="characters">
				<div class="character-wrapper" ng-repeat="character in model.roster" ng-click="selectCharacter(character);" ng-class="{'selected': character.selected}">
					<character-panel character="character" disable-items="true"></character-panel>
					<div class="skills">
						<skill-bar ng-repeat="(skill, value) in character.skills" skill="skill" value="value"></skill-bar>
					</div>
				</div>
			</div>
			<div>Team members selected: {{model.charactersSelectedCount}} / {{model.targetTeamSize}}
				<button class="start-game" ng-click="startGame();" ng-disabled="model.charactersSelectedCount != model.targetTeamSize">
					Go!
				</button>
			</div>
		</div>`*/
});