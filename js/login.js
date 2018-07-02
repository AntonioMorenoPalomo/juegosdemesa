$(document).ready(function() {        
    $("form").submit(login);
    $("#login").on("click", login);
    $("#register").on("click", register);
    $("#loginFB").on("click", loginFacebook);
    $("#loginGoogle").on("click", loginGoogle);    
});

function login() {
    var email = $("#email").val();
    var password = $("#password").val();

    $("#emailError").hide(250);
    $("#passwordError").hide(250);
    
    $("#email").removeClass("error");
    $("#password").removeClass("error");
    
    FIREBASE.login(email, password).then(successLogin, errorLogin);
}

function loginFacebook() {
    FIREBASE.loginFB().then(successLogin, errorLogin).catch(function(error) {
        console.log("Se ha producido un error.\n" + error);
    });
}

function loginGoogle() {
	 console.log("Vamos con Google");
    FIREBASE.loginGoogle().then(successLogin, errorLogin).catch(function(error) {
    	 console.log("Se ha producido un error.\n" + error);
    });
}

function successLogin(data) {
    location.href ="selectGame.html";
}

function errorLogin(error) {
    switch (error.code) {
        case "auth/invalid-email":
            $("#emailError").text("El email no tiene un formato correcto");
            $("#emailError").show(250);
            $("#email").addClass("error");
            break;
        case "auth/user-not-found":
            $("#emailError").text("El email no ha sido encontrado");
            $("#emailError").show(250);
            $("#email").addClass("error");
            break;
        case "auth/wrong-password": 
            $("#passwordError").text("La contraseña es incorrecta");
            $("#passwordError").show(250);
            $("#password").addClass("error");
            break;
        case "auth/user-disabled":
            $("#passwordError").text("El usuario no está habilitado");
            $("#passwordError").show(250);
            $("#password").addClass("error");
            $("#email").addClass("error");
            break;
        default:
        	 console.log("Se ha producido un error desconocido: " + error);
    }
}

function register() {
    location.href ="register.html";
}