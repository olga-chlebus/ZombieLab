'use strict';

Vue.component('character-panel', {
	props:['character','readOnly','disableItems'],
	data(){
		return {}
	},
	methods:{
		characterHoldAction(){
			this.$emit('cHold');
		},
		characterClickAction(){
			this.$emit('cClick');
		}
	},
	template: `
		<div class="character-panel" :class="{dead: !character.alive, inactive: !character.active}">
			<div class="image" @hold="characterHoldAction();" @click="characterClickAction();">
				<div class="high-skills">
					<img v-for="skill in character.bestSkills" :src="'imgs/skills/' + skill + '.png'" />
				</div>
				<div class="name">{{character.name}}</div>
				<div class="health" :style="{height: 100 - (100 * character.health / character.maxHealth) + '%'}"></div>
			</div>
			<div class="items clearfix">
				<item-slot slot-type="weapon" :item-slot="character.weapon" :allowed-large="true" :character="character" :disabled="disableItems"></item-slot>
				<item-slot slot-type="large" :item-slot="character.itemLarge" :allowed-large="true" :character="character" :disabled="disableItems"></item-slot>
				<item-slot slot-type="small" :item-slot="character.itemSmall" :character="character" :disabled="disableItems"></item-slot>
			</div>
		</div>`
});

/*		controller: function ($scope, $element, $attrs) {
			if ($attrs.mainFrame) {
				$scope.character.$element = $element;
			}
			// $scope.killDebug = function () {
			// 	characterService.kill($scope.character);
			// }
		}
*/ //TODO