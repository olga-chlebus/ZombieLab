'use strict';

Vue.component('itemSlot', {
    props: ['itemSlot','slotType','character','allowedLarge','disabled'],
    data(){return {
        dragStart: {
            x: null,
            y: null
        }
    }},
    created(){
        //console.log('Item: ');
        //console.log(this.itemSlot.item);
        //console.log(this.itemSlot);
    },
    methods: {
        isSelected() {
            return this.itemSlot && gameService.selectedItemSlot === this.itemSlot;
        },
        showItemInfo() {
            if (!this.itemSlot.item) {
                return;
            }
            /*gameService.pause();
            gameService.deselectItem();
            var modal = modalService.open({
                template: 'item-info-modal.html',
                scope: $scope
            });

            modal.on('close', function () {
                gameService.unpause();
            });*/ //TODO
        },
        click() {
            if (this.itemSlot.item && this.itemSlot !== this.itemSlot.item.slot) {
                console.error('THIS IS REALLY BAD!');
            }
            if (this.disabled || this.itemSlot.inUse) {
                return;
            }
            if (gameService.selectedItemSlot) { //TODO - gameService.selectedItemSlot is undefined, for now
                if (gameService.selectedItemSlot === this.itemSlot) {
                    if (this.character) {
                        characterService.useItem(this.character, this.itemSlot.item, this.slotType);
                        gameService.deselectItem();
                    }
                } else {
                    this.swapItems();
                }
                return;
            }
            if (this.itemSlot.item) {
                this.selectItem();
                return;
            }
        }

    },
    template: `
    <div :class="['item-slot', slotType, {selected: isSelected()}]" @dblclick="showItemInfo()">
        <div class="item-slot-inner-wrapper" @click="click()">
            <div class="weapon-hit">{{itemSlot && itemSlot.item && itemSlot.item.model.sound}}</div>
            <div class="weapon-miss">MISS!</div>
            <div class="item">
                <div class="ammo" v-show="itemSlot && itemSlot.item && itemSlot.item.model.clipSize">{{itemSlot && itemSlot.item && itemSlot.item.ammo}}</div>
                <div class="charges" v-show="itemSlot && itemSlot.item && itemSlot.item.model.charges">{{itemSlot && itemSlot.item && itemSlot.item.charges}}</div>
                <div class="quantity" v-show="itemSlot && itemSlot.item && itemSlot.item.quantity">{{itemSlot && itemSlot.item && itemSlot.item.quantity}}</div>
                <div class="item-text reloading" v-show="slotType === 'weapon' && character.isReloading()">RELOAD</div>
                <div class="item-text hold-fire" v-show="slotType === 'weapon' && itemSlot && itemSlot.item && itemSlot.item.isWeapon() && character.holdFire && !character.isReloading()">HOLD</div>
                <img class="item-image" v-if="itemSlot && itemSlot.item" :src="'imgs/items/' + itemSlot.item.model.category + '/' + itemSlot.item.model.image + '.png'" />
            </div>
        </div>

    </div>`//,
//TODO
    /*return {
        controller: function ($scope, $element) {
            var controller = this;
            
            $scope.$watch('itemSlot', function () {
                if ($scope.itemSlot) {
                    $scope.itemSlot.allowedLarge = $scope.allowedLarge || false;
                    $scope.itemSlot.character = $scope.character;
                    $scope.itemSlot.disabled = $scope.disabled;
                    $scope.itemSlot.slotType = $scope.slotType;
                }
            });
            $scope.itemDroppable = function () {
                return gameService.isMainGame && $scope.itemSlot.character;
            };

            $scope.dropItem = function () {
                $scope.itemSlot.item.drop(mapService.teamLocation);
            };

            $scope.swapItems = function () {
                var sourceSlot = gameService.selectedItemSlot;
                if ((!$scope.itemSlot.item || !$scope.itemSlot.item.model.isLarge || sourceSlot.allowedLarge) &&
                    (!sourceSlot.item || !sourceSlot.item.model.isLarge || $scope.itemSlot.allowedLarge)) {
                    $scope.itemSlot.swapWith(sourceSlot);
                } else {
                    ZombieLab.error('You can\'t swap these items');
                }
                gameService.deselectItem();
            };

            $scope.selectItem = function () {
                if ($scope.itemSlot.item.model.immediateUse) {
                    $scope.itemSlot.item.model.use($scope.itemSlot); // TODO: wrong - it should be "use" on item itself
                } else {
                    gameService.selectedItemSlot = $scope.itemSlot;
                }
            };


            $scope.showItemInfo = function () {
                if (!$scope.itemSlot.item) {
                    return;
                }
                gameService.pause();
                gameService.deselectItem();
                var modal = modalService.open({
                    template: 'item-info-modal.html',
                    scope: $scope
                });

                modal.on('close', function () {
                    gameService.unpause();
                });
            };

        }
    };*/
});
