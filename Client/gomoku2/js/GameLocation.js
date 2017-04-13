;
'use strict';

var GameLocation = function() {
    this.m; // Номер ячейки по горизонтали (номер столбца) nombre de cellule horizontale (numero de colonne)
    this.n; // Номер ячейки по вертикали (номер строки) nombre de cellule verticale (numero de ligne)
    this.size = 19; // Размер поля (15х15 ячеек) nombre de grille 15 X 15 j'ai un 19x19
    this.matrix; // Матрица игрового поля 15х15. 0 - свободная клетка, 1 - крестик, 2 - нолик tableau de 15X15 
    this.potentialMove; // Хеш-массив потенциальных ходов  les mouvements potentiel possible
    this.oldN; // Номер ячейки по горизонтали (номер столбца) nombre de cellule horizontale ou numeros de colonne 
    this.oldM; // Номер ячейки по вертикали (номер строки) nombre de cellule verticale ou numeros de ligne
    this.oldPotentialMove; // ancien mouvement potentiel
    this.goodMoves; // le meilleur mouvement
    this.pattern; // le model

    this.init = function(pattern) {
        this.pattern = pattern;
    }; // la fonction d'initialisation du model

    this.start = function() { // Начальные установки для каждой новой игры les reglages initiaux pour chaque nouvelles parties
        console.log("1");
        $http.get('http://workshop2.cleverapps.io/turn/1').success(function(response) {
            $scope.mydata = response;
            // console.log(response);
            list = response.tableau;
            console.log(list);
        });

        this.matrix = list; // le tableau 
        this.potentialMove = {};
        for (var n = 0; n < this.size; n++) {
            this.matrix[n] = [];
            for (var m = 0; m < this.size; m++)
                this.matrix[n][m] = 0;
        }
        this.oldN = -1;
        this.oldM = -1;
    };

    this.setFirstPotentialMove = function() {
        this.potentialMove = { 9: { 9: { sum: 0, attack: 0, defence: 0 } } };
    }; // le choix du premier mouvement potentiel si j'implemente pour 19x19 il me faut prendre 9

    this.setNM = function(a) { // Установка координат текущего хода (в номерах ячеек) c'est a dire definir les coordonnees du jeux courant
        this.n = a[0];
        this.m = a[1];
    };

    this.emptyCell = function(a, b) { // Проверка ячейки на доступность для хода fonction pour verifier la disponibilité du cadre
        var n = a || this.n;
        var m = b || this.m;
        return this.matrix[n][m] === 0;
    };

    this.getGoodMoves = function() { // obtenir les meilleur mouvements
        var hs = this.potentialMove; //le mouvement potentiel
        var max = 0;
        var n, m;
        var goodMoves = [];
        for (n in hs) // Поиск веса лучшего хода  
            for (m in hs[n])
            if (hs[n][m].sum > max)
                max = hs[n][m].sum;
        max = 0.9 * max; // Берем не только самый лучший ход, а несколько из лучших (в пределах 10% по значению важности) il faut non seulement le meilleur mouvement, et quelques-uns des meilleurs (à moins de 10% de la valeur d'importance)
        for (n in hs)
            for (m in hs[n])
                if (hs[n][m].sum >= max)
                    goodMoves[goodMoves.length] = [parseInt(n), parseInt(m)];
        this.goodMoves = goodMoves;
        return goodMoves;
    };

    this.getRandomGoodMove = function() { // obtention d'un bon mouvement aleatoire 
        var goodMoves = this.getGoodMoves();
        return goodMoves[getRandomInt(0, goodMoves.length - 1)]; // Выбор хода случайным образом из лучших le choix se fait aux hasard
    };

    this.saveMove = function(n, m, xo) {
        this.matrix[n][m] = xo;
    };

    this.updatePotentialMove = function(n, m) {
        var hs = this.potentialMove;
        if (hs[n] && hs[n][m])
            delete hs[n][m]; // Если поле хода было в массиве потенциальных ходов, то поле удаляется из него
        var nd, md;
        for (var i = -2; i <= 2; i++)
            for (var j = -2; j <= 2; j++) {
                nd = i + n;
                md = j + m;
                if (nd < 0 || md < 0 || nd >= this.size || md >= this.size)
                    continue;
                if (this.matrix[nd][md] !== 0)
                    continue;
                if (!(nd in hs))
                    hs[nd] = {};
                if (!(md in hs[nd]))
                    hs[nd][md] = { sum: 0, attack: 0, defence: 0 };
            }
        this.potentialMove = hs;
    };

    this.getOneSymbol = function(i, n, m, test) {
        if (n >= 0 && m >= 0 && n < this.size && m < this.size)
            return (test && i === 0) ? '9' : this.matrix[n][m];
    };

    this.getLine = function(j, n, m, test) {
        var s;
        for (var i = -4; i <= 4; i++) // Цикл перебора на расстоянии +/- 4 клеток от рассматриваемой
            if (j === 1)
                s += this.getOneSymbol(i, n + i, m, test);
            else if (j === 2)
            s += this.getOneSymbol(i, n, m + i, test);
        else if (j === 3)
            s += this.getOneSymbol(i, n + i, m + i, test);
        else
            s += this.getOneSymbol(i, n - i, m + i, test);
    };

    this.getAllLines = function(n, m, a) { // Получение 4 линий:  | — \ /
        var test = a || false;
        var lines = [];
        for (var j = 1; j <= 4; j++)
            lines[lines.lenght] = getLine(j, n, m, test);
        return lines;
    };

    this.getLines = function(n, m, a) { // Получение 4 линий:  | — \ /  -- оптимизированный аналог getAllLines
        var test = a || false;
        var nT = Math.min(n, 4);
        var nR = Math.min(this.size - m - 1, 4);
        var nB = Math.min(this.size - n - 1, 4);
        var nL = Math.min(m, 4);
        var lines = ['', '', '', '']; //[['', 1, n - nT, m], ['', 1, n, m - nL], ['', 3, n - Math.min(nT, nL), m - Math.min(nT, nL)], ['', 4, n + Math.min(nB, nL), m - Math.min(nB, nL)]];

        for (var j = n - nT; j <= n + nB; j++)
            lines[0] += (test && j === n) ? '9' : this.matrix[j][m];
        for (var i = m - nL; i <= m + nR; i++)
            lines[1] += (test && i === m) ? '9' : this.matrix[n][i];
        for (var i = -Math.min(nT, nL); i <= Math.min(nR, nB); i++)
            lines[2] += (test && i === 0) ? '9' : this.matrix[n + i][m + i];
        for (var i = -Math.min(nB, nL); i <= Math.min(nR, nT); i++)
            lines[3] += (test && i === 0) ? '9' : this.matrix[n - i][m + i];
        return lines;
    };

    this.calculatePotentialMovePattern = function(xAI) { // Расчет весов потенциальных ходов по заданным шаблонам calcul des meilleur mouvement possible selon un model predeterminé
        var hs = this.potentialMove;
        var s;
        var weight1;
        var weight2;
        var lines;
        for (n in hs)
            for (m in hs[n]) { // Перебор всех потенциальных ходов A travers tout les mouvement possible
                weight1 = 0;
                weight2 = 0;
                lines = this.getLines(parseInt(n), parseInt(m), true);
                for (var i in lines) {
                    s = lines[i];
                    if (s === this.pattern.emptyPatern)
                        continue;
                    if (this.pattern.isPossibleLine(1, s))
                        weight1 += this.pattern.getWeightPattern(1, s);
                    if (this.pattern.isPossibleLine(2, s))
                        weight2 += this.pattern.getWeightPattern(2, s);
                }
                if (xAI) { // если AI играет за X la condition si l'IA joue pour X
                    hs[n][m].attack = weight1;
                    hs[n][m].defence = weight2;
                } else {
                    hs[n][m].attack = weight2;
                    hs[n][m].defence = weight1;
                }
                //if (hs[n][m].defence < 20)
                //    hs[n][m].defence = 0;
                hs[n][m].sum = hs[n][m].attack + hs[n][m].defence; // Атака предпочтительнее дефа 
            }
        this.potentialMove = hs; //injection du meilleur mouvent dans hs et on refait la boucle
    };
};