$(document).ready(function() {
        
    $("form").submit(login);
    $("#login").on("click", login);
    
});

function login(event) {
    var userName = $('#username').val();  

    FIREBASE.findUser(userName).then(function(user) {        
        var userPass = $('#userpass').val();  
        
        if (user.pass == userPass){
            alert("Te has logueado. ¡Bienvenido!");
            location.href ="selectGame.html";
        } else {
            alert("Contraseña incorrecta, vuelve a intentarlo");
        }
    }).catch(function() {
        alert("El usuario no existe, se crea uno nuevo");
    });
    
    event.preventDefault();
}