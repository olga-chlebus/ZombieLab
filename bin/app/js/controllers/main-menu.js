'use strict';
Vue.component('main-menu', {
    data(){
        return {
            selectingTutorial: null
        }
    },
    created(){
        this.selectingTutorial = false;
    },
    methods:{
        continueGame(){
            console.log('hello');
        }
    },
    template: `
    <div class="main-menu">
    <div class="big-button-wrapper" v-show="!selectingTutorial">
        <div class="big-button" @click="selectingTutorial = true;">
            New Game
        </div>
        <div class="big-button" :disabled="true" @click="continueGame();">
            Continue
        </div>
    </div>
    <div class="big-button-wrapper" v-show="selectingTutorial">
        <div class="big-button" @click="startNewGame(true);">
            With tutorial
        </div>
        <div class="big-button" @click="startNewGame(false);">
            Skip tutorial
        </div>
    </div>
</div>`
});

/*angular.module('ZombieLabApp')

.controller('mainMenuController', function ($scope, $location, characterService, mapService, mapGeneratorService, gameService) {
    $scope.startNewGame = function (tutorialEnabled) {
        gameService.startLoading().then(function () {
            gameService.resetGame();
            characterService.buildNewRoster();
            mapGeneratorService.createNewMap();
            $location.path('team-setup');
            gameService.finishLoading();
            gameService.tutorialEnabled = tutorialEnabled;
        });
    };

    gameService.finishLoading();
});*/
