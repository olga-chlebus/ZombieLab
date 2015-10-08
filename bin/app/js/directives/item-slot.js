'use strict';

angular.module('ZombieLabApp')

.directive('itemSlot', function ($timeout, gameService, characterService, modalService) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: 'partials/directives/item-slot.html',
		scope: {
			item: '=',
			slot: '@',
			character: '=',
			allowedLarge: '@',
			disabled: '='
		},
		controller: function ($scope, $element) {
			var controller = this;

			$scope.allowedLarge = $scope.allowedLarge || false;
			$scope.model = {
				dragStart: {
					x: null,
					y: null
				}
			};

			$scope.swapItems = function () {
				var $scopeSource = gameService.selectedItemSlot;
				if ((!$scope.item || !$scope.item.model.isLarge || $scopeSource.allowedLarge) &&
					(!$scopeSource.item || !$scopeSource.item.model.isLarge || $scope.allowedLarge)) {
					var temp = $scope.item;
					$scope.item = $scopeSource.item;
					$scopeSource.item = temp;
				} else {
					ZombieLab.error('You can\'t swap these items');
				}
				gameService.deselectItem();
			};

			$scope.selectItem = function () {
				if ($scope.item.model.immediateUse) {
					$scope.item.model.use($scope);
				} else {
					gameService.selectedItemSlot = $scope; // that's pretty bad, but workarounds would be worse
				}
			};

			$scope.click = function () {
				if ($scope.disabled || $scope.tempDisabled) {
					return;
				}
				if (gameService.selectedItemSlot) {
					if (gameService.selectedItemSlot === $scope) {
						if ($scope.character) {
							characterService.useItem($scope.character, $scope.item, $scope.slot);
							gameService.deselectItem();
						}
					} else {
						$scope.swapItems();
					}
					return;
				}
				if ($scope.item) {
					$scope.selectItem();
					return;
				}
			};

			$scope.showItemInfo = function () {
				if (!$scope.item) {
					return;
				}
				gameService.pause();
				var modal = modalService.open({
					template: 'item-info-modal.html',
					scope: $scope
				});

				modal.on('close', function () {
					gameService.unpause();
				});
			};

			$scope.isSelected = function () {
				return gameService.selectedItemSlot === $scope;
			};
		}
	};
});
