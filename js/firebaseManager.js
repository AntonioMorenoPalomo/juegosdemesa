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
 * @param {String} x6 Parametros del usuario
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.createUser = function(email, password, nick, urlAvatar, phone, city) {
    var promise = new Promise(function (resolve, reject) {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
            resolve(FIREBASE.updateUser(nick, urlAvatar, phone, city));
        });
    });
    return promise;
}

/**
 * Actualiza los parametros de un usuario
 * @param {String} x4 parametros del usuario
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
            console.log("Se ha producido un error.\n" + error);
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
// ###    Genericas de todos los juegos   ###
// ##########################################

/**
 * Inserta una nueva partida.
 * @param {Map} match Información de una nueva partida.
 * @return {Promise} Devuelve la promesa de la actualización.
 */
FIREBASE.insertMatch = function(match, ref) { 
    var newKey = ref.push().key;  
    var updates = {};
    updates[newKey] = match;  
    ref.update(updates);
    return newKey;
}

/**
 * Encuentra la partida indicada del juego indicado.
 * @param {String} key Clave del encuentro.
 * @param {String} game Nombre del juego
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findMatch = function(key, game) {    
    var result = [];

    var promise = new Promise(function (resolve, reject) {
        FIREBASE.db.ref("games/"+ game + "/" + key).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                var value = data.val();
                value.key = data.key;

                result.push(value);
            });  
            
            if (result && resolve) { 
                resolve(result);
            } else {
                reject();         
            }
        });        
    });

    return promise; 
}

/**
 * Encuentra todas las partidas del juego indicado
 * @param {String} ref Refrencia del juego
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findAllMatchs = function(ref){   
    var result = [];

    var promise = new Promise(function (resolve, reject) {
        ref.once("value", function(snapshot) {
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

// ##########################################
// ###              F1                    ###
// ##########################################

/**
 * Inserta una nueva partida de F1.
 * @param {Map} match Información de una nueva partida de F1.
 * @return {Promise} Devuelve la promesa de la actualización.
 */
FIREBASE.insertMatchsF1 = function(match) { 
	return FIREBASE.insertMatch (match, FIREBASE.table.games.f1);
}

/**
 * Encuentra todas las partidas de F1.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findAllMatchsF1 = function(){   
	return FIREBASE.findAllMatchs(FIREBASE.table.games.f1);
}

/**
 * Encuentra una partida de F1.
 * @param {String} key Clave del encuentro.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findMatchF1 = function(key){   
    return FIREBASE.findMatch(key, "f1");
}

/**
 * Salva la partida en firebase.
 * @param {Map} match Información de la partida.
 */
FIREBASE.saveMatchF1 = function(key, match) {
    return FIREBASE.table.games.f1.child(key).update(match);
}


// ##########################################
// ###              Checkers             ####
// ##########################################
/**
 * Inserta una nueva partida de Cherkes.
 * @param {Map} match Información de una nueva partida de F1.
 * @return {Promise} Devuelve la promesa de la actualización.
 */
FIREBASE.insertMatchCheckers = function(match) { 
	return FIREBASE.insertMatch(match, FIREBASE.table.games.checkers);
}

/**
 * Encuentra una partida
 * @param {String} key Clave del encuentro.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findMatchCheckers = function(key) {
   return FIREBASE.findMatch(key, "checkers");
}

/**
 * Encuentra todas las partidas.
 * @return {Promise} Devuelve la promesa de la ejecución.
 */
FIREBASE.findAllMatchsCheckers = function(){   
	return FIREBASE.findAllMatchs(FIREBASE.table.games.checkers);
}

/**
 * Salva la partida.
 * @param {Map} match Información de la partida.
 */
FIREBASE.saveMatchCheckers = function(key, match) {
   return FIREBASE.table.games.checkers.child(key).update(match);
}


// #############################
// ### Developers Utils     ####
// #############################

/**
 * Inicializacion de la BBDD con datos de ejemplos
 */
