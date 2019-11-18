import * as Gb from './gbapi.js'

function createEmailItem(msg, index) {
    let fav = '';
    if(msg.labels.includes(Gb.MessageLabels.FAV)) fav = ' font-weight-bold text-warning';
    let read = 'bold';
    if(msg.labels.includes(Gb.MessageLabels.READ)) read = 'light';
    let html = '';
    html += '<li data-id=' + msg.msgid + ' class="row">' +
            ' <div class="col-md-1 align-middle h3 email-fav-icon align-slef-center ' + fav + '">☆</div>' +
            ' <div class="col-md-7 font-weight-' + read + ' email-item item">' +
            '   <p class="h5">' + msg.from + '</p>' +
            '   <p class="h7">' + msg.title + '</p>' +
            ' </div>' +
            ' <div class="col-md-3 email-item item align-self-center">' + msg.date + '</div>' +
            ' <div class="col-md-1 align-middle align-self-center">' +
            '   <div class="form-check float-right">' +
            '     <input class="form-check-input" type="checkbox" value="" id="email-check-' + index + '">' +
            '   </div>' +
            ' </div>' +
            '</li>' +
            '<hr/>';
  
  
    return $(html);
}

function emailSetFav(elem){
    let msgid = $(elem).closest("li").data("id");
    let msg = Gb.resolve(msgid);
    if(msg.labels.includes(Gb.MessageLabels.FAV)){
        msg.labels.push(Gb.MessageLabels.FAV);
        $(elem).addClass("font-weight-bold text-warning");
    }
    else{
        let pos = msg.labels.indexOf(Gb.MessageLabels.FAV);
        msg.labels.splice(pos, 1);
        $(elem).removeClass("font-weight-bold text-warning");
    }
}

function answerEmail(event){
    event.preventDefault();
    let toValue = $("#email-from").text();
    let fromValue = "yo";
    let title = $("#email-title").text();
    let body = $("#email-body").val();
    toValue = toValue.split(",");
    let msg = new Gb.Message(Gb.Util.randomText(), new Date(), fromValue, toValue, ["sent"], title, body);
    Gb.send(msg);
    alert("¡Mensaje enviado!");
    updateEmailList();
}

function updateEmailList(){
    try {
        $(".email-list ul").empty();
        Gb.globalState.messages.forEach((m, index) =>  $(".email-list ul").append(createEmailItem(m, index)));
    } catch (e) {
        console.log('Error actualizando', e);
    }
}

function resetEmailInputs(event) {
    if(event !== undefined) event.preventDefault();
    $("#email-to").val("");
    $("#email-cc").val("");
    $("#email-subject").val("");
    $("#email-body").val("");
}

function newEmailFormView(){
let html = '';
html += '<form class="email-new-form">' +
        ' <div class="form-group row">' +
        '   <label for="email-to" class="col-sm-2 col-form-label">Para:</label>' +
        '   <div class="col-sm-10">' +
        '     <input type="text" class="form-control" id="email-to" placeholder="Destinatarios">' +
        '   </div>' +
        ' </div>' +
        ' <div class="form-group row">' +
        '    <label for="email-cc" class="col-sm-2 col-form-label">CC:</label>' +
        '    <div class="col-sm-10">' +
        '      <input type="text" class="form-control" id="email-cc" placeholder="Copia">' +
        '    </div>' +
        '  </div>' +
        '  <div class="form-group row">' +
        '    <label for="email-subject" class="col-sm-2 col-form-label">Asunto:</label>' +
        '    <div class="col-sm-10">' +
        '      <input type="text" class="form-control" id="email-subject" placeholder="Introduzca Asunto">' +
        '    </div>' +
        '  </div>' +
        '  <div class="form-group">' +
        '    <textarea id="email-body" class="form-control" style="height:400px;"></textarea>' +
        '  </div>' +
        '  <div class="form-row  justify-content-between" style="margin-top: 20px">' +
        '    <div class="">' +
        '      <button class="btn btn-danger" id="email-cancel" type="submit">Cancelar</button>' +
        '    </div>' +
        '    <div class="">' +
        '      <button class="btn btn-success" id="email-send" type="submit">Enviar</button>' +
        '    </div>' +
        '  </div>' +
        '</form>'
return $(html);
}

