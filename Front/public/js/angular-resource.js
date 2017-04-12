app = angular.module('Ws', []);

app.controller('homeController', function($scope, $http, $q, $timeout) {
    var row = 0;
    var col = 0;
    var player = 0;

    var defer = $q.defer();

    var list;

    var b = 0;

    var timer = $timeout(function refresh() {
        $http.get('http://workshop2.cleverapps.io/turn/1').success(function(response) {
            $scope.mydata = response;
            // console.log(response);
            list = response.tableau;
            // console.log(list);
            defer.resolve();
        });



        defer.promise.then(function success() {
            console.log("load board");

            var view = {
                board: [], //Plateau

                n: 19, //Lignes
                m: 19, //Colonnes

                game_status: 0, //Statut de la partie, 0 en cours, -1 match nul, 1 joueur 1 gagne, 2 joueur 2 gagne
                coups: 0, //Nombre de coups joués

                init: function(parent, lignes, colonnes) {
                    //Création du plateau
                    if (lignes) this.n = lignes;
                    if (colonnes) this.m = colonnes;

                    t = document.createElement('table');
                    t.id = 'plateau';

                    for (var i = 0; i < this.n; i++) {
                        var tr = document.createElement('tr');
                        this.board[i] = [];
                        for (var j = 0; j < this.m; j++) {
                            var td = document.createElement('td');
                            td.dataset.column = j;
                            tr.appendChild(td);
                            this.board[i][j] = td;
                        }
                        t.appendChild(tr);
                    }
                    parent.innerHTML = '';
                    parent.appendChild(t);
                    this.set();
                },

                set: function() {
                    // console.log(list[0][0]);
                    for (var i = 0; i < 19; i++) {
                        for (var j = 0; j < 19; j++) {
                            if (list[i][j] != 0) {
                                this.board[i][j].className = 'joueur' + list[i][j];
                            }
                        }
                    }
                }
            }
            view.init(document.querySelector('#board'));
        });
        timer = $timeout(refresh, 5000);
    }, 500);
});