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
 * @param {Array} matches Listado de todas las partidas presentes.
 */
function _matchesFound(matches) {
    this._addMatch("-1", "Nueva partida", "img/add.svg", "<br>Nueva partida<br>", function() {
        alert("Creada... tu solo tienes que imaginarte un nuevo botón");
    });

    matches.forEach(function(match) {
        var description = match.jugadorA + "<br>VS<br>" + match.jugadorB;

        this._addMatch(match.key, "Formula 1", "img/cocheRojo.svg", description, function() {
            window.location = "f1.html?key=" + match.key;
        });
    });
}

/**
 * Añade un partido con el formato establecido.
 * @param {String} gameKey Clave del partido.
 * @param {String} gameName Nombre del juego.
 * @param {String} gameImg Imagen del juego.
 * @param {String} text Texto a mostrar en el botón.
 * @param {Function} onclick Acción a llevar a cabo cuando se pulse el botón.
 */
function _addMatch(gameKey, gameName, gameImg, text, onclick) {
    var button = $("<div>", {class: "buttonSelector", "data-match-key": gameKey});
    var image = $("<img>", {src: gameImg, title: gameName});
    var users = $("<div>", {html: text});

    button.append(image).append(users);

    if (onclick) button.on("click", onclick);

    $("#matches").append(button);
}

/**
 * Informa al usuario de un error que se ha producido.
 * @param {Error} error Error producido durante la ejecución.
 */
function error(error) {
    console.error(error);
    alert("Se ha producido un error: " + (typeof(error) == "object" ? error.message : error));
}