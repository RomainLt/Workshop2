app.controller('MainController', function($scope, service, $interval) {
    var idJoueur;

    model = new AppModel();
    // model = new AppModel();
    // view = new AppView(model);
    // controller = new AppController(model, view);

    var currentPlayer;
    var firstmove = false;

    $scope.connect = function(joueur) {
        var name = joueur.name;

        service.getConnect(name)
            .then(function success(response) {
                    $scope.dataCo = response.data;
                    idJoueur = response.data.idJoueur; //ID du joueur
                    console.log(idJoueur);
                    $interval(test, 5000);
                },
                function error(res) {
                    console.log(res.data);
                });
    }

    function test() {
        console.log("boucle");
        currentPlayer = null;
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
                        model.setStartData(2, tab);
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
        //Récupération du coup à jouer par l'IA puis appel de goPlay
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