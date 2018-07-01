/*
 * Tablero genérico
 */
function Board(horizontal, vertical = 1) {
	this.board = [];
	this.lenghtHorizontal = horizontal;
	this.lenghtVertical = vertical;

	// Inizializate
	for (var h = 0; h < this.lenghtHorizontal; h++) {
		for (var v = 0; v < this.lenghtVertical; v++) {
			board[h] = [];
			board[h][v] = undefined;
		}
	}
}



/**
 * Guarda una casilla en la posicion indicada.
 * @param {Square} square Casilla a introducir.
 * @param {Number} horizontal Dimensión del tablero en horizontal.
 * @param {Number} vertical Dimensión del tablero en vertical. Por defecto 1.
 */
Board.prototype.setSquare = function(square, horizontal, vertical = 1){
	board[horizontal][vertical] = square;
}

/**
 * Devuelve la casilla seleccionada
 * @param {Number} horizontal Posición horizontal a buscar.
 * @param {Number} vertical Posición vertical a buscar. Por defecto 1.
 */
Board.prototype.findBox = function(horizontal, vertical = 1) {
	for (var h = 0; h < this.lenghtHorizontal; h++) {
		for (var v = 0; v < this.lenghtVertical; v++) {
			if (board[h][v] && board[h][v].inSquare(horizontal, vertical)) {
				return board[h][v];
			}
		}
	}

	return undefined;
}