function receivedEmailFormView(mensaje){
let html = '';
html += '<form>' +
        ' <div class="form-group row">' +
        '   <label for="formGroupExampleInput" class="col-sm-2 col-form-label">Emisor:</label>' +
        '   <div class="col-sm-10 my-auto">' +
        '     <span id="email-from">' + mensaje.from + '</span>' +
        '   </div>' +
        ' </div>' +
        ' <div class="form-group row">' +
        '   <label for="formGroupExampleInput" class="col-sm-2 col-form-label">Asunto:</label>' +
        '   <div class="col-sm-10 my-auto">' +
        '     <span id="email-title">' + mensaje.title + '</span>' +
        '   </div>' +
        ' </div>' +
        ' <div>' +
        '   <textarea style="height:100px;width:100%;" disabled>' + mensaje.body + '</textarea>' +
        ' </div>' +
        ' <div class="form-group">' +
        '   <textarea id="email-body" class="form-control" style="height:400px;">' +
        '\n\n\n' +
        '--------------------------------------------------------------------------\n' +
        'De: ' + mensaje.from + '\n' +
        'Para: ' + mensaje.to + '\n' +
        mensaje.body +
        '   </textarea>' +
        ' </div>' +
        ' <div class="form-row  justify-content-between" style="margin-top: 20px">' +
        '   <div class="">' +
        '     <button class="btn btn-danger" id="email-cancel" type="submit">Cancelar</button>' +
        '   </div>' +
        '   <div class="">' +
        '     <button class="btn btn-success" id="email-send" type="submit">Enviar</button>' +
        '   </div>' +
        ' </div>' +
        '</form>';

return $(html);
}

function sendNewEmail(event) {
    event.preventDefault();
    let toValue = $("#email-to").val();
    let ccValue = $("#email-cc").val();
    let fromValue = "yo";
    let title = $("#email-subject").val();
    let body = $("#email-body").val();
    ccValue = ccValue.split(",");
    toValue = toValue.split(",");
    toValue = toValue.concat(ccValue);
    let msg = new Gb.Message(Gb.Util.randomText(), new Date(), fromValue, toValue, ["sent"], title, body);
    Gb.send(msg);
    alert("¡Mensaje enviado!");
    updateEmailList();
    resetEmailInputs();
}

function deleteEmail(){
    if($(".email-list ul input[type='checkbox']:checked").length > 0){
        if(confirm("¿Seguro que desea borrar los mensajes?")){
          $(".email-list ul input[type='checkbox']:checked").each(function(index, element){
            console.log($(element).closest("li").data("id"));
            Gb.rm($(element).closest("li").data("id")).then(updateEmailList());
          })
        }
      }
      else{
        alert("Selecciona al menos un mensaje");
      }
}

function showEmailView(){
    $(".main-view").empty().append(
        $('<div class="email-list list container-fluid mt-2"></div>' +
          '<div class="email-container form-container mt-2"></div>'));
    showList();
}

function showList(){
    let html = '';
    html += '<div class="row justify-content-between container-fluid">' +
            '   <button class="btn btn-primary" id="email-new">Nuevo mensaje</button>' +
            '   <button class="btn btn-danger" id="email-delete">Eliminar mensaje</button>' +
            '</div>' +
            '<div class="row container-fluid mt-2">' +
            '   <input class="form-control" type="search" placeholder="Buscar" />' +
            '</div>' +
            '<ul class="container-fluid mt-2"></ul>' +
            '<hr/>';
    $(".main-view .email-list").append($(html));
    updateEmailList();
}

function showReceivedEmail(elem){
    let msgid = $(elem).data("id");
    $(".email-container").empty().append(receivedEmailFormView(Gb.globalState.messages.find(m => { 
        if(m.msgid == msgid) return m; 
    })));
}

function showNewEmail(){
    if(!$(".email-list").hasClass("col-md-3")) $(".email-list").addClass("col-md-3");
    $(".main-view .email-container").empty().append(newEmailFormView());
}

export {
    emailSetFav,
    answerEmail,
    resetEmailInputs,
    sendNewEmail,
    deleteEmail,
    showReceivedEmail,
    showNewEmail,
    showEmailView
}