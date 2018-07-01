
var CHECKERS = CHECKERS || {};

CHECKERS.board = new Board(7,7);

function load() {
    resetBoard(); // reiniciamos el tablero, asi tambien especificamos las posiciones de cada casilla
    var match = FIREBASE.findCheckersMatch(key);
    loadBoard(match.posiciones);  // Recuperamos la partida si ya esta empezada, recuperando solo donde esta cada casilla
    
    $(window).on("resize", repaintBoard);
}

// Reinicia los valores originales del tablero, hay que indicar los limi
function resetBoard() {
    for (var h = 0; h < 8; h++) {
        for (var v = 0; v < 8; v++) {
            CHECKERS.board.setBox(n, m, undefined);
        }
    }
    CHECKERS.board.setBox(0, 1, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(0, 3, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(0, 5, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(0, 7, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));

    CHECKERS.board.setBox(1, 0, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(1, 2, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(1, 4, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(1, 6, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));

    CHECKERS.board.setBox(2, 1, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(2, 3, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(2, 5, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));
    CHECKERS.board.setBox(2, 7, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "red", undefined));

    CHECKERS.board.setBox(3, 0, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));
    CHECKERS.board.setBox(3, 2, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));
    CHECKERS.board.setBox(3, 4, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));
    CHECKERS.board.setBox(3, 6, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));

    CHECKERS.board.setBox(4, 1, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));
    CHECKERS.board.setBox(4, 3, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));
    CHECKERS.board.setBox(4, 5, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));
    CHECKERS.board.setBox(4, 7, new Box(initVertical, endVertical, initHorizontal, endHorizontal, undefined, undefined));

    CHECKERS.board.setBox(5, 0, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(5, 2, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(5, 4, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(5, 6, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));

    CHECKERS.board.setBox(6, 1, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(6, 3, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(6, 5, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(6, 7, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));

    CHECKERS.board.setBox(7, 0, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(7, 2, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(7, 4, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
    CHECKERS.board.setBox(7, 6, new Box(initVertical, endVertical, initHorizontal, endHorizontal, "white", undefined));
}

// Carga la partida dadas la lista de posiciones de todas las casillas
function loadBoard(posiciones) {
    for (i = 0; i < posiciones.length; i++) {
        board.setBox(posiciones[i][0], posiciones[i][1], posiciones[i][2]);
    }
}

/**
 * Posiciona un elemento HTML en el tablero en la posición indicada por parámetro.
 * @param {HTMLElement} checker Elemento a posicionar en el tablero.
 * @param {String} horizontal Posición horizontal [A-H].
 * @param {String} vertical Posición vertical [1-8].
 */
function setPosition(checker, horizontal, vertical) {
    CHECKERS.board.setBox(horizontal, vertical, checker);
}


function repaintBoard() {
    for (var h = 0; h < 8; h++) {
        for (var v = 0; v < 8; v++) {
            if (board[h][v])
                setPosition(checker.img, h, v);
        }
    } 
}



$(document).ready(load);