$("#select").submit(function( event ) {   
    location.href ="f1.html";
    event.preventDefault();
});


function onLoad() {
    findAllMatchsF1().then(function (matchs) {        
        var match;
        var description;
        matchs.forEach(function(match) {
            description = match.jugadorA + "-VS-" + match.jugadorB;
            $('#gameOption').append($('<option>', { 
                value: description,
                text : description 
            }));
        });  
    }).catch(function() {
        alert("No existen partidas creadas");
    });
}