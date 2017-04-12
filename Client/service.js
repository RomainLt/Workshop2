angular.module('myApp')
  .service('Service', ['$http', '$q', function($http, $q) {
    
    this.getUsers = function() {
      return $http.get('http://workshop.gaetan-marecat.fr/api/doc/connect');
    };
    
   
    
    this.getPlay = function() {
      var deferred = $q.defer();
      $http.get('http://workshop.gaetan-marecat.fr/api/doc/play')
      .success(function (data) {
          data.records[0].City = 'Munich';
          deferred.resolve(data.records);
      })
      .error(function (data, status) {
          deferred.reject(data);
          //SomeErrorService.handleHttpError(data, status);
      });
      return deferred.promise;
    };


     this.getTurn = function() {
      $a=$http.get('http://workshop.gaetan-marecat.fr/api/doc/turn/tableau');
      return ia(a);
    };
    
  }]);