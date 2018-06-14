
var F1 = F1 || {
    match : undefined,
    matchKey : undefined
}

$(window).resize(function() {
    repaintMatch(F1.match);
});

function onLoad() {
    // Initialize Firebase
    F1.store = tableGameF1;
    

    $("#dice").on("click", throwDice);
    $("#newMatch").on("click", loadOrCreateMatch);
    $("#colorSelector").on("change", function() {
        repaintMatch(F1.match);
    });


    console.log("Window.location = ");
    console.dir(window.location);

    var search = window.location.search;

    if (search && search.indexOf("key=") > 0) {
        F1.matchKey = search.substring(search.indexOf("key=") + 4);

        if (F1.matchKey.indexOf("&") >= 0) {
            F1.matchKey = F1.matchKey.substring(0, F1.matchKey.indexOf("&"));
        }

        loadMatch(F1.matchKey);
    }
}

function loadMatch(key) {
    var found = false;

    FIREBASE.findF1Match(key).then(function(data) {
        F1.match = data;
        repaintMatch(F1.match);
        detectChange();
    });
/*
    F1.store.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
           let childData = childSnapshot.val();

           if (childData.distanciaAzul < 100 && childData.distanciaRojo < 100) {
               F1.match = childData;
               F1.matchKey = childSnapshot.key;
               found = true;

               alert("Partida encontrada");
               repaintMatch(F1.match);
           }
        });

        if (!found) {
            var match = {
                turno: "Rojo", 
                distanciaRojo: 0,
                distanciaAzul: 0
            }

            alert("Partida creada");
        
            F1.match = F1.store.push();
            F1.match.set(match);
            F1.matchKey = F1.match.key;
        }

        detectChange();
    });*/
}

/**
 * Detecta los cambios que se realicen en la partida y refresca su visualización.
 */
function detectChange() {
    F1.store.child(F1.matchKey).on("value", function(snapshot) {
        F1.match = snapshot.val();
        repaintMatch(F1.match);
    });
}

/**
 * Salva la partida en firebase.
 * @param {Map} match Información de la partida.
 */
function saveMatch(match) {
    F1.store.child(F1.matchKey).update(match);
}


/**
 * Tira el dado para ver cuánto porcentaje avanza el coche.
 */
function throwDice() {
    let number = Math.round(Math.random() * 10);
    let color = $("#colorSelector").val();

    $("#panel").text(number);

    if (color == "Rojo") {
        F1.match.distanciaRojo += number;
        F1.match.turno = "Azul";
    } else if (color == "Azul") {
        F1.match.distanciaAzul += number;
        F1.match.turno = "Rojo";
    }

    saveMatch(F1.match);    
    repaintMatch(F1.match);
}

/**
 * Repinta toda la partida.
 * @param {Map} match Información de la partida a repintar.
 */
function repaintMatch(match) {
    var color = $("#colorSelector").val();

    $("#winnerPanel").hide();

    repaintCar("Rojo", match.distanciaRojo);
    repaintCar("Azul", match.distanciaAzul);

    if (match.distanciaRojo >= 100 || match.distanciaAzul >= 100) {
        $("#winnerPanel").show();
        $("#winnerPanel img").attr("src", (match.distanciaRojo >= 100) ? "img/cocheRojo.svg" : "img/cocheAzul.svg");
        $("#winnerPanel .text").css("color", (match.distanciaRojo >= 100) ? "red" : "blue");
    } else {
        if (match.turno == color) {
            $("#dice").attr("disabled", false);
        } else {
            $("#dice").attr("disabled", true);
        }
    }
}

/**
 * Repinta la posición de uno de los coches.
 * @param {String} color Color del coche a repintar.
 * @param {String} percentDistance Porcentaje del camino recorrido.
 */
function repaintCar(color, percentDistance) {
    var leftInitial = 35;
    var car = $("#coche" + color);
    var track = $("#pista" + color);
    var position = leftInitial + ((track.outerWidth() - car.outerWidth()) * percentDistance / 100);

    if (position > track.outerWidth() - car.outerWidth() + 25) {
        position = track.outerWidth() - car.outerWidth() + 25;
    }

    $(car).css("left", position + "px");
}