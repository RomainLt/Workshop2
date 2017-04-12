angular.module('myApp')
  .controller('MainController', ['$scope', 'Service', function ($scope, Service) {
    $scope.getUsers = function() {
     Service.getUsers()
        .success(function(response) {
          $scope.customers = response.records;
          $scope.error = null;
        }).error(function() {
          $scope.customers = null;
          $scope.error = 'Server communication error';
        });
    };
    
    $scope.getTurn = function() {
      Service.getTurn()
        .success(function(response) {
          $scope.customers = response.records;
          $scope.error = null;
        }).error(function(data, status) {
          $scope.customers = null;
          $scope.error = 'IA communication error';
        });
    };
    
    $scope.getPlay = function() {
      Service.getPlay()
        .then(function(customers) {
          $scope.customers = customers;
          $scope.error = null;
        }, function() {
          $scope.customers = null;
          $scope.error = 'Server communication error';
        });
    };
  }]);