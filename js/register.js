$(document).ready(function() {        
    $("form").submit(register);
    $("#register").on("click", register);
});

function register() {
    var email = $("#email").val();
    var password = $("#password").val();
    $("#emailError").hide(250);
    $("#passwordError").hide(250);    
    $("#email").removeClass("error");
    $("#password").removeClass("error");
    
    var nick = $("#nick").val();
    var urlAvatar = $("#urlAvatar").val();
    var tlf = $("#tlf").val();
    var ciudad = $("#ciudad").val();

    FIREBASE.createUser(email, password, nick, urlAvatar, tlf, ciudad).then(successRegister, errorRegister).catch(function(error) {
        alert("Se ha producido un error.\n" + error);
    });
}

function successRegister() { 
    location.href ="selectGame.html";
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
            break;
    }
}