FIREBASE.initializeDB = function() { 
    // F1
    var f1match1 = {
        jugadorA: "Jose",
        jugadorB: "Pepe",
        turno: "Rojo", 
        distanciaRojo: 10,
        distanciaAzul: 20
    }
    var f1match2 = {
        jugadorA: "Jose",
        jugadorB: "Antonio",
        turno: "Rojo", 
        distanciaRojo: 61,
        distanciaAzul: 49
    }
    var f1match3 = {
        jugadorA: "Maria",
        jugadorB: "Antonio",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
    }
    var f1match4 = {
        jugadorA: "",
        jugadorB: "Antonio",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
    }
    var f1match5 = {
        jugadorA: "Jose",
        jugadorB: "",
        turno: "Rojo", 
        distanciaRojo: 0,
        distanciaAzul: 0
    }

    FIREBASE.insertMatchsF1(f1match1);
    FIREBASE.insertMatchsF1(f1match2);
    FIREBASE.insertMatchsF1(f1match3);
    FIREBASE.insertMatchsF1(f1match4);
    FIREBASE.insertMatchsF1(f1match5);

    var match1 = {
        jugadorA: "Jose",
        jugadorB: "Pepe",
        turno: "red",
        posiciones: new Array({h:0,v:0,p:{color: 2, king: false}},{h:0,v:2,p:{color: 2, king: false}},{h:0,v:4,p:{color: 2, king: false}},{h:0,v:6,p:{color: 2, king: false}},
		        			 {h:1,v:1,p:{color: 2, king: false}},{h:1,v:3,p:{color: 2, king: false}},{h:1,v:5,p:{color: 2, king: false}},{h:1,v:7,p:{color: 2, king: false}},
		                     {h:2,v:0,p:{color: 2, king: false}},{h:2,v:2,p:{color: 2, king: false}},{h:2,v:4,p:{color: 2, king: false}},{h:2,v:6,p:{color: 2, king: false}},
		                     {h:3,v:1,p:{color: 2, king: false}},{h:3,v:3,p:{color: 2, king: false}},{h:3,v:5,p:{color: 2, king: false}},{h:3,v:7,p:{color: 2, king: false}},
		                     {h:4,v:0,p:{color: 1, king: false}},{h:4,v:2,p:{color: 1, king: false}},{h:4,v:4,p:{color: 1, king: false}},{h:4,v:6,p:{color: 1, king: false}},
		                     {h:5,v:1,p:{color: 1, king: false}},{h:5,v:3,p:{color: 1, king: false}},{h:5,v:5,p:{color: 1, king: false}},{h:5,v:7,p:{color: 1, king: false}},
		                     {h:6,v:0,p:{color: 1, king: false}},{h:6,v:2,p:{color: 1, king: false}},{h:6,v:4,p:{color: 1, king: false}},{h:6,v:6,p:{color: 1, king: false}},
		                     {h:7,v:1,p:{color: 1, king: false}},{h:7,v:3,p:{color: 1, king: false}},{h:7,v:5,p:{color: 1, king: false}},{h:7,v:7,p:{color: 1, king: false}})
    }
    var match2 = {
        jugadorA: "Jose",
        jugadorB: "Antonio",
        turno: "white",
        posiciones: new Array({h:0,v:0,p:{color: 2, king: false}},{h:0,v:2,p:{color: 2, king: false}},{h:0,v:4,p:{color: 2, king: false}},{h:0,v:6,p:{color: 2, king: false}},
		        			{h:1,v:1,p:{color: 2, king: false}},{h:1,v:3,p:{color: 2, king: false}},{h:1,v:5,p:{color: 2, king: false}},{h:1,v:7,p:{color: 2, king: false}},
			                {h:2,v:0,p:{color: 2, king: false}},{h:2,v:2,p:{color: 2, king: false}},{h:2,v:4,p:{color: 2, king: false}},{h:2,v:6,p:{color: 2, king: false}},
			                {h:3,v:1,p:{color: 2, king: false}},{h:3,v:3,p:{color: 2, king: false}},{h:3,v:5,p:{color: 2, king: false}},{h:3,v:7,p:{color: 2, king: false}},
			                {h:4,v:0,p:{color: 1, king: false}},{h:4,v:2,p:{color: 1, king: false}},{h:4,v:4,p:{color: 1, king: false}},{h:4,v:6,p:{color: 1, king: false}},
			                {h:5,v:1,p:{color: 1, king: false}},{h:5,v:3,p:{color: 1, king: false}},{h:5,v:5,p:{color: 1, king: false}},{h:5,v:7,p:{color: 1, king: false}},
			                {h:6,v:0,p:{color: 1, king: false}},{h:6,v:2,p:{color: 1, king: false}},{h:6,v:4,p:{color: 1, king: false}},{h:6,v:6,p:{color: 1, king: false}},
			                {h:7,v:1,p:{color: 1, king: false}},{h:7,v:3,p:{color: 1, king: false}},{h:7,v:5,p:{color: 1, king: false}},{h:7,v:7,p:{color: 1, king: false}})
	}
    var match3 = {
        jugadorA: "Maria",
        jugadorB: "Antonio",
        turno: "red",
        posiciones: new Array({h:0,v:0,p:{color: 2, king: false}},{h:0,v:2,p:{color: 2, king: false}},{h:0,v:4,p:{color: 2, king: false}},{h:0,v:6,p:{color: 2, king: false}},
			    			{h:1,v:1,p:{color: 2, king: false}},{h:1,v:3,p:{color: 2, king: false}},{h:1,v:5,p:{color: 2, king: false}},{h:1,v:7,p:{color: 2, king: false}},
			                {h:2,v:0,p:{color: 2, king: false}},{h:2,v:2,p:{color: 2, king: false}},{h:2,v:4,p:{color: 2, king: false}},{h:2,v:6,p:{color: 2, king: false}},
			                {h:3,v:1,p:{color: 2, king: false}},{h:3,v:3,p:{color: 2, king: false}},{h:3,v:5,p:{color: 2, king: false}},{h:3,v:7,p:{color: 2, king: false}},
			                {h:4,v:0,p:{color: 1, king: false}},{h:4,v:2,p:{color: 1, king: false}},{h:4,v:4,p:{color: 1, king: false}},{h:4,v:6,p:{color: 1, king: false}},
			                {h:5,v:1,p:{color: 1, king: false}},{h:5,v:3,p:{color: 1, king: false}},{h:5,v:5,p:{color: 1, king: false}},{h:5,v:7,p:{color: 1, king: false}},
			                {h:6,v:0,p:{color: 1, king: false}},{h:6,v:2,p:{color: 1, king: false}},{h:6,v:4,p:{color: 1, king: false}},{h:6,v:6,p:{color: 1, king: false}},
			                {h:7,v:1,p:{color: 1, king: false}},{h:7,v:3,p:{color: 1, king: false}},{h:7,v:5,p:{color: 1, king: false}},{h:7,v:7,p:{color: 1, king: false}})
	}
    var match4 = {
        jugadorA: "",
        jugadorB: "Antonio",
        turno: "red",
        posiciones: new Array({h:0,v:0,p:{color: 2, king: false}},{h:0,v:2,p:{color: 2, king: false}},{h:0,v:4,p:{color: 2, king: false}},{h:0,v:6,p:{color: 2, king: false}},
			    			{h:1,v:1,p:{color: 2, king: false}},{h:1,v:3,p:{color: 2, king: false}},{h:1,v:5,p:{color: 2, king: false}},{h:1,v:7,p:{color: 2, king: false}},
			                {h:2,v:0,p:{color: 2, king: false}},{h:2,v:2,p:{color: 2, king: false}},{h:2,v:4,p:{color: 2, king: false}},{h:2,v:6,p:{color: 2, king: false}},
			                {h:3,v:1,p:{color: 2, king: false}},{h:3,v:3,p:{color: 2, king: false}},{h:3,v:5,p:{color: 2, king: false}},{h:3,v:7,p:{color: 2, king: false}},
			                {h:4,v:0,p:{color: 1, king: false}},{h:4,v:2,p:{color: 1, king: false}},{h:4,v:4,p:{color: 1, king: false}},{h:4,v:6,p:{color: 1, king: false}},
			                {h:5,v:1,p:{color: 1, king: false}},{h:5,v:3,p:{color: 1, king: false}},{h:5,v:5,p:{color: 1, king: false}},{h:5,v:7,p:{color: 1, king: false}},
			                {h:6,v:0,p:{color: 1, king: false}},{h:6,v:2,p:{color: 1, king: false}},{h:6,v:4,p:{color: 1, king: false}},{h:6,v:6,p:{color: 1, king: false}},
			                {h:7,v:1,p:{color: 1, king: false}},{h:7,v:3,p:{color: 1, king: false}},{h:7,v:5,p:{color: 1, king: false}},{h:7,v:7,p:{color: 1, king: false}})
	}
    var match5 = {
        jugadorA: "Jose",
        jugadorB: "",
        turno: "red",
        posiciones: new Array({h:0,v:0,p:{color: 2, king: false}},{h:0,v:2,p:{color: 2, king: false}},{h:0,v:4,p:{color: 2, king: false}},{h:0,v:6,p:{color: 2, king: false}},
			    			{h:1,v:1,p:{color: 2, king: false}},{h:1,v:3,p:{color: 2, king: false}},{h:1,v:5,p:{color: 2, king: false}},{h:1,v:7,p:{color: 2, king: false}},
			                {h:2,v:0,p:{color: 2, king: false}},{h:2,v:2,p:{color: 2, king: false}},{h:2,v:4,p:{color: 2, king: false}},{h:2,v:6,p:{color: 2, king: false}},
			                {h:3,v:1,p:{color: 2, king: false}},{h:3,v:3,p:{color: 2, king: false}},{h:3,v:5,p:{color: 2, king: false}},{h:3,v:7,p:{color: 2, king: false}},
			                {h:4,v:0,p:{color: 1, king: false}},{h:4,v:2,p:{color: 1, king: false}},{h:4,v:4,p:{color: 1, king: false}},{h:4,v:6,p:{color: 1, king: false}},
			                {h:5,v:1,p:{color: 1, king: false}},{h:5,v:3,p:{color: 1, king: false}},{h:5,v:5,p:{color: 1, king: false}},{h:5,v:7,p:{color: 1, king: false}},
			                {h:6,v:0,p:{color: 1, king: false}},{h:6,v:2,p:{color: 1, king: false}},{h:6,v:4,p:{color: 1, king: false}},{h:6,v:6,p:{color: 1, king: false}},
			                {h:7,v:1,p:{color: 1, king: false}},{h:7,v:3,p:{color: 1, king: false}},{h:7,v:5,p:{color: 1, king: false}},{h:7,v:7,p:{color: 1, king: false}})
	}

    FIREBASE.insertMatchCheckers(match1);
    FIREBASE.insertMatchCheckers(match2);
    FIREBASE.insertMatchCheckers(match3);
    FIREBASE.insertMatchCheckers(match4);
    FIREBASE.insertMatchCheckers(match5);
    
}


