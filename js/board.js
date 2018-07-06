/**
 * Clase que representa el tablero
 */


/*
 * Tablero genérico
 * @param {Number} horizontal longitud horizontal.
 * @param {Number} vertical longitud vertical
 */
function Board(horizontal, vertical = 1) {
	this.board = [];
	this.lenghtHorizontal = horizontal;
	this.lenghtVertical = vertical;

	for (var h = 0; h < this.lenghtHorizontal; h++) {
		for (var v = 0; v < this.lenghtVertical; v++) {
			this.board[h] = [];
			this.board[h][v] = undefined;
		}
	}
}

/**
 * Dado un punto clickeado, devuelve que Square ha presionado el usuario
 * @param {Number} horizontal Posición horizontal a buscar.
 * @param {Number} vertical Posición vertical a buscar. Por defecto 1.
 * @return {Promise} Si la posicion pertenece a un Square, lo devuelve.
 */
Board.prototype.findSquare = function(ejeHorizontal, ejeVertical = 1) {
	for (var h = 0; h < this.lenghtHorizontal; h++) {
		for (var v = 0; v < this.lenghtVertical; v++) {
			if (board[h][v] && board[h][v].inSquare(ejeHorizontal, ejeVertical)) {
				return this.board[h][v];
			}
		}
	}

	return false;
}

// Getters y Setters

/**
 * Guarda un Square en la posicion indicada.
 * @param {Square} square Casilla a introducir.
 * @param {Number} horizontal Dimensión del tablero en horizontal.
 * @param {Number} vertical Dimensión del tablero en vertical. Por defecto 1.
 */
Board.prototype.setSquare = function(square, horizontal, vertical = 1){
	this.board[horizontal][vertical] = square;
}

/**
 * Guarda una Piece en la posicion indicada.
 * @param {Piece} square Casilla a introducir.
 * @param {Number} horizontal Dimensión del tablero en horizontal.
 * @param {Number} vertical Dimensión del tablero en vertical. Por defecto 1.
 */
Board.prototype.setPiece = function(piece, horizontal, vertical = 1){
	this.board[horizontal][vertical].setPiece(piece);
}

/**
 * Devuelve una Piece de la posicion indicada.
 * @param {Number} horizontal Dimensión del tablero en horizontal.
 * @param {Number} vertical Dimensión del tablero en vertical. Por defecto 1.
 */
Board.prototype.getPiece = function(horizontal, vertical = 1){
	this.board[horizontal][vertical].getPiece();
}

