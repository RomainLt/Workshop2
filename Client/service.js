app.factory('service', function($http) {

    var baseUrl = 'http://workshop2.cleverapps.io';

    return {
        getUsers: function(joueurName) {
            return $http({
                method: 'GET',
                url: baseUrl + '/connect/' + joueurName,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
            //.get('http://workshop2.cleverapps.io/connect/:joueurName');
        },
        getPlay: function(x, y, id) {
            return $http({
                method: 'GET',
                url: baseUrl + '/play/' + x + '/' + y + '/' + id,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
            // var deferred = $q.defer();
            // $http.get('http://workshop2.cleverapps.io/play/:x/:y/:idJoueur')
            //     .success(function(data) {
            //         deferred.resolve(data.records);
            //     })
            //     .error(function(data, status) {
            //         deferred.reject(data);
            //         //SomeErrorService.handleHttpError(data, status);
            //     });
            // return deferred.promise;
        },
        getTurn: function(idJoueur) {
            return $http({
                method: 'GET',
                url: baseUrl + '/turn/' + idJoueur,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
            // $a = $http.get('http://workshop2.cleverapps.io/turn/:idJoueur');
            // return ia(a);
        }
    }
});