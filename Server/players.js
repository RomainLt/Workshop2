var Players = function () {
    this.player1 = {};
    this.player2 = {};
    this.init();
}
// Initialiser l'instance
Players.prototype.init = function () {
    var id1 = uuid();
    var id2 = uuid();
    this.player1 = {
        idPlayer: id1,
        numPlayer: 0,
        namePlayer: null
    };
    this.player2 = {
        idPlayer: id2,
        numPlayer: 1,
        namePlayer: null
    }
}
// Créer un joueur
// Max de joueur 2
Players.prototype.setPlayer = function (namePlayer) {
    if(this.player1.namePlayer === null){
        this.player1.namePlayer = namePlayer;
        return this.player1;
    }else if(this.player2.namePlayer === null){
        this.player2.namePlayer = namePlayer;
        return this.player2;
    }else{
        console.log("Deux joueurs déjà connecté !");
    }
}
// Retourner le joueur 1
Players.prototype.getPlayer1 = function () {
    return this.player1;
}
// Retourner le joueur 2
Players.prototype.getPlayer2 = function () {
    return this.player2;
}
// Trouver le jouer avec l'id en paramètre
Players.prototype.findPlayer = function(idPlayer){
    if(this.player1.idPlayer === idPlayer){
        return this.player1;
    }else{
        return this.player2;
    }
}
// Générer un identifiant unique
var uuid = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

module.exports = Players;