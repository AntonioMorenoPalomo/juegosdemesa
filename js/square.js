/**
 * Clase que representa una casilla del tablero.
 */

 
/**
 * 
 * @param {Number} initHorizontal Valor de inicio de la horizontal de la casilla.
 * @param {Number} endHorizontal Valor de fin de la horizontal de la casilla.
 * @param {Number} initVertical Valor de inicio de la vertical de la casilla.
 * @param {Number} endVertical Valor de fin de la vertical de la casilla.
 * @param {Piece} piece Pieza que contiene la casilla.
 * @param {*} action Acción a llevar a cabo cuando la pieza está en la casilla.
 */
function Square(initHorizontal, endHorizontal, initVertical, endVertical, piece, action) {
	this.initVertical = initVertical;
	this.endVertical = endVertical;
	this.initHorizontal = initHorizontal;
	this.endHorizontal = endHorizontal; 

	this.piece = piece;
	this.action = action;
}

/**
 * Comprueba si la posicion indicada pertenece a este Square
 * @param {Number} horizontal, posicion horizontal donde el usuario a clickeado
 * @param {Number} vertical, posicion vertical donde el usuario a clickeado
 * @return {Boolean} True si este Square esta en la zona indicada 
 */
Square.prototype.inSquare = function(horizontal, vertical) {
	return ((this.initVertical >= vertical) &&
			(this.endVertical <= vertical) &&
			(this.initHorizontal >= horizontal) &&
			(this.endHorizontal <= horizontal));
}

// Getter and setters
Square.prototype.setPiece = function(piece) {
	this.piece = piece;
}

Square.prototype.getPiece = function() {
	return this.piece;
}

Square.prototype.setAction = function(action) {
	this.action = action;
}

Square.prototype.getAction = function() {
	return this.action;
}