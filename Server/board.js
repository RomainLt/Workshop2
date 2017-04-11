var Board = function () {
    this.board = [];
    this.numTurn = 0;
    this.nbTenaillesJ1 = 0;
    this.nbTenaillesJ2 = 0;
    this.nbPieceJ1 = 30;
    this.nbPieceJ2 = 30;
    this.gameOver = false;
    this.detailGameOver = {};
    this.lastStepx = -1;
    this.lastStepY = -1;
    this.prolongation = false;
    this.playerTurn = playerTurn = (Math.floor(Math.random() * 2) + 1);
    this.init();
}
// Initiliser l'instance
Board.prototype.init = function () {
    var number = 18;
    var newBoard = [];
    for (var i = 0; i < number; i++) {
        newBoard[i] = [];
        for (var j = 0; j < number; j++) {
            newBoard[i][j] = 0;
        }
    }
    this.board = newBoard;
}
// Retourner le plateau de jeu
Board.prototype.getBoard = function(){
    return this.board;
}
// Jouer sur une case
Board.prototype.play = function(x, y, idJoueur){
    var bool = false;
    // Ne pas modifier la case si elle n'est pas vide
    if(this.board[x][y] === 0){
        this.board[x][y] = idJoueur;
        bool = true;
    }
    return bool;
}
// Retourner le numero du joueur qui doit jouer
Board.prototype.getPlayerTurn = function(){
    return this.playerTurn;
}
// Changer le tour du joueur qui doit jouer
Board.prototype.setPlayerTurn = function(){
    if(this.playerTurn === 0){
        this.playerTurn = 1;
    }else{
        this.playerTurn = 0;
    }
}

module.exports = Board;