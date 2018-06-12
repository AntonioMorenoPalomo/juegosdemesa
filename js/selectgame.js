$(document).ready(function() {
    // Aplicamos acción al submit
    $("#select").submit(function( event ) {   
        location.href ="f1.html";
        event.preventDefault();
    });

    // Buscamos todos los partidos y los cargamos
    findAllMatchsF1().then(_matchesFound, error).catch(error);
});


/**
 * Muestra todos los partidos encontrados.
 * @param {Map} snapshot Captura de lo que se encuentra en la base de datos.
 */
function _matchesFound(snapshot) {
    snapshot.forEach(function(matchSnapshot) {
        var match = matchSnapshot.val();
        var description = match.jugadorA + " VS " + match.jugadorB;

        $('#gameOption').append($('<option>', { 
            value: description,
            text : description 
        }));
    });
}

/**
 * Informa al usuario de un error que se ha producido.
 * @param {Error} error Error producido durante la ejecución.
 */
function error(error) {
    console.error(error);
    alert("Se ha producido un error: " + (typeof(error) == "object" ? error.message : error));
}