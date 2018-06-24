// ##########################################
// ###            Initialize             ####
// ##########################################

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
    FIREBASE.table.users    = FIREBASE.db.ref("users");
    FIREBASE.table.games    = {};
    FIREBASE.table.games.f1 = FIREBASE.db.ref("games/f1");
}

/**
 * Carga la configuración de Firebase
 */
$(document).ready(function() {
    FIREBASE.load();
});

// ##########################################
// ###               Users               ####
// ##########################################

/**
 * Crea un nuevo usuario con su email y contraseña.
 * @param {String} email Email que se desea registrar.
 * @param {String} password Contraseña asignada al email.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.createUser = function(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

/**
 * Actualiza los parametros de un usuario
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.updateUser = function(nick, urlAvatar, tlf, ciudad) {
    // Datos dataProfile de firebase
    const dataProfile = {
        displayName: nick,
        photoURL: urlAvatar
    };
    firebase.auth().currentUser.updateProfile(dataProfile);

    // Datos extras del usuario
    var userId = firebase.auth().currentUser.uid;
    const data = {
        uid: userId, 
        tlf: tlf,
        ciudad: ciudad
    };     
    var updates = {};
    updates[userId] = data;  

    return FIREBASE.table.users.update(updates);
}

/**
 * Obtiene toda la informacion de un usuario
 * @param {String} uid Identificador del usuario
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.getUserExtras = function() {
    var user = firebase.auth().currentUser;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        const data = {
            tlf: (snapshot.val() && snapshot.val().tlf) || 'Sin telefono',
            ciudad: (snapshot.val() && snapshot.val().ciudad) || 'Sin ciudad'
        }; 
        resolve(data);
    });
}

/**
 * Encuentra un susuario en la tabla de jugadores.
 * @param {String} name Nombre del usuario a encontrar.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.login = function(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

/**
 * Loguea a un usuario usando la red social de facebook.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.loginFB = function() {
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().languageCode = 'es_ES';
    provider.setCustomParameters({
        'display': 'popup'
    });
    return firebase.auth().signInWithPopup(provider);
}

/**
 * Desloguea al usuario activo
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.logout = function() {
    return firebase.auth().signOut();
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
    var newKey = FIREBASE.table.games.f1.push().key;  
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
            
            if (result && resolve){ 
                resolve(result);
            } else if (!result && reject) {
                reject();       
            }
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
        FIREBASE.db.ref("games/f1/" + key).once("value", function(snapshot) {
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
 * Salva la partida en firebase.
 * @param {Map} match Información de la partida.
 */
FIREBASE.saveF1Match = function(key, match) {
    FIREBASE.table.games.f1.child(key).update(match);
}


// #############################
// ### Developers Utils     ####
// #############################

/**
 * Inicializacion de la BBDD con datos de ejemplos
 */
FIREBASE.initializeDB = function() { 
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
    var match4 = {
        jugadorA: "",
        jugadorB: "Antonio",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
    }
    var match5 = {
        jugadorA: "Taos",
        jugadorB: "",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
    }

    FIREBASE.insertMatchsF1(match1);
    FIREBASE.insertMatchsF1(match2);
    FIREBASE.insertMatchsF1(match3);
    FIREBASE.insertMatchsF1(match4);
    FIREBASE.insertMatchsF1(match5);
}


