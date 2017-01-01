(function () {
'use strict';

angular.module('LunchCheck', [])
.controller('LunchCheckController', LunchCheckController);

LunchCheckController.$inject = ['$scope'];
function LunchCheckController ($scope) {

  $scope.Check = function () {
    var allitems  = $scope.items;
    if (allitems == null) {
      $scope.msg = "Please enter data first";
    }
    var comma = ',';
    var result = allitems.split(comma);
  //  var count1 = result.length;
    var count = 0;           // NOT considering an empty item, i.e., , , as an item towards to the count
    for( var a in result){
      if(result[a] != ''){count++;}
    }
    if(count == 0){
        $scope.msg = "Please enter data first";
    }
    else if (count <= 3) {
        $scope.msg = "Enjoy!";
    }
    else {
        $scope.msg = "Too much!";
    }

  };


}


})();
