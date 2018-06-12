// ##############
// ### DDBB  ####
// ##############


// Tokens de acceso a firebase
// Se cogerán de tokens.js, fichero que será incluido en el .gitignore

// Inicializacion de las BBDD
firebase.initializeApp(firebaseConfig);

var db              = firebase.database();
var tablePlayers    = db.ref("players");
var tableGameF1     = db.ref("gameF1");

// ##############
// ### Users ####
// ##############

/**
 * Inserta un usuario en la Realtime Database de firebase.
 * @param {Map} user Información del usuario que se desea insertar.
 */
function insertUser(user) { 
    var updates = {};
    updates[user.name] = user;  
    return tablePlayers.update(updates);
}

/**
 * Encuentra un valor en una tabla
 */
function findUser(name){
    var resul = false;
    /*var promise = new Promise(function (resolve, reject) {
        tablePlayers.orderByChild('name').equalTo(name).limitToFirst(1).on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                 resul = data.val();
            });  
            (!resul) ? reject() : resolve(resul);            
        });
    });*/

    var promise = tablePlayers.equalTo(name).limitToFirst(1).once("value");

    return promise; 
}


// ###############
// ### Matchs ####
// ###############

/**
 * Inserta una nueva partida de F1.
 * @param {Map} match Información de una nueva partida de F1.
 */
function insertMatchsF1(match) { 
    var newKey = tableGameF1.push().key;  
    var updates = {};
    updates[newKey] = match;  
    return tableGameF1.update(updates);
}

/**
 * Encuentra todas las partidas de F1
 */
function findAllMatchsF1(){   
    var resul = [];
    /*var promise = new Promise(function (resolve, reject) {
        tableGameF1.on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                resul.push(data.val());
            });  
            (!resul.length > 0) ? reject() : resolve(resul);         
        });        
    });*/

    var promise = tableGameF1.once("value");

    return promise; 
}



// #############################
// ### Developers Utils     ####
// #############################

/**
 * Inicializacion de la BBDD con datos de ejemplos
 */
function initializeDB() { 
    // Users
    var person1 = {name: "Jose", pass: "1111"};
    var person2 = {name: "Antonio", pass: "2222"};
    insertUser(person1);
    insertUser(person2);

    // Match 1
    var match1 = {
        jugadorA: "Jose",
        jugadorB: "Pepe",
        turno: "Rojo", 
        distanciaRojo: 10,
        distanciaAzul: 20
    }
    var match2 = {
        jugadorA: "Jose",
        jugadorB: "Antonio",
        turno: "Rojo", 
        distanciaRojo: 61,
        distanciaAzul: 49
    }
    var match3 = {
        jugadorA: "Maria",
        jugadorB: "Antonio",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
    }
    insertMatchsF1(match1);
    insertMatchsF1(match2);
    insertMatchsF1(match3);
}
