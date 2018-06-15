/**
 * Manejador de Base de Datos.
 */

var FIREBASE = FIREBASE || {};

/**
 * Carga la información necesaria para trabajar con *Realtime Database* de *Firebase*.
 */
FIREBASE.load = function() {
    // Tokens de acceso a firebase
    // Se cogerán de tokens.js, fichero que será incluido en el .gitignore

    // Inicializacion de las BBDD
    firebase.initializeApp(firebaseConfig);

    FIREBASE.db             = firebase.database();
    FIREBASE.table          = {};
    FIREBASE.table.players  = FIREBASE.db.ref("players");
    FIREBASE.table.games    = {};
    FIREBASE.table.games.f1 = FIREBASE.db.ref("games/f1");
}

// ##########################################
// ###               Users               ####
// ##########################################

/**
 * Crea un nuevo usuario con su email y contraseña.
 * @param {STring} email Email que se desea registrar.
 * @param {String} password Contraseña asignada al email.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.createUser = function(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

/**
 * Encuentra un susuario en la tabla de jugadores.
 * @param {String} name Nombre del usuario a encontrar.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.login = function(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);

/*
    var result = [];
    
    var promise = new Promise(function (resolve, reject) {
        FIREBASE.table.players.orderByChild('name').equalTo(name).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                var value = data.val();
                value.key = data.key;

                result.push(value);
            });  

            if (result && result.length == 1 && resolve) 
                resolve(result[0]);
            else if ((!result || result.length != 1) && reject) 
                reject();            
        });
    });

    return promise; */
}




// ##########################################
// ###              Matches              ####
// ##########################################

/**
 * Inserta una nueva partida de F1.
 * @param {Map} match Información de una nueva partida de F1.
 * @return {Promise} Devuelve la promesa de la actualización.
 */
FIREBASE.insertMatchsF1 = function(match) { 
    var newKey = tableGameF1.push().key;  
    var updates = {};
    updates[newKey] = match;  
    return FIREBASE.table.games.f1.update(updates);
}

/**
 * Encuentra todas las partidas de F1.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findAllMatchsF1 = function(){   
    var result = [];

    var promise = new Promise(function (resolve, reject) {
        FIREBASE.table.games.f1.once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                var value = data.val();
                value.key = data.key;

                result.push(value);
            });  
            
            if (result && resolve) 
                resolve(result);
            else if (!result && reject) 
                reject();       
        });        
    });

    return promise; 
}

/**
 * Encuentra todas las partidas de F1.
 * @param {String} key Clave del encuentro.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findF1Match = function(key){   
    var result = [];

    var promise = new Promise(function (resolve, reject) {
        db.ref("games/f1/" + key).once("value", function(snapshot) {
        //tableGameF1.orderByChild('name').equalTo(name).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                var value = data.val();
                value.key = data.key;

                result.push(value);
            });  
            
            if (result && resolve) 
                resolve(result);
            else if (!result && reject) 
                reject();         
        });        
    });

    return promise; 
}



// #############################
// ### Developers Utils     ####
// #############################

/**
 * Inicializacion de la BBDD con datos de ejemplos
 */
FIREBASE.initializeDB = function() { 
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

   /* var updates = {};
    var key = FIREBASE.table.game.f1.push().key;
    updates[key] = match1;  

    key = FIREBASE.table.game.f1.push().key;
    updates[key] = match2;

    key = FIREBASE.table.game.f1.push().key;
    updates[key] = match3;

    FIREBASE.table.game.f1.update(updates);*/
    FIREBASE.insertMatchsF1(match1);
    FIREBASE.insertMatchsF1(match2);
    FIREBASE.insertMatchsF1(match3);
}





$(document).ready(function() {
    FIREBASE.load();
});
