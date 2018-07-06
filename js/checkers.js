
var CHECKERS = CHECKERS || {};

CHECKERS.board = new Board(7,7);
CHECKERS.key = undefined;
CHECKERS.play1 = undefined;
CHECKERS.play2 = undefined;
CHECKERS.turn = "white";

$(document).ready(function() {  
	
	var search = window.location.search;
	// Si la partida existe, la cargamos, si no existe, la creamos
	if (search && search.indexOf("key=") >= 0) {
		CHECKERS.key = search.substring(search.indexOf("key=") + 4);
	
	    if (key.indexOf("&") >= 0) {
	    	CHECKERS.key = CHECKERS.key.substring(0, key.indexOf("&"));
	    }
	    
	    FIREBASE.findMatchCheckers(key).then(function(data) {
			if (data){
				CHECKERS.play1 = data[0];
				CHECKERS.play2 = data[1];
				CHECKERS.turn = data[2];
				loadBoard(data[3]);	 // TODO: Hay que cambiarlo por data.key
			}
	    });  
	} else {
		initBoard();
		
		var match = {
            jugadorA: firebase.auth().currentUser.displayName,
            jugadorB: "",
            turno: "white",
            posiciones: getPositionsBoard()
	    };
		FIREBASE.insertMatchCheckers(match);
	}
	
	// OnChanges
	FIREBASE.table.games.checkers.store.child(CHECKERS.key).on("value", function(snapshot) {
    	loadBoard(posiciones);
        repaintBoard();
    });
	
	repaintBoard();
});

$(window).on("resize", repaintBoard);

/**
 * Reinicia los valores originales del tablero indicando las dimenciones de los Square
 */
function initBoard() {
	for (var h = 0; h < 8; h++) {
		for (var v = 0; v < 8; v++) {
			var piece = (h < 3) ? Piece.getWhitePiece() : 
						(h > 4) ? Piece.getBlackPiece() : 
						undefined;
			// TODO Hay que definir bien donde comienza y donde terminan los square
			var square = new Square(h, h+1, v, v+1, piece, undefined); 				
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

/**
 * Repintado del tablero
 */
function repaintBoard() {
	for (var h = 0; h < 8; h++) {
		for (var v = 0; v < 8; v++) {
			if (CHECKERS.board[h][v].getPiece()){
				setPosition(CHECKERS.board[h][v].getPiece(), h, v);
			}
		}
	} 
}

/**
 * Coloca una pieza visualmente en la posicion indicada
 */
function setPosition(piece, h, v) {
	// TODO 
}

/**
 * Devuelve un array con todas las posiciones actuales del board
 */
function getPositionsBoard() {
	var positions = new Array();
	for (var hor = 0; hor < 8; hor++) {
		for (var ver = 0; ver < 8; ver++) {
			var item = {
				h: hor,
				v: ver,
				c: CHECKERS.board.getPiece(hor,ver)
			}
		
			positions.push(item);
		}
	}
	return positions;
}

/**
 * Salta turno al siguiente player
 */
function nextTurn() {
	CHECKERS.turn =  (CHECKERS.turn == "red") ? "white" : "red";
}

