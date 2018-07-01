/*
 * Tablero unidimensional 
 */
function Board(n) {
    var board = this;
    board.lenght = n;

    // Inizializate
    for (var h = 0; h < n; h++) {
        board[h] = undefined;
    }
   
    // Guarda casilla en la posicion indicada
    board.setBox = function(n, Box){
        board[n] = Box;
    }

    // Devuelve la casilla seleccionada
    board.findBox = function(initVertical, endVertical, initHorizontal, endHorizontal){
        for (var h = 0; h < board.lenght; h++) {
            if ((board[h] != undefined) &&
                (board[h].inBox(initVertical, endVertical, initHorizontal, endHorizontal))) {
                    return true;
            }
        }
        return false;
    }
}

/*
 * Tablero bidimensional 
 */
function Board(n, m) {
    var board = this;
    board.lenghtHorizontal = n;
    board.lenghtVertical = m;

    // Inizializate
    for (var h = 0; h < board.lenghtHorizontal; h++) {
        for (var v = 0; v < board.lenghtVertical; v++) {
            board[h] = [];
            board[h][v] = undefined;
        }
    }

    // Guarda casilla en la posicion indicada
    board.setBox = function(n, m, Box){
        board[n][m] = Box;
    }

    // Devuelve la casilla seleccionada
    board.findBox = function(initVertical, endVertical, initHorizontal, endHorizontal){
        for (var h = 0; h < board.lenghtHorizontal; h++) {
            for (var v = 0; v < board.lenghtVertical; v++) {
               if ((board[h][v] != undefined) &&
                    (board[h][v].inBox(initVertical, endVertical, initHorizontal, endHorizontal))) {
                        return true;
                }
            }
        }
        return false;
    }
}
  
Board.prototype = {
    // TODO: funcionalidades genericas de ambas
};

//  var listBox = new Square(2)