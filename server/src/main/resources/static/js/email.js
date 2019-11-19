import * as Gb from './gbapi.js'

function getFormattedDate(date){
    date = new Date(date);
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let year = date.getFullYear();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return day + "-" + month + "-" + year + " " + hours + ":" + minutes;
}

function createEmailItem(msg, index) {
    let fav = '';
    if(msg.labels.includes(Gb.MessageLabels.FAV)) fav = ' font-weight-bold text-warning';
    let read = 'bold';
    if(msg.labels.includes(Gb.MessageLabels.READ)) read = 'light';
    let html = '';
    html += '<li data-id=' + msg.msgid + ' class="row">' +
        ' <div class="col-md-1 align-middle h3 email-fav-icon align-self-center ' + fav + '">☆</div>' +
        ' <div class="col-md-7 font-weight-' + read + ' email-item item">' +
        '   <p class="h5">' + msg.from + '</p>' +
        '   <p class="h7">' + msg.subject + '</p>' +
        ' </div>' +
        ' <div class="col-md-3 email-item item align-self-center font-weight-' + read + '">' + getFormattedDate(msg.date) + '</div>' +
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
    console.log("msgid", msgid);
    let msg = Gb.resolve(msgid);
    if(!msg.labels.includes(Gb.MessageLabels.FAV)){
        msg.labels.push(Gb.MessageLabels.FAV);
        $(elem).addClass("font-weight-bold text-warning");
    }
    else{
        let pos = msg.labels.indexOf(Gb.MessageLabels.FAV);
        msg.labels.splice(pos, 1);
        $(elem).removeClass("font-weight-bold text-warning");
    }
    Gb.set(msg);
}

function answerEmail(event){
    event.preventDefault();
    let toValue = $("#email-from").data("id");
    let fromValue = Gb.globalState.users[0].uid;
    let title = $("#email-title").text();
    let body = $("#email-body").val();
    let msg = new Gb.Message(Gb.Util.randomText(), new Date(), fromValue, toValue, ["sent"], title, body);
    Gb.send(msg);
    alert("¡Mensaje enviado!");
    showEmailView();
}

function updateEmailList(){
    try {
        $(".email-list ul").empty();
        Gb.globalState.messages.forEach((m, index) =>  {
            if(m.to.includes(Gb.globalState.users[0].uid))
                $(".email-list ul").append(createEmailItem(m, index))
        });
    } catch (e) {
        console.log('Error actualizando', e);
    }
}

function resetEmailInputs(event) {
    if(event !== undefined) event.preventDefault();
    $('.selectpicker').selectpicker('deselectAll');
    $("#email-subject").val("");
    $("#email-body").val("");
}

function newEmailFormView(){
    let html = '';
    html += '<form class="email-new-form">' +
            ' <div class="form-group row">' +
            '   <label for="email-to" class="col-sm-2 col-form-label">Para:</label>' +
            '   <div class="col-sm-10">' +
            '     <select class="selectpicker" multiple data-live-search="true" id="email-to" data-width="100%" required>';
    Gb.globalState.users.forEach(u=>{
        if(u.uid != Gb.globalState.users[0].uid)
            html += '<option value="' + u.uid + '">'+ u.first_name + " " + u.last_name  +'</option>'
    });
    html += '     </select>' + 
            '   </div>' +
            ' </div>' +
            ' <div class="form-group row">' +
            '    <label for="email-cc" class="col-sm-2 col-form-label">CC:</label>' +
            '    <div class="col-sm-10">' +
            '      <select class="selectpicker" multiple data-live-search="true" id="email-cc" data-width="100%">';
    Gb.globalState.users.forEach(u=>{
        if(u.uid != Gb.globalState.users[0].uid)
            html += '<option value="' + u.uid + '">'+ u.first_name + " " + u.last_name  +'</option>'
    });
    html += '     </select>' +
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
            '      <button class="btn btn-danger" id="email-cancel">Cancelar</button>' +
            '    </div>' +
            '    <div class="">' +
            '      <button class="btn btn-success" id="email-send" type="submit">Enviar</button>' +
            '    </div>' +
            '  </div>' +
            '</form>'
    return $(html);
}

