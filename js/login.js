$(document).ready(function() {
        
    $("form").submit(login);
    $("#login").on("click", login);
    $("#register").on("click", register);
});

function login() {
    var email = $("#email").val();
    var password = $("#password").val();

    $("#emailError").hide(250);
    $("#passwordError").hide(250);
    
    $("#email").removeClass("error");
    $("#password").removeClass("error");
    
    FIREBASE.login(email, password).then(successLogin, errorLogin).catch(function(error) {
        alert("Se ha producido un error.\n" + error);
    });
}

function register() {
    var email = $("#email").val();
    var password = $("#password").val();

    $("#emailError").hide(250);
    $("#passwordError").hide(250);
    
    $("#email").removeClass("error");
    $("#password").removeClass("error");
    
    FIREBASE.createUser(email, password).then(successRegister, errorRegister).catch(function(error) {
        alert("Se ha producido un error.\n" + error);
    });
}

function successLogin(data) {
    if (data && data.user)
        location.href ="selectGame.html";
    else 
        alert("No se ha identificar el usuario");
}

function successRegister(user) {
    if (user) {
        alert("El usuario se ha creado correctamente");
        login();
    } else {
        alert("No se ha podido crear el usuario");
    }
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
    }
}

function errorRegister(error) {
    switch (error.code) {
        case "auth/invalid-email":
            $("#emailError").text("El email no tiene un formato correcto");
            $("#emailError").show(250);
            $("#email").addClass("error");
            break;
        case "auth/email-already-in-use":
            $("#emailError").text("El email ya está registrado");
            $("#emailError").show(250);
            $("#email").addClass("error");
            break;
        case "auth/weak-password": 
            $("#passwordError").text("La contraseña debe tener al menos 6 caracteres");
            $("#passwordError").show(250);
            $("#password").addClass("error");
            break;
        case "auth/operation-not-allowed":
            $("#passwordError").text("El registro no está habilitado");
            $("#passwordError").show(250);
            $("#password").addClass("error");
            $("#email").addClass("error");
    }
}