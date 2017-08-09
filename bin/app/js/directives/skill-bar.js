'use strict';

Vue.component('skillBar', {
    props: ['skill','value'],
    data(){return {}},
    template: `
    <div class="skill-bar">
        <img :src="'imgs/skills/' + skill + '.png'" />
        <div class="skill-gauge">
            <div v-for="i in [1, 2, 3, 4, 5]" class="skill-cell" :class="{set: value >= i}"></div>
        </div>
    </div>`
});
