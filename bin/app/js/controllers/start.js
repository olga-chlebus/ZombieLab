'use strict';

Vue.component('start', {
    created(){
        gameService.finishLoading();
    },
    template: `
    <div class="big-button-wrapper">
        <div class="big-button">
            <a href="#/main-menu" class="btn-large">Start</a>
        </div>
    </div>`

});
