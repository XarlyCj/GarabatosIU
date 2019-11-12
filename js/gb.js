import * as Gb from './gbapi.js'

function updateResponsibleList(){
  try {
    // vaciamos un contenedor
    $(".responsible-list tbody").empty();
    // y lo volvemos a rellenar con su nuevo contenido
    Gb.globalState.users.forEach((u, index) =>  {
      if(u.type == "guardian")
        $(".responsible-list tbody").append(createResponsibleItem(u, index));
    });
    
    $(".responsible-item").on("click", function(){
      let uid = $(this).closest("tr").data("id");
      $(".responsible-container").empty().append(editResponsibleFormView(Gb.globalState.users.find(u => { 
        if(u.uid == uid) return u; 
      })));
      $("#responsible-edit-save").on("click", function(event){
        editResponsible(event);
      })
      $("#responsible-edit-cancel").on("click", function(event){
        event.preventDefault();
        if(confirm("¿Desea cancelar?"))
          $(".responsible-container").empty();
      })
    })
    // y asi para cada cosa que pueda haber cambiado
  } catch (e) {
    console.log('Error actualizando', e);
  }
}

function createResponsibleItem(user, index) {
  let html = '';
  html += '<tr data-id=' + user.uid + '>' +
          ' <td colspan="2" class="h5 responsible-item">' +
          user.last_name + ', ' + user.first_name + 
          ' </td>' +
          ' <td class="align-middle">' +
          '   <div class="form-check float-right">' +
          '     <input class="form-check-input" type="checkbox" value="" id="defaultCheck' + index + '">' +
          '   </div>' +
          ' </td>' +
          '</tr>';

  return $(html);
}

function newResponsibleFormView(){
  let html = '';
  html += '<form class="responsible-new-form">' +
          ' <div class="form-group">' +
          '   <label for="responsible-first_name">Nombre:</label>' +
          '   <input type="text" class="form-control" id="responsible-first_name" placeholder="Nombre">' +
          ' </div>' +
          ' <div class="form-group">' +
          '    <label for="responsible-last_name">Apellidos:</label>' +
          '    <input type="text" class="form-control" id="responsible-last_name" placeholder="Apellidos">' +
          '  </div>' +
          '  <div class="form-group">' +
          '    <label for="responsible-phone">Teléfono:</label>' +
          '    <input type="text" class="form-control" id="responsible-phone" placeholder="Teléfono">' +
          '  </div>' +
          '  <div class="form-group">' +
          '    <label for="responsible-students">Alumnos:</label>' +
          '    <input type="text" class="form-control" id="responsible-students" placeholder="Nombre y apellidos de cada alumno">' +
          '    <small class="text-muted">En caso de ser mas de uno insertalos mediante comas.</small>' +
          '  </div>' +
          '  <div class="form-row  justify-content-between" style="margin-top: 20px">' +
          '    <div class="">' +
          '      <button class="btn btn-danger" id="responsible-new-cancel" type="submit">Cancelar</button>' +
          '    </div>' +
          '    <div class="">' +
          '      <button class="btn btn-success" id="responsible-new-save" type="submit">Enviar</button>' +
          '    </div>' +
          '  </div>' +
          '</form>'
  return $(html);
}

function editResponsibleFormView(user){
  let html = '';
  html += '<form class="responsible-new-form">' +
          ' <div class="form-group">' +
          '   <label for="responsible-first_name">Nombre:</label>' +
          '   <input type="text" class="form-control" id="responsible-first_name" value="' + user.first_name + '" placeholder="Nombre">' +
          ' </div>' +
          ' <div class="form-group">' +
          '    <label for="responsible-last_name">Apellidos:</label>' +
          '    <input type="text" class="form-control" value="' + user.last_name + '" id="responsible-last_name" placeholder="Apellidos">' +
          '  </div>' +
          '  <div class="form-group">' +
          '    <label for="responsible-phone">Teléfono:</label>' +
          '    <input type="text" class="form-control" value="' + user.tels + '" id="responsible-phone" placeholder="Teléfono">' +
          '  </div>' +
          '  <div class="form-group">' +
          '    <label for="responsible-students">Alumnos:</label>' +
          '    <input type="text" class="form-control" value="' + user.students.join(",") + '(Hay que implementar una función para recorrer los array y montar nombres y apellidos)' + '" id="responsible-students" placeholder="Nombre y apellidos de cada alumno">' +
          '    <small class="text-muted">En caso de ser mas de uno insertalos mediante comas.</small>' +
          '  </div>' +
          '  <div class="form-row  justify-content-between" style="margin-top: 20px">' +
          '    <div class="">' +
          '      <button class="btn btn-danger" id="responsible-edit-cancel" type="submit">Cancelar</button>' +
          '    </div>' +
          '    <div class="">' +
          '      <button class="btn btn-success" id="responsible-edit-save" type="submit">Enviar</button>' +
          '    </div>' +
          '  </div>' +
          '</form>'
  return $(html);
}

function createResponsible(event) {
  event.preventDefault();
  let first_name = $("#responsible-first_name").val();
  let last_name = $("#responsible-last_name").val();
  let phone = $("#responsible-phone").val();
  let students = $("#responsible-students").val();
  students = students.split(",");
  // Implementar función que busque los ids por nombre y devuelva un array
  let user = new Gb.User(Gb.Util.randomText(), "guardian", first_name, last_name, phone, null, students);
  Gb.addUser(user);
  alert("Responsable creado!");
  updateResponsibleList();
  resetResponsibleInputs();
}

function resetResponsibleInputs() {
  $("#responsible-first_name").val("");
  $("#responsible-last_name").val("");
  $("#responsible-phone").val("");
  $("#responsible-students").val("");
}

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

