/**
 * Clase de una pieda del juego de damas
 */

var PIECE = PIECE || {};

PIECE.consts		= {};
PIECE.consts.BLACK	= 1;
PIECE.consts.WHITE	= 2; 
PIECE.consts.RED	= 3; // Este color se usara como lugares candidatos

 /**
  * Constructor de la clase
  * @param {Number}
  */
 function Piece(color, king) {
	 this.color = color;
	 this.king = !!king;
 }

 /**
  * Función estática que devuelve una ficha de color blanco.
  * @param {Boolean} king Indica si es una pieza dama (rey en inglés).
  */
 Piece.getWhitePiece = function(king) {
	 return new Piece(PIECE.consts.WHITE, !!king);
 }

 /**
  * Función estática que devuelve una ficha de color negro.
  * @param {Boolean} king Indica si es una pieza dama (rey en inglés).
  */
 Piece.getBlackPiece = function(king) {
	 return new Piece(PIECE.consts.BLACK, !!king);
 }

 /**
  * Función estática que devuelve una ficha de color rojo.
  * @param {Boolean} king Indica si es una pieza dama (rey en inglés).
  */
 Piece.getRedPiece = function(king) {
	 return new Piece(PIECE.consts.RED, !!king);
 }


 /**
  * Indica si la pieza es una dama (rey en inglés).
  * @return Devuelve *true* si la pieza es una dama y *false* en caso contrario.
  */
 Piece.prototype.isKing = function() {
	 return this.king;
 }

 /**
  * Indica si la pieza es de color blanco.
  * @return Devuelve *true* si la pieza es de color blanco y *false* en caso contrario.
  */
Piece.prototype.isWhite = function() {
	return this.color == PIECE.consts.WHITE;
}

/**
 * Indica si la pieza es de color negro.
 * @return Devuelve *true* si la pieza es de color negro y *false* en caso contrario.
 */
Piece.prototype.isBlack = function() {
   return this.color == PIECE.consts.BLACK;
}

/**
 * Indica si la pieza es de color rojo.
 * @return Devuelve *true* si la pieza es de color rojo y *false* en caso contrario.
 */
Piece.prototype.isRed = function() {
   return this.color == PIECE.consts.RED;
}