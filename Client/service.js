app.factory('service', function($http) {

    var baseUrl = 'http://workshop2.cleverapps.io';

    return {
        getConnect: function(name) {
            return $http({
                method: 'GET',
                url: baseUrl + '/connect/' + name,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
        },
        getPlay: function(x, y, id) {
            return $http({
                method: 'GET',
                url: baseUrl + '/play/' + x + '/' + y + '/' + id,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
        },
        getTurn: function(idJoueur) {
            return $http({
                method: 'GET',
                url: baseUrl + '/turn/' + idJoueur,
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
        },
        getEmpty: function() {
            return $http({
                method: 'GET',
                url: baseUrl + '/viderPlateau',
                headers: { 'Content-type': 'application/x-www-form-urlencoded' }
            });
        }
    }
});