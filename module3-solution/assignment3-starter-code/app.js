(function () {
  'use strict'

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective)
    .directive('itemsLoaderIndicator', ItemsLoaderIndicatorDirective)
    .filter('menuItems', MenuItemsFilter)
    .constant('ClientAPI', 'https://davids-restaurant.herokuapp.com/menu_items.json')

  /**
   * [FoundItemsDirective description]
   */
  function FoundItemsDirective () {
    var ddo = {
      restrict: 'E',
      scope: {
        searchTerm: '@',
        found: '<',
        onRemove: '&',
        searchQuery: '&',
        nothingFound: '&'
      },
      templateUrl: 'foundItems.html',
      controller: FoundItemsDirectiveController,
      controllerAs: 'items',
      bindToController: true
    }
    return ddo
  }
  function FoundItemsDirectiveController () {}

    /**
     * [FoundItemsDirective description]
     */
  function ItemsLoaderIndicatorDirective () {
    var ddo = {
      restrict: 'E',
      scope: {
        loading: '&'
      },
      templateUrl: 'loader/itemsloaderindicator.template.html',
      controller: ItemsLoaderIndicatorDirectiveController,
      controllerAs: 'loader',
      bindToController: true
    }
    return ddo
  }
  function ItemsLoaderIndicatorDirectiveController () {}

/**
 * NarrowItDownController
 */
  NarrowItDownController.$inject = ['MenuSearchService']
  function NarrowItDownController (MenuSearchService) {
    var narrowDownCtrl = this
    narrowDownCtrl.searchTerm = ''
    narrowDownCtrl.found = []
    narrowDownCtrl.firstVisit = true
    narrowDownCtrl.isLoading = false

    narrowDownCtrl.searchMenu = function (searchTerm) {
      narrowDownCtrl.searchTerm = searchTerm

      if (searchTerm.trim() === '') {
        narrowDownCtrl.firstVisit = false
        narrowDownCtrl.found = []
      } else {
        narrowDownCtrl.isLoading = true
        var promise = MenuSearchService.getMatchedMenuItems(searchTerm)
        promise.then(function (response) {
          narrowDownCtrl.firstVisit = false
          narrowDownCtrl.found = Array.from(response)
        }).catch(function (error) {
          console.log(error)
        }).finally(function () {
          narrowDownCtrl.isLoading = false
        })
      }
    }

    narrowDownCtrl.getItems = function () {
      return narrowDownCtrl.found
    }

    narrowDownCtrl.removeItem = function (index) {
      narrowDownCtrl.found.splice(index, 1)
    }

    narrowDownCtrl.nothingFound = function () {
      var nothingFound = (!narrowDownCtrl.firstVisit &&
          narrowDownCtrl.searchTerm !== '' &&
          narrowDownCtrl.found.length === 0) ||
          (!narrowDownCtrl.firstVisit && narrowDownCtrl.searchTerm === '' && narrowDownCtrl.found.length === 0)
      return nothingFound
    }

    narrowDownCtrl.searchQuery = function () {
      var searchQuery = narrowDownCtrl.searchTerm || narrowDownCtrl.found.length
      return searchQuery
    }

    narrowDownCtrl.resetForm = function () {
      narrowDownCtrl.firstVisit = true
      narrowDownCtrl.isLoading = false
    }

    narrowDownCtrl.loading = function () {
      return narrowDownCtrl.isLoading
    }
  }

/**
 * MenuSearchService
 */
  MenuSearchService.$inject = ['$http', 'menuItemsFilter', 'ClientAPI']
  function MenuSearchService ($http, menuItemsFilter, ClientAPI) {
    var service = this

    service.getMatchedMenuItems = function (searchTerm) {
      var items = $http({
        method: 'GET',
        url: (ClientAPI),
        cache: true
      }).then(
        function (response) {
          return menuItemsFilter(response.data.menu_items, searchTerm)
        })
      return items
    }
  }

/**
 * MenuItemsFilter
 */
  MenuItemsFilter.$inject = ['$filter']
  function MenuItemsFilter ($filter) {
    return function (items, query) {
      var filteredMenuItems = []
      var term = $filter('lowercase')(query) /* lowercase search term & haystacks */

      for (var i = 0; i < items.length; i++) {
        var itemName = $filter('lowercase')(items[i].name)
        var itemDescription = $filter('lowercase')(items[i].description)

        if (itemName.includes(term) || itemDescription.includes(term)) {
          filteredMenuItems.push(items[i])
        }
      }
      return filteredMenuItems
    }
  }
})()
