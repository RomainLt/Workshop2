var app = angular.module('Ws', []);

function PromiseCtrl($scope, $http) {
    $scope.example1 = $http.get('/test.json');
}