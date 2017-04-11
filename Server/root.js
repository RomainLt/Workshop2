var express = require('express'),
    router = express.Router(),
    Board = require('./board.js'),
    Players = require('./players.js');

var boardClass;
var playerClass;
var playerTurn;
var nameTeam = '1404bres';

// Test
boardClass = new Board();
playerClass = new Players();
var player1 = playerClass.setPlayer("Jean");
var player2 = playerClass.setPlayer("Pierre");
console.log(playerClass.getPlayer1());
console.log(playerClass.getPlayer2());

// Se connecter avec un nom de joueur
router.get('/connect/:joueurName', function (req, res) {
    console.log('GET /connect/:groupName');
    var playerName = req.params.joueurName;
    var json = {};
    // Initialiser le board
    if (boardClass === undefined) {
        boardClass = new Board();
        var board = boardClass.getBoard();
        console.log(board);
    }
    // Initialiser les joueurs
    if (playerClass === undefined) {
        playerClass = new Players();
    }
    var player = playerClass.setPlayer(playerName);

    console.log(playerClass.getPlayer1());
    console.log(playerClass.getPlayer2());

    if (player != undefined) {
        var json = {
            idJoueur: player.idPlayer,
            code: 200,
            nomJoueur: playerName,
            numJoueur: player.numPlayer
        };
    } else {
        var json.errorAccess = "Non autorise ou la partie est deja en cours";
    }

    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(JSON.stringify(json));
});

// Jouer avec les coordonnées et le nom du joueur
router.get('/play/:x/:y/:idJoueur', function (req, res) {
    var x = req.params.x;
    var y = req.params.y;
    var playerId = req.params.idJoueur;
    var html = '<p>x: ' + x + ', y:' + y + ', idJoueur:' + playerId + '</p>';
    var json = {};

    try {
        var player = playerClass.findPlayer(playerId);
    } catch (e) {
        json.errorPlayer = "Pas de joueur avec l'ID demande";
    }

    try {
        var havePlayed = boardClass.play(x, y, player.numPlayer + 1);
        if (!havePlayed) {
            json.errorLocation = "Il y a deja un pion présent sur ces coordonnees !";
        }else{
            boardClass.setPlayerTurn();
        }
        var board = boardClass.getBoard();
        console.log(board);
    } catch (e) {
        json.errorBoard = "Le board n'est pas initialise ! ";
    }
    
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(JSON.stringify(json));
});

// Vérifier à qui le tour de jouer demandé par le client
router.get('/turn/:idJoueur', function (req, res) {
    var playerId = req.params.idJoueur; 
    var player = playerClass.findPlayer(playerId);
    var json = {};
    
    if(boardClass.getPlayerTurn === player.numPlayer){
        res.writeHead(1, {
            'Content-Type': 'text/html'
        });
    }else{
        res.writeHead(0, {
            'Content-Type': 'text/html'
        });
    }
    
    res.end(JSON.stringify(json));
});

module.exports = router;