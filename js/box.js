function Box(initVertical, endVertical, initHorizontal, endHorizontal, item, func) {
  this.initVertical = initVertical;
  this.endVertical = endVertical;
  this.initHorizontal = initHorizontal;
  this.endHorizontal = endHorizontal; 

  this.item = item;
  this.func = func;
}

Box.prototype = {
  // Comprueba si la posicion indicada pertenece a esta casilla
  inBox: function(initVertical, endVertical, initHorizontal, endHorizontal){
    return((this.initVertical < initVertical) &&
            (this.endVertical > endVertical) &&
            (this.initHorizontal < initHorizontal) &&
            (this.endHorizontal > endHorizontal));
  },
  // Getter and setters
  setItem: function(item){
    this.item = item;
  },
  getItem: function(){
    return this.item;
  },
  setFunc: function(func){
    this.func = func;
  },
  getFunc: function(){
    return this.func;
  }
};