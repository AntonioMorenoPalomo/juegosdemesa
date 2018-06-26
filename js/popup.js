/**
* Constructor de la clase.
* @param {Map} settings Mapa con la información necesaria para la apertura de la ventana emergente.
*                       - titleText:          Título de la ventana
*                       - bodyText:            Cuerpo de la ventana en formato texto.
*                       - bodyId:          Cuerpo de la ventana que se recuperará con un ID.
*                       - body:                Cuerpo de la ventana en HTML a mostrar.
*                       - buttonConfig:        Configuración de botones (OK_BUTTON, OK_CANCEL_BUTTONS, CUSTOM_BUTTONS).
*                       - okButtonAction:  Acción asociada al botón OK.
*                       - cancelButtonAction: Acción asociada al botón CANCEL.
*/
function PopUp(settings) {
    this.settings = settings;
    this.popup   = null;
    this.background = null;

    this.settings.titleText          = this.settings.titleText || "&nbsp;";
    this.settings.buttonConfig       = this.settings.buttonConfig || PopUp.OK_BUTON;
    this.settings.customButtonTexts  = [];
    this.settings.customButtonActions = [];

    this.load();
}

PopUp.OK_BUTTON      = 0;
PopUp.OK_CANCEL_BUTTONS = 1;
PopUp.CUSTOM_BUTTONS    = 2;


/**
* Abre la ventana con la información pasada en settings.
*/
PopUp.prototype.load = function() {
    var $this = this;

    // Creamos la estructura de la ventana emergente
    var table = $("<table>", { id: "popup", class: "popup" });
    var thead = $("<thead>", { id: "popupTitle" });
    var tbody = $("<tbody>", { id: "popupBody" });
    var tfoot = $("<tfoot>", { id: "popupButtons" });
    var tr = $("<tr>");
    var td = $("<td>", { html: this.settings.titleText });
    var body = null;

    // Creamos fondo oscuro
    this.background = $("<div>", { class: "backgroundPopup" });

    // Cargamos el título
    tr.append(td);
    thead.append(tr);

    // Cargamos el cuerpo
    tr = $("<tr>");
    td = $("<td>");

    if (this.settings.bodyId)
        td.append($("#" + this.settings.bodyId).clone().show());
    else if (this.settings.bodyText)
        td.html(this.settings.bodyText);
    else if (this.settings.body)
        td.append(this.settings.body);

    tr.append(td);
    tbody.append(tr);

    // Cargamos el pie
    tfoot.append(this._createButtonPanel());

    // Se incluye en la vista
    table.append(thead).append(tbody).append(tfoot);
    this.popup = table;
    $(document.body).append(this.popup).append(this.background);

    this._moveWindowToCenter();

    return this;
}


/**
* Cierra la ventana emergente anteriormente abierta.
*/
PopUp.prototype.close = function() {
    $(this.popup).remove();
    $(this.background).remove();

    this.popup = null;
    this.background = null;
}

/**
* Añade un nuevo botón a la ventana PopUp.
* @param {String} text Título del botón
* @param {function} action Acción que se llevará a cabo cuando se pulse el botón.
*/
PopUp.prototype.addButton = function(text, action) {
    var position = this.settings.customButtonTexts.length;

    this.settings.customButtonTexts[position] = text;
    this.settings.customButtonActions[position] = action;
}


/**
* Mueve el panel del popup al centro de la ventana.
*/
PopUp.prototype._moveWindowToCenter = function() {
    this.popup.css("margin-left", "-" + (this.popup.outerWidth() / 2) + "px");
    this.popup.css("margin-top", "-" + (this.popup.outerHeight() / 2) + "px");

    return this;
}

/**
* Crea la línea de la botonera del popup.
* @return Devuelve una fila de la tabla (TR) que será el pie del PopUp con la botonera.
*/
PopUp.prototype._createButtonPanel = function() {
    var _this = this;
    var tr = $("<tr>");
    var td = $("<td>");

    switch (this.settings.buttonConfig) {
        case PopUp.OK_CANCEL_BUTTONS:
            td.append(this._createButton("Cancelar", this.settings.cancelButtonAction));

        case PopUp.OK_BUTTON:
            td.append(this._createButton("Aceptar", this.settings.okButtonAction));
            break;

        case PopUp.CUSTOM_BUTTONS:
            for (var i = 0; i < this.settings.customButtonTexts.length; i++) {
                td.append(this._createButton(this.settings.customButtonTexts[i], this.settings.customButtonActions[i]));
            }
            break;
    }

    tr.append(td);

    return tr;
}

/**
* Crea un nuevo botón para insertarlo en el PopUp.
* @param {String} text Título del botón
* @param {function} action Acción que se llevará a cabo cuando se pulse el botón.
* @return Devuelve el botón para el PopUp (DIV).
*/
PopUp.prototype._createButton = function(text, action) {
    var btn  = $("<div>", { text: text, class: "button" });
    var _this = this;

    btn.on("click", function() {
        if (action)
         action();
        _this.close();
    });

    return btn;
}