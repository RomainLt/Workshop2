app.controller('MainController', function($scope, service) {
    $scope.commandes = {};

    $scope.play = function(test) {
        var x = test.x;
        var y = test.y;
        var id = test.id;
        console.log(x, y, id);

        service.getPlay(x, y, id)
            .then(function success(response) {
                console.log(response.data);
            }, function error(res) {
                console.log(res.data);
            });
    };

    $scope.tour = function(who) {
        var idJoueur = who.id;
        console.log(idJoueur);

        service.getTurn(idJoueur)
            .then(function success(response) {
                console.log(response.data);
                $scope.mydata = response.data;
            }, function error(res) {
                console.log(res.data);
            });
    };

    $scope.vider = function() {
        service.getEmpty()
            .then(function success(response) {
                $scope.j1 = response.data.J1;
                $scope.j2 = response.data.J2;
                console.log(response.data);
            }, function error(res) {
                console.log(res.data);
            });
    };

    // $scope.getUsers = function() {
    //     Service.getUsers(joueurName)
    //         .success(function(response) {
    //             $scope.error = null;
    //         }).error(function() {
    //             $scope.error = 'Server communication error';
    //         });
    // };

    // $scope.getTurn = function() {
    //     Service.getTurn()
    //         .success(function(response) {
    //             $scope.error = null;
    //         }).error(function(data, status) {
    //             $scope.error = 'IA communication error';
    //         });
    // };
});