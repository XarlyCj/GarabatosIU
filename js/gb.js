import * as Gb from './gbapi.js'

function createEmailItem(mensaje, index) {
  let fav = '';
  if(mensaje.labels.includes("fav")) fav = ' font-weight-bold text-warning';
  let read = 'bold';
  if(mensaje.labels.includes("read")) read = 'light';
  let html = '';
  html += '<tr data-id=' + mensaje.msgid + '>' +
          ' <td class="align-middle h3 email-fav-icon' + fav + '">☆</td>' +
          ' <td class="font-weight-' + read + ' email-item">' +
          '   <p class="h5">' + mensaje.from + '</p>' +
          '   <p class="h7">' + mensaje.title + '</p>' +
          ' </td>' +
          ' <td class="align-middle">' +
          '   <div class="form-check float-right">' +
          '     <input class="form-check-input" type="checkbox" value="" id="defaultCheck' + index + '">' +
          '   </div>' +
          ' </td>' +
          '</tr>';


  return $(html);
}

function emailSetFav(elem){
  let msgid = $(elem).closest("tr").data("id");
  // Falta implementación API
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
    // vaciamos un contenedor
    $(".email-list tbody").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    Gb.globalState.messages.forEach((m, index) =>  $(".email-list tbody").append(createEmailItem(m, index)));
    
    $(".email-fav-icon").on("click", function(){
      emailSetFav($(this));
    })
    $(".email-item").on("click", function(){
      let msgid = $(this).closest("tr").data("id");
      $(".email-container").empty().append(receivedEmailFormView(Gb.globalState.messages.find(m => { 
        if(m.msgid == msgid) return m; 
      })));
      $("#email-send").on("click", function(event){
        answerEmail(event);
      })
      $("#email-cancel").on("click", function(event){
        event.preventDefault();
        if(confirm("¿Desea cancelar?"))
          $(".email-container").empty();
      })
    })
    // y asi para cada cosa que pueda haber cambiado
  } catch (e) {
    console.log('Error actualizando', e);
  }
}

function resetEmailInputs() {
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

//
//
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
// Generalmente de la forma $("selector").comportamiento(...)
//
//
$(function() { 

  // expone Gb para que esté accesible desde la consola
  window.Gb = Gb;
  const U = Gb.Util;

  // genera datos de ejemplo
  let classIds = ["1A", "1B", "2A", "2B", "3A", "3B"];
  let userIds = [];
  classIds.forEach(cid => {
    let teacher = U.randomUser(Gb.UserRoles.TEACHER, [cid]);
    Gb.addUser(teacher);
    userIds.push(teacher.uid);

    let students = U.fill(U.randomInRange(15,20), () => U.randomStudent(cid));

    students.forEach(s => {
      Gb.addStudent(s);           

      let parents = U.fill(U.randomInRange(1,2), 
        () => U.randomUser(Gb.UserRoles.GUARDIAN, [cid], [s.sid]));
      parents.forEach( p => {
        s.guardians.push(p.uid);
        userIds.push(p.uid);
        Gb.addUser(p);
      });      
    });

    Gb.addClass(new Gb.EClass(cid, students.map(s => s.sid), [teacher.uid]));
  });
  Gb.addUser(U.randomUser(Gb.UserRoles.ADMIN));
  //console.log(userIds);
  U.fill(30, () => U.randomMessage(userIds)).forEach( 
    m => Gb.send(m)
  );

  // muestra un mensaje de bienvenida
  console.log("online!", Gb.globalState);
  
  if($(".email-view").length > 0){
    console.log("update");
    updateEmailList();
  }

  $("#email-delete").on("click", function(){
    if($(".email-list table input[type='checkbox']:checked").length > 0){
      $(".email-list table input[type='checkbox']:checked").each(function(index, element){
        console.log($(element).closest("tr").data("id"));
        Gb.rm($(element).closest("tr").data("id"));
      })
      updateEmailList();
    }
    else{
      alert("Selecciona al menos un mensaje");
    }
  })

  $("#email-new").on("click", function(){
    $(".email-container").empty().append(newEmailFormView());
    $("#email-send").on("click", function(event){
      sendNewEmail(event);
    })
    $("#email-cancel").on("click", function(event){
      event.preventDefault();
      if(confirm("¿Desea cancelar?"))
        resetEmailInputs();
    })
  })

});

