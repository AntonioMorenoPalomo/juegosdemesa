
var CHECKERS = CHECKERS || {};

CHECKERS.board = new Board(7,7);

function load() {
	var match = FIREBASE.findCheckersMatch(key);
	
	// Recuperamos la partida si ya esta empezada
	loadBoard(match.posiciones);

	$(window).on("resize", repaintBoard);
}

/**
 * Reinicia los valores originales del tablero, hay que indicar los limi
 */
function resetBoard() {
	for (var h = 0; h < 8; h++) {
		for (var v = 0; v < 8; v++) {
			var square = new Square(h, h+1, v, v+1);
			var piece = (h < 3) ? Piece.getWhitePiece() : 
						(h > 4) ? Piece.getBlackPiece() : 
						undefined;

			CHECKERS.board.setSquare(square, h, v + (v % 2), piece);
		}
	}
}

/**
 * Carga la partida dada la lista de posiciones de todas las casillas
 */
function loadBoard(posiciones) {
	// Reiniciamos el tablero (y posiciones)
	resetBoard(); 

	for (var i = 0; i < posiciones.length; i++) {
		CHECKERS.board.setSquare(posiciones[i][0], posiciones[i][1], posiciones[i][2]);
	}
}

/**
 * Posiciona un elemento HTML en el tablero en la posición indicada por parámetro.
 * @param {HTMLElement} checker Elemento a posicionar en el tablero.
 * @param {String} horizontal Posición horizontal [A-H].
 * @param {String} vertical Posición vertical [1-8].
 */
function setPosition(checker, horizontal, vertical) {
	CHECKERS.board.setSquare(horizontal, vertical, checker);
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