// Student
function createStudentItem(s){
  let html = `<tr>
                  <td><div id="${s.sid}" class="student-index" >${s.first_name} ${s.last_name} ( Class: ${s.cid} )</div></td>
              </tr>`;
  $(".student-list").append(html);
}

function getStudentFromState(sid){
  let resp = undefined;
  $.each(Gb.globalState.students, function (index, student) {
    console.log(student.sid + " == " + sid);
    if (student.sid == sid){
      resp = student;
    }
  });
  return resp;
}

function deleteStudentFromState(sid){
  $.each(Gb.globalState.students, function (index, student) {
    if (student.sid == sid){
      console.log(student);
      Gb.globalState.students.splice(index, 1);
    }
  });
}

function editStudentFromState(s) {
  $.each(Gb.globalState.students, function (index, student) {
    if (student.sid == s.sid){
      student.first_name = s.first_name;
      student.last_name = s.last_name;
      student.cid = s.cid;
    }
  });
}

function repaintStudents() {
  $(".student-list").empty();
  $.each(Gb.globalState.students, function (index, student) {
      createStudentItem(student);
  });
}

function dispatchStudentView(div){
  let opts = $.find('.student-opt');
  $.each(opts, function (index, opt) {
    $(opt).hide();
  });
  $('.' + div).show();
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

  /*#####################
  # Email
  #####################*/
  $("#email-send").on("click", function(event){
    event.preventDefault();
    let toValue = $("#email-to").val();
    let ccValue = $("#email-cc").val();
    let fromValue = "yo";
    let title = $("#email-subject").val();
    let body = $("#email-body").val();
    ccValue = ccValue.split(",");
    toValue = toValue.split(",");
    toValue = toValue.concat(ccValue);

    let msg = new Gb.Message(
      Gb.Util.randomText(),
      new Date(),
      fromValue,
      toValue,
      ["sent"],
      title,
      body
    );

    Gb.send(msg);
    alert("¡Mensaje enviado!");
    updateEmailList();

    resetEmailInputs();

  });

  $("#email-cancel").on("click", function(event){
    event.preventDefault();
    resetEmailInputs();
  });

  $("#email-delete").on("click", function(){
    if($(".email-list table input[type='checkbox']:checked").length > 0){
      if(confirm("¿Seguro que desea borrar los mensajes?")){
        $(".email-list table input[type='checkbox']:checked").each(function(index, element){
          console.log($(element).closest("tr").data("id"));
          Gb.rm($(element).closest("tr").data("id"));
        })
        updateEmailList();
      }
    }
    else{
      alert("Selecciona al menos un mensaje");
    }
  });

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

  });

  /*#####################
  # Student
  #####################*/
  $(".btn-student-form").on("click", function(){
    dispatchStudentView("student-opt-form");
  });

  $("#btn-student-send").on("click", function(event){

      event.preventDefault();
      let form = $(".student-form-create");
      let inputs = form.find(".form-control");
      let param = {};

      $.each(inputs,function (key, input) {
        param[input.id] = input.value;
      });

      let s = new Gb.Student(param.sid, param.first_name, param.last_name, param.cid, [] );
      try {
        Gb.addStudent(s);
        createStudentItem(s);
      } catch (e) {
        alert('Alumno ya existe con ese ID');
      }
  });

  $(".student-list").on("click", function(event){
    let target = event.target,
        sid = target.id,
        student = getStudentFromState(sid),
        form = $(".student-opt-form-edit"),
        inputs = form.find(".form-control");

    console.log(inputs);

    $.each(inputs, function (index, input) {
      console.log("input",  input.id);
      let editId = input.id,
          id = editId.replace("edit-", "");
      let sele = $("input[id=" + editId + "]");
      console.log(sele);
      sele.val(student[id]);
    });

    dispatchStudentView("student-opt-edit");
  });

  $("#btn-student-delete").on("click", function (event) {
      event.preventDefault();
      let sid = $("input[id='edit-sid']").value;
      deleteStudentFromState(sid);
      repaintStudents();
  });

  $("#btn-student-edit").on("click", function (event) {
    event.preventDefault();
    //button get cosas blablabla
    let sid = $("input[id='edit-sid']").value;
    let first_name = $("input[id='edit-first_name']").value;
    let last_name = $("input[id='edit-last_name']").value;
    let cid = $("input[id='edit-cid']").value;
    console.log(sid, first_name, last_name, cid);
    let s = new Gb.Student(sid, first_name, last_name, cid, [] );
    editStudentFromState(s);
    repaintStudents();
  })

  /*#####################
  # Responsible
  #####################*/
  if($(".responsible-view").length > 0){
    console.log("update responsibles");
    updateResponsibleList();
  }

  $("#responsible-delete").on("click", function(){
    if($(".responsible-list table input[type='checkbox']:checked").length > 0){
      if(confirm("¿Seguro que desea borrar los responsables?")){
        $(".responsible-list table input[type='checkbox']:checked").each(function(index, element){
          console.log($(element).closest("tr").data("id"));
          Gb.rm($(element).closest("tr").data("id"));
        })
        updateResponsibleList();
      }
    }
    else{
      alert("Selecciona al menos un responsable");
    }
  });

  $("#responsible-new").on("click", function(){

    $(".responsible-container").empty().append(newResponsibleFormView());

    $("#responsible-new-save").on("click", function(event){
      createResponsible(event);
    })

    $("#responsible-new-cancel").on("click", function(event){
      event.preventDefault();
      if(confirm("¿Desea cancelar?"))
        resetResponsibleInputs();
    })

  });

});