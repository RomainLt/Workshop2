app.controller('MainController', function($scope, service, $interval) {
    var idJoueur;

    model = new AppModel();
    var firstmove = false;

    $scope.connect = function(joueur) {
        var name = joueur.name;

        service.getConnect(name)
            .then(function success(response) {
                    $scope.dataCo = response.data;
                    idJoueur = response.data.idJoueur; //ID du joueur
                    console.log(idJoueur);
                    $interval(boucleJouer, 500);
                },
                function error(res) {
                    console.log(res.data);
                });
    }

    function boucleJouer() {
        console.log("boucle");
        var tour = 0;
        var tab;

        service.getTurn(idJoueur)
            .then(function success(response) {
                console.log("turn " + idJoueur);
                console.log(response.data);
                tour = response.data.status;
                console.log(tour);
                if (tour == 1) {
                    currentPlayer = idJoueur;
                    tab = response.data.tableau;
                    if (firstmove === false) {
                        model.setStartData(1, tab);
                        firstmove = true;
                    }
                    var res = nextMove(tab);

                    x = res.m;
                    y = res.n;
                    id = idJoueur;
                    //Joue
                    service.getPlay(x, y, id)
                        .then(function success(response) {
                            //Vérification du code
                            console.log(response.data);
                        }, function error(res) {
                            //Vérification du code
                            console.log(res.data);
                        });
                }
            }),
            function error(res) {
                console.log(res.data);
            }
    }

    function nextMove(tab) {
        var res = model.moveAI(tab);
        return (res);
    }

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
});