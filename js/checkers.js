
var CHECKERS = CHECKERS || {};

CHECKERS.board = new Board(8,8);
CHECKERS.key = "";
CHECKERS.play1 = "";
CHECKERS.play2 = "";
CHECKERS.turn = "white";
CHECKERS.colorPlayer = "";
CHECKERS.selectPiece = { piece: undefined, h: 0, v: 0};

$(document).ready(function() {  
	
	// Simulo que el usuario a clickeado sobre el tablero, y hemos captado sobre que casilla ha pulsado
    $("#clickCases").on("click", function() {
    	var horizontal = $("#horizontal").value();
    	var vertical = $("#vertical").value();
    	clickBoard(horizontal, vertical);
    });
    		
    
	initBoard();
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
				CHECKERS.turn = data[3];
				loadBoard(data[2]);
				
				CHECKERS.colorPlayer = (CHECKERS.play1 == firebase.auth().currentUser.displayName) ? "white" : "black";
			}
	    });  
	} else {
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
			if ((CHECKERS.board.board[v][h]) && (CHECKERS.board.board[v][h].piece)){
				CHECKERS.board.board[v][h].piece = undefined;	
			}
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


/*
 * El usuario ha clickeado sobre el tablero, y hemos capturado la posicion clickeada, actuamos en consecuencia
 */
function clickBoard(h,v) {	
	
	// Si no es turno de este usuario o no ha clickeado sobre una pieza, se le ignora 
	if ((CHECKERS.turn == CHECKERS.colorPlayer) && (CHECKERS.board.board[h][v]) && (CHECKERS.board.board[h][v].piece)) {
		
		// Miramos si la pieza es suya, candidata, o del contrario
		var color = CHECKERS.board.board[h][v].piece.isRed() ? "red" :
						(CHECKERS.board.board[h][v].piece.isWhite() ? "white" : "black");
		
		if (color == "red"){
			setPosition(undefined, CHECKERS.selectPiece.h, CHECKERS.selectPiece.v);
			setPosition(CHECKERS.selectPiece.piece, h, v);
			
			// TODO: Si ha habido ficha enemiga en medio, eliminarla
			// TODO: Si no hay mas movimientos, terminamos turno
			
		} else if ( color == CHECKERS.colorPlayer) {	
			CHECKERS.selectPiece.piece = CHECKERS.board.board[h][v].piece;
			CHECKERS.selectPiece.h = h;
			CHECKERS.selectPiece.v = v;
			
			// Si es reina se hara unas acciones, y si es normal otras
			if (CHECKERS.board.board[h][v].piece.isKing()){
				
				// Recorrido diagonal 1: arriba-derecha
				var i = 1;
				while ((CHECKERS.selectPiece.h + i < 7) && (CHECKERS.selectPiece.v + i < 7)){
					if (CHECKERS.board.board[CHECKERS.selectPiece.h + i][CHECKERS.selectPiece.v + i].piece != undefined) {
						
						// Nos encontramos una pieza, comprobamos si es del rival y si hay posibilidad tras ella
						if (((CHECKERS.selectPiece.h + i + 1 ) < 7) &&  (CHECKERS.selectPiece.v + i + 1 ) < 7) && 
									((CHECKERS.board.board[CHECKERS.selectPiece.h + i + 1][CHECKERS.selectPiece.v + i + 1].piece.isWhite() && CHECKERS.colorPlayer=="black") 
										|| (CHECKERS.board.board[CHECKERS.selectPiece.h + i + 1][CHECKERS.selectPiece.v + i + 1].piece.isBlack() && CHECKERS.colorPlayer=="white")) 
								  && (!CHECKERS.board.board[CHECKERS.selectPiece.h + i + 2][CHECKERS.selectPiece.v + i + 2].piece) ){
							setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h + i + 2, CHECKERS.selectPiece.v + i + 2);
						}	
						
					} else {
						setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h + i, CHECKERS.selectPiece.v + i);
					}
					
					i++;
				}
				
				// Recorrido diagonal 2: abajo-derecha
				i = 1;
				while ((CHECKERS.selectPiece.h + i < 7) && (CHECKERS.selectPiece.v - i > 0)){
					if (CHECKERS.board.board[CHECKERS.selectPiece.h + i][CHECKERS.selectPiece.v - i].piece != undefined) {
						
						// Nos encontramos una pieza, comprobamos si es del rival y si hay posibilidad tras ella
						if (((CHECKERS.selectPiece.h + i + 1 ) < 7) &&  (CHECKERS.selectPiece.v - i - 1 ) > 0) && 
									((CHECKERS.board.board[CHECKERS.selectPiece.h + i + 1][CHECKERS.selectPiece.v - i - 1].piece.isWhite() && CHECKERS.colorPlayer=="black") 
										|| (CHECKERS.board.board[CHECKERS.selectPiece.h + i + 1][CHECKERS.selectPiece.v - i - 1].piece.isBlack() && CHECKERS.colorPlayer=="white")) 
								  && (!CHECKERS.board.board[CHECKERS.selectPiece.h + i + 2][CHECKERS.selectPiece.v - i - 2].piece) ){
							setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h + i + 2, CHECKERS.selectPiece.v - i - 2);
						}	
								  
					} else {
						setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h + i, CHECKERS.selectPiece.v - i);
					}
					
					i++;
				}
				
				// Recorrido diagonal 3: abajo-izquierda
				i = 1;
				while ((CHECKERS.selectPiece.h - i > 0) && (CHECKERS.selectPiece.v - i > 0)){
					if (CHECKERS.board.board[CHECKERS.selectPiece.h - i][CHECKERS.selectPiece.v - i].piece != undefined) {
						
						// Nos encontramos una pieza, comprobamos si es del rival y si hay posibilidad tras ella
						if (((CHECKERS.selectPiece.h - i - 1 ) > 0) &&  (CHECKERS.selectPiece.v - i - 1 ) > 0) && 
									((CHECKERS.board.board[CHECKERS.selectPiece.h - i - 1][CHECKERS.selectPiece.v - i - 1].piece.isWhite() && CHECKERS.colorPlayer=="black") 
										|| (CHECKERS.board.board[CHECKERS.selectPiece.h - i - 1][CHECKERS.selectPiece.v - i - 1].piece.isBlack() && CHECKERS.colorPlayer=="white")) 
								  && (!CHECKERS.board.board[CHECKERS.selectPiece.h - i - 2][CHECKERS.selectPiece.v - i - 2].piece) ){
							setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h - i - 2, CHECKERS.selectPiece.v - i - 2);
						}	
								  
					} else {
						setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h - i, CHECKERS.selectPiece.v - i);
					}
					
					i++;
				}
				
				// Recorrido diagonal 4: arriba-izquierda
				i = 1;
				while ((CHECKERS.selectPiece.h - i > 0) && (CHECKERS.selectPiece.v + i < 7)){
					if (CHECKERS.board.board[CHECKERS.selectPiece.h - i][CHECKERS.selectPiece.v + i].piece != undefined) {
						
						// Nos encontramos una pieza, comprobamos si es del rival y si hay posibilidad tras ella
						if (((CHECKERS.selectPiece.h - i - 1 ) > 0) &&  (CHECKERS.selectPiece.v + i + 1 ) < 7) && 
									((CHECKERS.board.board[CHECKERS.selectPiece.h - i - 1][CHECKERS.selectPiece.v + i + 1].piece.isWhite() && CHECKERS.colorPlayer=="black") 
										|| (CHECKERS.board.board[CHECKERS.selectPiece.h - i - 1][CHECKERS.selectPiece.v + i + 1].piece.isBlack() && CHECKERS.colorPlayer=="white")) 
								  && (!CHECKERS.board.board[CHECKERS.selectPiece.h - i - 2][CHECKERS.selectPiece.v + i + 2].piece) ){
							setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h - i - 2, CHECKERS.selectPiece.v + i + 2);
						}	
								  
					} else {
						setPosition(Piece.getRedPiece(), CHECKERS.selectPiece.h - i, CHECKERS.selectPiece.v + i);
					}
					
					i++;
				}
				
				return true;
				
			} else { 
				// Es una ficha normal, solo hay dos caminos posibles
				
				var vert1 = (CHECKERS.colorPlayer == "white") ? CHECKERS.selectPiece.v+1 : CHECKERS.selectPiece.v-1;
				var vert2 = (CHECKERS.colorPlayer == "white") ? CHECKERS.selectPiece.v+2 : CHECKERS.selectPiece.v-2;
				
				// Camino 1, a la izquierda
				if ((h>0)&&(CHECKERS.board.board[h-1][vert].piece)){  
					
					// Nos encontramos una pieza, comprobamos si es del rival y si hay posibilidad tras ella
					if ((h>1) && ((CHECKERS.board.board[h-1][vert1].piece.isWhite() && CHECKERS.colorPlayer=="black") 
									|| (CHECKERS.board.board[h-1][vert1].piece.isBlack() && CHECKERS.colorPlayer=="white")) 
							  && (!CHECKERS.board.board[h-2][vert2].piece) ){
						setPosition(Piece.getRedPiece(), h-2, vert2);
					}					
				} else {
					// Es un hueco libre, por lo que es una candidata
					setPosition(Piece.getRedPiece(), h-1, vert1);
				}
				
				// Camino 2, a la derecha
				if ((h<7)&&(CHECKERS.board.board[h+1][vert].piece)){  
					
					// Nos encontramos una pieza, comprobamos si es del rival y si hay posibilidad tras ella
					if ((h<6) && ((CHECKERS.board.board[h+1][vert1].piece.isWhite() && CHECKERS.colorPlayer=="black") 
									|| (CHECKERS.board.board[h+1][vert1].piece.isBlack() && CHECKERS.colorPlayer=="white"))
							  && (!CHECKERS.board.board[h+2][vert2].piece) ){
						setPosition(Piece.getRedPiece(), h+2, vert2);
					}					
				} else {
					// Es un hueco libre, por lo que es una candidata
					setPosition(Piece.getRedPiece(), h+1, vert1);
				}				
			}			
		}
	}
}
