app = angular.module('Ws', []);

app.controller('homeController',function($scope,$http,$q,$timeout){
  var row = 0;
  var col = 0;
  var player = 0;

  var defer = $q.defer();

  var list = new Array();

  var b = 0;

  var timer = $timeout( function refresh(){
    $http.get('./test.json').success(function(response){
      //console.log(response);
      $scope.mydata = response;
      //console.log($scope.mydata);

      var test = response[0].tableau;
      //console.log(test);
      for(tes of test){
        //console.log(tes);
        row = tes.ligne;
        col = tes.colonne;
        player = tes.case;
        list[b] = [row,col,player];
        b++;
        //console.log(list);
        //console.log(list.length);
      }
      defer.resolve();
    });



  defer.promise.then(function success(){
    console.log("load board");

    var view = {
      board:[], //Plateau

      n:19, //Lignes
      m:19, //Colonnes

      game_status : 0, //Statut de la partie, 0 en cours, -1 match nul, 1 joueur 1 gagne, 2 joueur 2 gagne
      coups : 0, //Nombre de coups joués

      init:function(parent, lignes, colonnes){
        //Création du plateau
        if(lignes) this.n = lignes;
        if(colonnes) this.m = colonnes;

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
        this.set(row,col,player);
      },

      set: function(coups) {
        if(player != 0){
          var n = list.length;
          var tab;
          var c = 0;
          var p = 0;

          for(var i=0; i<n; i++){
            tab = list[i];
            r=tab[0];
            c=tab[1];
            p=tab[2];
            //console.log(r,c,p);
            if(p==0){
              this.board[r][c];
            }
            else{
              this.board[r][c].className = 'joueur' + p;
            }
          }
          // this.board[r][c].className = 'joueur' + p;
          // // On compte le coup
          // this.coups++;
        }
      }
    }
    view.init(document.querySelector('#board'));
  });
  timer = $timeout(refresh, 500);
  }, 500);
});
