
var CHECKERS = CHECKERS || {};

CHECKERS.board = new Board(8,8);
CHECKERS.key = "";
CHECKERS.play1 = "";
CHECKERS.play2 = "";
CHECKERS.turn = "white";

$(document).ready(function() {  
	
	var search = window.location.search;
	
	// Si la partida existe, la cargamos
	if (search && search.indexOf("key=") >= 0) {
		CHECKERS.key = search.substring(search.indexOf("key=") + 4);
	
	    if (CHECKERS.key.indexOf("&") >= 0) {
	    	CHECKERS.key = CHECKERS.key.substring(0, CHECKERS.key.indexOf("&"));
	    }
	    
	    FIREBASE.findMatchCheckers(CHECKERS.key).then(function(data) {
			if (data){
				CHECKERS.play1 = data[0];
				CHECKERS.play2 = data[1];
				CHECKERS.turn = data[2];
				CHECKERS.key = data[3];
				loadBoard(CHECKERS.key);
			}
	    });  
	} else {
		// La partida es nueva, la creamos
		initBoard();
		
		CHECKERS.play1 = "Prueba"; //firebase.auth().currentUser.displayName,
		
		var match = {
            jugadorA: CHECKERS.play1,
            jugadorB: "",
            turno: "white",
            posiciones: getPositionsBoard()
	    };
		CHECKERS.key = FIREBASE.insertMatchCheckers(match);
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
			if ((((h % 2) == 0 ) && ((v % 2) == 0)) || (((h % 2) == 1) && ((v % 2) == 1))) {
				var square = new Square(h, h+1, v, v+1, piece, undefined); 				
				CHECKERS.board.setSquare(square, h, v);	
			} 
		}
	}
}

/**
 * Carga la partida dada la lista de posiciones de todas las casillas
 */
function loadBoard(posiciones) {
	// Vaciamos tablero
	for (var h = 0; h < 8; h++) {
		for (var v = 0; v < 8; v++) {
			CHECKERS.board.board[hor][ver].piece = undefined;
		}
	}
	
	// Cargamos piezas nuevas
	for (var i = 0; i < posiciones.length; i++) {
		CHECKERS.board.board[posiciones[i].h][posiciones[i].v].piece = posiciones[i].p;
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
			if ((CHECKERS.board.board[hor][ver]) && (CHECKERS.board.board[hor][ver].piece)){
				var item = {
					h: hor,
					v: ver,
					p: CHECKERS.board.board[hor][ver].piece
				}
			
				positions.push(item);
			}
		}
	}
	return positions;
}

/**
 * Salta turno al siguiente player
 */
function nextTurn() {
	CHECKERS.turn =  (CHECKERS.turn == "black") ? "white" : "black";
}

