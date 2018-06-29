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
    firebase.initializeApp(firebaseConfig);

    FIREBASE.db                     = firebase.database();
    FIREBASE.table                  = {};
    FIREBASE.table.users            = FIREBASE.db.ref("users");
    FIREBASE.table.games            = {};
    FIREBASE.table.games.f1         = FIREBASE.db.ref("games/f1");
    FIREBASE.table.games.checkers   = FIREBASE.db.ref("games/checkers");
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
 * Crea un nuevo usuario con su email y contraseña, y actualiza sus parametros opcionales.
 * @param {String} email Email que se desea registrar.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.createUser = function(email, password, nick, urlAvatar, tlf, ciudad) {
    var promise = new Promise(function (resolve, reject) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
            resolve(FIREBASE.updateUser(nick, urlAvatar, tlf, ciudad));
        });
    });
    return promise;
}

/**
 * Actualiza los parametros de un usuario
 * @param {String} nick Alias que utilizará el usuario.
 * @param {String} urlAvatar URL de la imagen del avatar.
 * @param {String} phone Telefono del usuario.
 * @param {String} city Ciudad del usuario.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.updateUser = function(nick, urlAvatar, phone, city) {
    // Datos dataProfile de firebase, no hay más
    const dataProfile = {
        displayName: nick,
        photoURL: urlAvatar,
        phoneNumber: phone
    };
    firebase.auth().currentUser.updateProfile(dataProfile);

    // Datos extras del usuario, se pueden agregar más
    var userId = firebase.auth().currentUser.uid;
    const data = {
        phone: phone,
        city: city,
        otrosExtras: "ejemplo"
    };     
    var updates = {};
    updates[userId] = data;  

    return FIREBASE.table.users.update(updates);
}

/**
 * Obtiene toda la informacion de un usuario
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.getUserExtras = function() {
    var user = firebase.auth().currentUser;
    return firebase.database().ref('/users/' + user.userId).once('value').then(function(snapshot) {
        const data = {
            phone: (snapshot.val() && snapshot.val().phone) || 'Sin telefono',
            city: (snapshot.val() && snapshot.val().city) || 'Sin ciudad'
        }; 
        resolve(data);
    });
}

/**
 * Encuentra un susuario en la tabla de jugadores.
 * @param {String} email Cuenta de correo del usuario.
 * @param {String} password Contraseña de acceso del usuario.
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
    return FIREBASE.loginProvider(provider);
}

/**
 * Loguea a un usuario usando la red social de Google.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.loginGoogle = function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    return FIREBASE.loginProvider(provider);
}

FIREBASE.loginProvider = function(provider) {
    firebase.auth().languageCode = 'es_ES';

    var promise = new Promise(function (resolve, reject) {
        firebase.auth().signInWithPopup(provider).then(function(user) {
            resolve(FIREBASE.updateUser(user.user.displayName, user.user.photoURL, user.user.phoneNumber, ""));
        }).catch(function(error) {
            alert("Se ha producido un error.\n" + error);
        });
    });
    
    return promise;
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
            } else {
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


