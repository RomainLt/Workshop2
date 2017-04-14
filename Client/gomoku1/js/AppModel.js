;
'use strict';

var AppModel = function() {
    this.m; // Номер ячейки по горизонтали (номер столбца)
    this.n; // Номер ячейки по вертикали (номер строки)
    this.size = 19; // Размер поля (15х15 ячеек) (19*19)
    this.who; // Логическая переменная - кто сейчас ходит: true - X, false - O celui qui va jouer true-pour jouer et 0- pour ne pas jouer
    this.matrix; // Матрица игрового поля 15х15. 0 - свободная клетка, 1 - крестик, 2 - нолик le board de jeu
    this.freeCells; // Количество свободных ячеек. В начале каждой игры = 225 , le nombre de cellule libre au debut du jeu 19x19= 361
    this.hashStep; // Хеш-массив потенциальных ходов
    this.playing; // True - игра в процессе игры (пользователь может кликать на поле и т.д.) true pour dire que l'utilisateur peut cliquer
    this.winLine; // Координаты победной линии coordonne de la ligne gagnante
    this.prePattern = [ // Шаблоны построения фигрур и их веса. Х в дальнейшем заменяется на крестик (1) или нолик (0), 0 - свободная ячейка
        //{s: 'x00x', w: 100000} , // Modèles et leur figure la construction du poids. X ultérieurement remplacé par un croix (1) ou de l'orteil (0) 0 - cellule libre
        { s: 'xxxxx', w: 99999 }, // пять в ряд (финальная выигрышная линия) cinq dans une range c'est a dire ligne de gain final
        { s: '0xxxx0', w: 7000 }, // Открытая четверка ouvert quatre
        { s: '0xxxx', w: 4000 }, // Закрытая четверка verrouiller quatre
        { s: 'xxxx0', w: 4000 },
        { s: '0x0xxx', w: 2000 },
        { s: '0xx0xx', w: 2000 },
        { s: '0xxx0x', w: 2000 },
        { s: 'xxx0x0', w: 2000 },
        { s: 'xx0xx0', w: 2000 },
        { s: 'x0xxx0', w: 2000 },
        { s: '0xxx0', w: 3000 },
        { s: '0xxx', w: 1500 },
        { s: 'xxx0', w: 1500 },
        { s: '0xx0x', w: 800 },
        { s: '0x0xx', w: 800 },
        { s: 'xx0x0', w: 800 },
        { s: 'x0xx0', w: 800 },
        { s: '0xx0', w: 200 }
        //{s: 'x00x', w: 100000}

    ];
    this.pattern = [
        [],
        [],
        []
    ]; // Массив шаблонов для Х и 0, генерируется из предыдущих шаблонов le tableau est generer a partir du model precedent
    this.patternWin = [0, /(1){5}/, /(2){5}/, /[01]*7[01]*/, /[02]*7[02]*/]; // Массив выигрышных шаблонов [1] и [2] и шаблон определения возможности поставить 5 в ряд c'est de exemple de model gagnant qui essaye voir si on doit mettre 5 pions sur une range
    this.directions = []; // Направления расчета потенциальных ходов la direction ou le calcul se deplace potentielement
    this.step = 0; // Счетчик ходов игры jeu contre le mouvement

    this.init = function() {
        console.log("init");
        var s;
        var a;
        var l;
        var target = 'x';
        var pos;
        for (var i in this.prePattern) // Заполнение массива шаблонов построений фигур для крестиков (1) и ноликов (2) Remplissage d'un tableau de modèles pour construire des formes de croix (1) et de zéros (2)
        {
            s = this.prePattern[i].s;
            pos = -1;
            a = [];
            while ((pos = s.indexOf(target, pos + 1)) !== -1) {
                a[a.length] = s.substr(0, pos) + '7' + s.substr(pos + 1);
            }
            s = a.join('|');

            l = this.pattern[0].length;
            this.pattern[0][l] = this.prePattern[i].w; // Веса шаблонов  model de poid
            this.pattern[1][l] = new RegExp(s.replace(/x/g, '1')); // Шаблоны для Х, например 01110 - открытая четверка Modèles pour X, par exemple 01110 - Foursome extérieur
            this.pattern[2][l] = new RegExp(s.replace(/x/g, '2')); // Аналогично для 0 - 022220 de meme pour 0

        }
        for (var n = -2; n <= 2; n++) // Заполнение массива потенциальных ходов (в радиусе 2 клеток) remplissage d'un reseau de mouvement potentiel dans un rayon de 2 cellule
        { // et la mise en poid minimum (utiliser pour calculer le oremier coups jusqu'a ce qu'il existe des models)
            // и установка минимальных весов (используются для расчета первых ходов, пока не появятся шаблоны)
            for (var m = -2; m <= 2; m++) {
                if (n === 0 && m === 0)
                    continue;
                if (Math.abs(n) <= 1 && Math.abs(m) <= 1)
                    this.directions.push({ n: n, m: m, w: 3 });
                else if (Math.abs(n) === Math.abs(m) || n * m === 0)
                    this.directions.push({ n: n, m: m, w: 2 });
                else
                    this.directions.push({ n: n, m: m, w: 1 });
            }
        }
    };

    this.setStartData = function(a, tab) { // Начальные установки для каждой новой игры les reglages initiaux pour chaques nouveaux jeux
        console.log("setStartData");

        this.who = true;
        this.hashStep = { 9: { 9: { sum: 0, attack: 1, defence: 0, attackPattern: 0, defencePattern: 0 } } }; // первый шаг, если АИ играет за Х le premier pion jouer par l'intelligence artificiel
        this.matrix = tab
        this.winLine = [];
        this.freeCells = this.size * this.size; // le nombre de cellule libre
        this.step = 0;
        this.playing = true;
    };


    this.setNM = function(a) { // Установка координат текущего хода defini les coordonnées en temps de jeu
        console.log("setNM");
        this.n = a.n;
        this.m = a.m;
    };

    this.emptyCell = function() { // Проверка ячейки на доступность для хода verification des cellules
        console.log("emptyCell");
        if (this.matrix[this.n][this.m] === 0) {
            return true;
        } else {
            return false;
        }
    };

    this.moveUser = function() { // Ход пользователя mouvement de lutilisateur
        console.log("moveUser");
        this.playing = false; // Запрещаем кликать, пока идет расчет
        return this.move(this.n, this.m, false);
    };

    this.moveAI = function(tab) { // La progression de l'intelligence artificielle
        this.matrix = tab;

        console.log("MoveAI");
        console.log(this.matrix);

        this.playing = false;
        var n, m;
        var max = 0;
        this.calculateHashMovePattern(); // Расчет весов по заданным шаблонам ходов calcul le prochain mouvement du model de coup
        for (n in this.hashStep) // Поиск веса лучшего хода recherche la meilleur coordonne ou les meilleurs coordonnees
            for (m in this.hashStep[n])
            if (this.hashStep[n][m].sum > max)
                max = this.hashStep[n][m].sum;
        var goodmoves = [];
        for (n in this.hashStep) // Поиск лучших ходов (если их несколько) fait le tri du meilleur coordonne parmis les precedents
            for (m in this.hashStep[n])
            if (this.hashStep[n][m].sum === max) {
                goodmoves[goodmoves.length] = { n: parseInt(n), m: parseInt(m) };
            }
        var movenow = goodmoves[getRandomInt(0, goodmoves.length - 1)]; // Выбор хода случайным образом, если несколько ходов на выбор fait le choix au hasard, si il ya quelque mouvement au choix
        this.n = movenow.n;
        this.m = movenow.m;

        // if (this.emptyCell() === false) {
        //     goodmoves[getRandomInt(2, goodmoves.length - 1)]; // Выбор хода случайным образом, если несколько ходов на выбор fait le choix au hasard, si il ya quelque mouvement au choix
        //     this.n = movenow.n;
        //     this.m = movenow.m;

        // }

        console.log("MoveAI | n : " + this.n, "m : " + this.m);
        return this.move(this.n, this.m, true);
    };

    this.move = function(n, m, aiStep) { // Ход (АИ или пользователя) ecraser IA ou l'utilisateur
        console.log("Move");
        if (this.hashStep[n] && this.hashStep[n][m])
            delete this.hashStep[n][m]; // Если поле хода было в массиве потенциальных ходов, то поле удаляется из него Si le champ a eu des progrès dans l'ensemble des mouvements potentiels, le champ est retiré de celui-ci
        this.matrix[n][m] = 2 - this.who; // Сохранение хода в матрице полей игры Enregistrement des progrès dans la matrice du champ de jeu
        this.who = !this.who; // Переход хода от Х к О, от О к Х la transition du x a se deplacer de 0 à X
        this.freeCells--;
        var t = this.matrix[this.n][this.m]; // Далее идет проверка на выигрыш в результате этого хода: поиск 5 в ряд по 4 направлениям | — / \ A l'arrivée la victoire à la suite de ce mouvement: la recherche de 5 dans une série de 4 lignes |
        var s = ['', '', '', ''];
        var nT = Math.min(this.n, 4);
        var nR = Math.min(this.size - this.m - 1, 4);
        var nB = Math.min(this.size - this.n - 1, 4);
        var nL = Math.min(this.m, 4);
        for (var j = this.n - nT; j <= this.n + nB; j++)
            s[0] += this.matrix[j][this.m];
        for (var i = this.m - nL; i <= this.m + nR; i++)
            s[1] += this.matrix[this.n][i];
        for (var i = -Math.min(nT, nL); i <= Math.min(nR, nB); i++)
            s[2] += this.matrix[this.n + i][this.m + i];
        for (var i = -Math.min(nB, nL); i <= Math.min(nR, nT); i++)
            s[3] += this.matrix[this.n - i][this.m + i];
        var k;
        if ((k = s[0].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m, this.n - nT + k, this.m, this.n - nT + k + 4];
        else if ((k = s[1].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m - nL + k, this.n, this.m - nL + k + 4, this.n];
        else if ((k = s[2].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m - Math.min(nT, nL) + k, this.n - Math.min(nT, nL) + k, this.m - Math.min(nT, nL) + k + 4, this.n - Math.min(nT, nL) + k + 4];
        else if ((k = s[3].search(this.patternWin[t])) >= 0)
            this.winLine = [this.m - Math.min(nB, nL) + k, this.n + Math.min(nB, nL) - k, this.m - Math.min(nB, nL) + k + 4, this.n + Math.min(nB, nL) - k - 4, -1];
        this.playing = (this.freeCells !== 0 && this.winLine.length === 0); // Проверка на окончание игры (победа или нет свободных ячеек) Vérification de la fin du jeu (gagner ou pas de cellules libres)

        if (this.playing)
            this.calculateHashMove(aiStep); // Рассчитываем веса потенциальных ходов (без шаблонов) Nous prévoyons que le poids des mouvements potentiels (sans modèles)
        console.log('Move | n : ' + n + ', m : ' + m);
        return { n: n, m: m };
    };

    this.calculateHashMove = function(attack) { // Расчет весов потенциальных ходов (без шаблонов), просто по количеству Х и О рядом (акуально в начале игры) Le calcul de la balance des mouvements potentiels (sans modèles) simplement par le nombre de séries X et O (akualno au début du jeu)
        console.log("calculateHashMove");
        for (var key in this.directions) {
            var n = this.n + this.directions[key].n;
            var m = this.m + this.directions[key].m;
            if (n < 0 || m < 0 || n >= this.size || m >= this.size)
                continue;
            if (this.matrix[n][m] !== 0)
                continue;
            if (!(n in this.hashStep))
                this.hashStep[n] = {};
            if (!(m in this.hashStep[n]))
                this.hashStep[n][m] = { sum: 0, attack: 0, defence: 0, attackPattern: 0, defencePattern: 0 };
            if (attack)
                this.hashStep[n][m].attack += this.directions[key].w;
            else
                this.hashStep[n][m].defence += this.directions[key].w;
        }
    };

    this.calculateHashMovePattern = function() { // Расчет весов потенциальных ходов по заданным шаблонам la partie strategie
        console.log("calculateHashMovePattern");
        console.log("Who : " + this.who);
        var s;
        var k = 0;
        var attack = 2 - this.who;
        var defence = 2 - !this.who;
        var res;
        for (n in this.hashStep) {
            for (m in this.hashStep[n]) // A travers tous les mouvements potentiels (* 1)
            {
                this.hashStep[n][m].sum = this.hashStep[n][m].attack + this.hashStep[n][m].defence;
                this.hashStep[n][m].attackPattern = 0; // Mettre à zéro la valeur du motif d'attaque
                this.hashStep[n][m].defencePattern = 0; // La valeur du model de defense mise à zéro
                n = parseInt(n);
                m = parseInt(m);
                for (var q = 1; q <= 2; q++) //  la premiere boucle compte le poid de l'attaque et la deuxieme celui de la defense
                    for (var j = 1; j <= 4; j++) {
                    s = '';
                    for (var i = -4; i <= 4; i++) // Cycle de mélange dans un rayon de  4 cellules à partir du coup joué
                        switch (j) { // Création de lignes avec l'état de la cellule actuelle dans 4 directions, ce type 000172222
                        case 1: //
                            if (n + i >= 0 && n + i < this.size)
                                s += (i === 0) ? '7' : this.matrix[n + i][m];
                            break;
                        case 2:
                            if (m + i >= 0 && m + i < this.size)
                                s += (i === 0) ? '7' : this.matrix[n][m + i];
                            break;
                        case 3:
                            if (n + i >= 0 && n + i < this.size)
                                if (m + i >= 0 && m + i < this.size)
                                    s += (i === 0) ? '7' : this.matrix[n + i][m + i];
                            break;
                        case 4:
                            if (n - i >= 0 && n - i < this.size)
                                if (m + i >= 0 && m + i < this.size)
                                    s += (i === 0) ? '7' : this.matrix[n - i][m + i];
                            break;
                    }

                    res = (q === 1) ? this.patternWin[2 + attack].exec(s) : this.patternWin[2 + defence].exec(s);
                    if (res === null)
                        continue;
                    if (res[0].length < 5) // Если длина возможной линии <5, то построить 5 не удастся в принципе и расчет можно не производить
                        continue; // например, при восходящей диагонали для ячейки (0, 0) или (0, 1) или если с 2х сторон зажал соперник
                    if (q === 1) // для крестиков, если играем крестиками и наоборот. Формируем вес атаки на этом поле
                        for (var i in this.pattern[attack]) { // перебор по всем шаблонам
                        if (this.pattern[attack][i].test(s)) // если нашли соответствие
                            this.hashStep[n][m].attackPattern += this.pattern[0][i]; // увеличиваем значимость клетки на вес шаблона
                    }
                    else // для ноликов если играем крестиками
                        for (var i in this.pattern[defence])
                        if (this.pattern[defence][i].test(s))
                            this.hashStep[n][m].defencePattern += this.pattern[0][i];
                }
                this.hashStep[n][m].sum += 1.1 * this.hashStep[n][m].attackPattern + this.hashStep[n][m].defencePattern; // Атака на 10% важнее защиты
                k++;
            }
        }
    };

    this.init();
};