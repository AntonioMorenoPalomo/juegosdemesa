
var CHECKERS = CHECKERS || {};

CHECKERS.board = [];


function load() {
    for (var h = 0; h < 8; h++) {
        for (var v = 0; v < 8; v++) {
            CHECKERS.board[h] = [];
            CHECKERS.board[h][v] = undefined;
        }
    }

    $(window).on("resize", repaintBoard);
}


/**
 * Posiciona un elemento HTML en el tablero en la posición indicada por parámetro.
 * @param {HTMLElement} checker Elemento a posicionar en el tablero.
 * @param {String} horizontal Posición horizontal [A-H].
 * @param {String} vertical Posición vertical [1-8].
 */
function setPosition(checker, horizontal, vertical) {

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