function receivedEmailFormView(msg){
    if(!msg.labels.includes(Gb.MessageLabels.READ)){
        msg.labels.push(Gb.MessageLabels.READ);
        Gb.set(msg).then(()=>{
            $("li[data-id='" + msg.msgid + "'] .item").toggleClass("font-weight-bold font-weight-light");
        } );
    }
    let fromName = Gb.resolve(msg.from).first_name + " " + Gb.resolve(msg.from).last_name;
    let toName = Gb.resolve(msg.to).first_name + " " + Gb.resolve(msg.to).last_name;
    let html = '';
    html += '<form class="email-received-form">' +
        ' <div class="form-group row">' +
        '   <label for="formGroupExampleInput" class="col-sm-2 col-form-label">Emisor:</label>' +
        '   <div class="col-sm-10 my-auto">' +
        '     <span id="email-from" data-id="' + msg.from + '">' + fromName + '</span>' +
        '   </div>' +
        ' </div>' +
        ' <div class="form-group row">' +
        '   <label for="formGroupExampleInput" class="col-sm-2 col-form-label">Asunto:</label>' +
        '   <div class="col-sm-10 my-auto">' +
        '     <span id="email-title">' + msg.subject + '</span>' +
        '   </div>' +
        ' </div>' +
        ' <div class="form-group row">' +
        '   <label for="formGroupExampleInput" class="col-sm-2 col-form-label">Fecha:</label>' +
        '   <div class="col-sm-10 my-auto">' +
        '     <span id="email-date">' + getFormattedDate(msg.date) + '</span>' +
        '   </div>' +
        ' </div>' +
        ' <div>' +
        '   <textarea style="height:100px;width:100%;" disabled>' + msg.body + '</textarea>' +
        ' </div>' +
        ' <div class="form-group">' +
        '   <textarea id="email-body" class="form-control" style="height:400px;">' +
        '\n\n\n' +
        '--------------------------------------------------------------------------\n' +
        'De: ' + fromName + '\n' +
        'Para: ' + toName + '\n' +
        'Fecha: ' + getFormattedDate(msg.date) + '\n' +
        msg.body +
        '   </textarea>' +
        ' </div>' +
        ' <div class="form-row  justify-content-between" style="margin-top: 20px">' +
        '   <div class="">' +
        '     <button class="btn btn-danger" id="email-cancel">Cancelar</button>' +
        '   </div>' +
        '   <div class="">' +
        '     <button class="btn btn-success" id="email-send" type="submit">Enviar</button>' +
        '   </div>' +
        ' </div>' +
        '</form>';

    return $(html);
}

function sendNewEmail(event) {
    try{
        event.preventDefault();
        let toValue = $("#email-to").val();
        let ccValue = $("#email-cc").val();
        let fromValue = Gb.globalState.users[0].uid;
        let title = $("#email-subject").val();
        let body = $("#email-body").val();
        toValue = toValue.concat(ccValue);
        let msg = new Gb.Message(Gb.Util.randomText(), new Date(), fromValue, toValue, [], title, body);
        Gb.send(msg).then(()=>{
            alert("¡Mensaje enviado!");
            updateEmailList();
            resetEmailInputs();
        });
    }catch(e){
        console.log(e);
    }
    
    
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

function showEmailView(e){
    if(e !== undefined) e.preventDefault();
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
        '<hr/>' +
        '<ul class="container-fluid mt-2"></ul>';
    $(".main-view .email-list").append($(html));
    updateEmailList();
}

function showReceivedEmail(elem){
    let msgid = $(elem).closest("li").data("id");
    if(!$(".email-list").hasClass("col-md-3")) $(".email-list").addClass("col-md-3");
    $(".email-container").empty().append(receivedEmailFormView(Gb.resolve(msgid)));
}

function showNewEmail(){
    if(!$(".email-list").hasClass("col-md-3")) $(".email-list").addClass("col-md-3");
    $(".main-view .email-container").empty().append(newEmailFormView());
    $('select').selectpicker();
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