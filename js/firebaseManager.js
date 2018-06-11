// ##############
// ### DDBB  ####
// ##############

// Initialize Firebase - Jose
var config1 = {
    apiKey: "AIzaSyDsSLDLeFP6WKwgoDtzRAUorwIKjkJdbsQ",
    authDomain: "proyectomaqueta-taos.firebaseapp.com",
    databaseURL: "https://proyectomaqueta-taos.firebaseio.com",
    projectId: "proyectomaqueta-taos",
    storageBucket: "proyectomaqueta-taos.appspot.com",
    messagingSenderId: "122308663118"
};
// Initialize Firebase - Antonio
var config2 = {
    apiKey: "AIzaSyBy8H9nO1IhV5Ge6mzL6rLucCYHAj0AUV4",
    authDomain: "juegosdemesa-96f29.firebaseapp.com",
    databaseURL: "https://juegosdemesa-96f29.firebaseio.com",
    projectId: "juegosdemesa-96f29",
    storageBucket: "juegosdemesa-96f29.appspot.com",
    messagingSenderId: "473742468533"
};

// Inicializacion de las BBDD
firebase.initializeApp(config1);
var db = firebase.database();
var tablePlayers = db.ref("players");
var tableGameF1 = db.ref("gameF1");

// ##############
// ### Users ####
// ##############

// Inserta usuario
function insertUser(user) { 
    var updates = {};
    updates[user.name] = user;  
    return tablePlayers.update(updates);
}
// Encuentra un valor en una tabla
function findUser(name){
    var resul = false;
    var promise = new Promise(function (resolve, reject) {
        tablePlayers.orderByChild('name').equalTo(name).limitToFirst(1).on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                 resul = data.val();
            });  
            (!resul) ? reject() : resolve(resul);            
        });
    });
    return promise; 
}


// ###############
// ### Matchs ####
// ###############
// Inserta partida F1
function insertMatchsF1(match) { 
    var newKey = tableGame1.push().key;  
    var updates = {};
    updates[newKey] = match;  
    return tableGameF1.update(updates);
}
// Encuentra todas las partidas F1
function findAllMatchsF1(){   
    var resul = [];
    var promise = new Promise(function (resolve, reject) {
        tableGameF1.on("value", function(snapshot) {
            snapshot.forEach(function(data) {
                resul.push(data.val());
            });  
            (!resul.length > 0) ? reject() : resolve(resul);         
        });        
    });
    return promise; 
}



// #############################
// ### Developers Utils     ####
// #############################

// Inicializacion de variables de ejemplos
function initializeDB() { 
    // Users
    var person1 = { name: "Jose", pass: "1111"};
    var person2 = {name: "Antonio", pass: "2222"};
    insertUser(person1);
    insertUser(person2);

    // Match 1
    var match1 = {
        jugadorA: "Jose",
        jugadorB: "Pepe",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
    }
    var match2 = {
        jugadorA: "Jose",
        jugadorB: "Antonio",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
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