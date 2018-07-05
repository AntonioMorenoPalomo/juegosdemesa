
var CHECKERS = CHECKERS || {};

CHECKERS.board = new Board(7,7);

function load() {
	var search = window.location.search;
	if (search && search.indexOf("key=") >= 0) {
	    var key = search.substring(search.indexOf("key=") + 4);
	
	    if (key.indexOf("&") >= 0) {
	    	key = key.substring(0, key.indexOf("&"));
	    }
	    
	    FIREBASE.findMatchCheckers(key).then(function(data) {
			if (data){
				loadBoard(data[2]);	 // TODO: Hay que cambiarlo por data.key
			}
			$(window).on("resize", repaintBoard);
	    });
	} else {
		initBoard();
	}
}

/**
 * Reinicia los valores originales del tablero, hay que indicar los limi
 */
function initBoard() {
	for (var h = 0; h < 8; h++) {
		for (var v = 0; v < 8; v++) {
			var piece = (h < 3) ? Piece.getWhitePiece() : 
						(h > 4) ? Piece.getBlackPiece() : 
						undefined;
			var square = new Square(h, h+1, v, v+1, piece, undefined); // TODO Hay que definir bien donde comienza y donde terminan los square				
			CHECKERS.board.setSquare(square, h, v + (v % 2));
		}
	}
}

/**
 * Carga la partida dada la lista de posiciones de todas las casillas
 */
function loadBoard(posiciones) {
	for (var i = 0; i < posiciones.length; i++) {
		CHECKERS.board.setPiece(posiciones[i].c, posiciones[i].h, posiciones[i].v);
	}
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