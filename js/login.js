$(document).ready(function() {
        
    $("#login").submit(function( event ) {
        var userName = $('#username').val();  

        findUser(userName).then(function (elem) {        
            var userPass = $('#userpass').val();  
            
            if (elem.pass == userPass){
                alert("Te has logueado. ¡Bienvenido!");
                location.href ="selectGame.html";
            } else {
                alert("Contraseña incorrecta, vuelve a intentarlo");
            }
        }).catch(function() {
            alert("El usuario no existe, se crea uno nuevo");
        });
        
        event.preventDefault();
    });
    
});