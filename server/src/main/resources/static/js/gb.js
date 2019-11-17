import * as Gb from './gbapi.js'
import * as email from './email.js'

function showSuperiorNavBar(){
  try {
    $(".superior-nav").empty().append(createSuperiorNavBar());
  } catch (e){
    console.log('Error actualizando', e);
  }
}

function createSuperiorNavBar(){
  let html = '';
  html += '<h1 class="navbar-brand">Garabatos</h1>' +
          '<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">' +
          '  <span class="navbar-toggler-icon"></span>' +
          '</button>' +
          '<div class="collapse navbar-collapse" id="navbarSupportedContent">' +
          '  <ul class="navbar-nav mr-auto">' +
          '    <li class="nav-item active">' +
          '      <a class="nav-link">Mensajes</a>' +
          '    </li>' +
          '    <li class="nav-item">' +
          '      <a class="nav-link" >Responsables </a>' +
          '    </li>' +
          '    <li class="nav-item">' +
          '      <a class="nav-link">Alumnos</a>' +
          '    </li>' +
          '    <li class="nav-item">' +
          '      <a class="nav-link">Profesores</a>' +
          '    </li>' +
          '    <li class="nav-item">' +
          '      <a class="nav-link">Clases</a>' +
          '    </li>' +
          '  </ul>' +
          '  <div class="form-inline">' +
          '    <button class="btn btn-warning" id="logout" type="submit">Cerrar sesión</button>' +
          '  </div>' +
          '</div>';

  return $(html);
}

function showLoginForm(){
  try {
    $(".superior-nav").empty().append($('<h1 class="navbar-brand">Garabatos</h1>'));
    $(".main-view").empty().append(loginForm());
  } catch (e){
    console.log('Error actualizando', e);
  }
}

function loginForm(){
  let html = '';
  html += '<div class="d-flex justify-content-center text-center">' +
          ' <form class="login">' +
          '   <div class="form-group">' +
          '     <label for="login-user">Usuario:</label>' +
          '     <input type="text" class="form-control" id="login-user" placeholder="Usario" required/>' +
          '   </div>' +
          '   <div class="form-group">' +
          '     <label for="login-password">Contraseña:</label>' +
          '     <input type="password" class="form-control" id="login-password" placeholder="Contraseña" required/>' +
          '   </div>' +
          '   <button class="btn btn-primary" id="login-submit" type="submit">Iniciar sesión</button>' +
          ' </form>' +
          '</div>';

  return $(html);
}

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
    if (student.sid === sid){
      resp = student;
    }
  });
  return resp;
}

function findStudent(sid){
  return Gb.globalState.students.findIndex(function(student){
    if(student.sid === sid) return student;
  });
}

function deleteStudentFromState(sid){
  let s = findStudent(sid);

  try {
    Gb.globalState.students.splice(s, 1);
    alert("El usuario se borro perfectamente");
  }catch(e){
    alert("No se ha podido borrar");
  }
}

function editStudentFromState(s) {

  let index = findStudent(s.sid);
  Gb.globalState.students[index].first_name = s.first_name;
  Gb.globalState.students[index].last_name = s.last_name;
  Gb.globalState.students[index].cid = s.cid;

}

function repaintStudents() {
  $(".student-list").empty();
  $.each(Gb.globalState.students, function (index, student) {
      createStudentItem(student);
  });

  //actionListener
  $(".student-index").on("click", function(event){
    let target = event.target,
        sid = target.id,
        student = getStudentFromState(sid),
        form = $(".student-opt-form-edit"),
        inputs = form.find(".form-control");

    $.each(inputs, function (index, input) {
      console.log("input",  input.id);
      let editId = input.id,
          id = editId.replace("edit-", "");
      let sele = $("input[id=" + editId + "]");
      sele.val(student[id]);
    });

    dispatchStudentView("student-opt-edit");
  });

}

function dispatchStudentView(div){
  let opts = $.find('.student-opt');
  $.each(opts, function (index, opt) {
    $(opt).hide();
  });
  $('.' + div).show();
}

function populateJson(){
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



  // muestra un mensaje de bienvenida
  console.log("online!", Gb.globalState);
  
  if($(".email-view").length > 0){
    console.log("update");
    updateEmailList();
  }

  /*#####################
  # Email
  #####################*/
  $(".main-view").on("click","button#email-send", function(event){
    email.sendNewEmail();
  });

  $(".main-view").on("click","button#email-cancel", function(event){
    email.resetEmailInputs(event);
  });

  $(".main-view").on("click","button#email-delete", function(){
    email.deleteEmail();
  });

  $(".main-view").on("click","span.email-fav-icon", function(){
    email.emailSetFav($(this));
  });

  $(".main-view").on("click","div.email-item", function(){
    email.showReceivedEmail($(this));
  });

  $(".main-view").on("click","button#email-new", function(){
    email.showNewEmail();
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
        input.value = "";
      });

      let s = new Gb.Student(param.sid, param.first_name, param.last_name, param.cid, [] );
      try {
        Gb.addStudent(s);
        createStudentItem(s);
        alert('El alumno se hacreado con exito');
      } catch (e) {
        alert('Alumno ya existe con ese ID');
      }
  });

  $(".student-index").on("click", function(event){
    let target = event.target,
        sid = target.id,
        student = getStudentFromState(sid),
        form = $(".student-opt-form-edit"),
        inputs = form.find(".form-control");

    $.each(inputs, function (index, input) {
      console.log("input",  input.id);
      let editId = input.id,
          id = editId.replace("edit-", "");
      let sele = $("input[id=" + editId + "]");
      sele.val(student[id]);
    });

    dispatchStudentView("student-opt-edit");
  });

  $("#btn-student-delete").on("click", function (event) {
      event.preventDefault();
      let sid = $("input#edit-sid").val();
      deleteStudentFromState(sid);
      repaintStudents();
  });

  $("#btn-student-edit").on("click", function (event) {
    event.preventDefault();
    //button get cosas blablabla
    let sid         = $("input#edit-sid").val();
    let first_name  = $("input#edit-first_name").val();
    let last_name   = $("input#edit-last_name").val();
    let cid         = $("input#edit-cid").val();
    let s = new Gb.Student(sid, first_name, last_name, cid, [] );
    editStudentFromState(s);
    repaintStudents();
  });

  repaintStudents();

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

  /*#####################
  # Login
  #####################*/

  $(".main-view").on("click","button#login-submit", e=>{
    e.preventDefault();
    let user = $("#login-user").val();
    let password = $("#login-password").val();

    Gb.login(user, password).then(d =>{
      if(d !== undefined){
        showSuperiorNavBar();
        email.showEmailView();
      }
      else{
        console.log("error");
      }
    })
  });

  /*#####################
  # Logout
  #####################*/

  $(".superior-nav").on("click","button#logout", e=>{
    e.preventDefault();
    if(confirm("¿Quieres cerrar la sesión?")){
      Gb.logout().then(d =>{
        if(d !== undefined){
          showLoginForm();
        }
        else{
          console.log("error");
        }
      })
    }
  });

});