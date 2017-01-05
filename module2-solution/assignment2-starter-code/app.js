(function () {
'use strict';

angular.module('ShoppingListCheckOff', [])
.controller('AlreadyBoughtController', AlreadyBoughtController)
.controller('ToBuyController', ToBuyController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService);

AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
function AlreadyBoughtController(ShoppingListCheckOffService) {
  var itemAdder = this;

  itemAdder.broughtitems = ShoppingListCheckOffService.getBroughtItems();

  // itemAdder.itemName = "";
  // itemAdder.itemQuantity = "";
  //
  // itemAdder.addItem = function () {
  //   ShoppingListCheckOffService.addItem(itemAdder.itemName, itemAdder.itemQuantity);
  // }
}


ToBuyController.$inject = ['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService) {
  var buyList = this;

  buyList.items = ShoppingListCheckOffService.getItems();

  buyList.removeItem = function (itemIndex) {
    ShoppingListCheckOffService.removeItem(itemIndex);
  };
}


function ShoppingListCheckOffService() {
  var service = this;

  // List of shopping items
  var items = [
    { name: 'Cookies', quantity: 10},
    { name: 'Juice bottles', quantity: 5},
    { name: 'Bread', quantity: 12},
    { name: 'Chocolate', quantity: 25},
    { name: 'Ice Cream', quantity: 2},
    { name: 'Pizza', quantity: 1},
    { name: 'Chips', quantity: 15}
  ];


var broughtitems = [];

  service.addItem = function (itemName, quantity) {
    var item = {
      name: itemName,
      quantity: quantity
    };
    items.push(item);
  };

  service.removeItem = function (itemIdex) {
     broughtitems.push(items[itemIdex]);
    items.splice(itemIdex, 1);

  };

  service.getItems = function () {
    return items;
  };

  service.getBroughtItems = function () {
    return broughtitems;
  };
}

})();
