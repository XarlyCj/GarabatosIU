import * as Gb from './gbapi.js'
import * as email from './email.js'
import * as student from './student.js'
import * as teacher from './teachers.js'
import * as responsible from './responsible.js'
import * as clases from './class.js'



function showSuperiorNavBar(){
  try {
    $(".superior-nav").empty().append( createSuperiorNavBar() );
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
          '    <li class="nav-item nav-email active">' +
          '      <a class="nav-link ">Mensajes</a>' +
          '    </li>' +
          '    <li class="nav-item nav-responsible">' +
          '      <a class="nav-link" >Responsables </a>' +
          '    </li>' +
          '    <li class="nav-item nav-student">' +
          '      <a class="nav-link">Alumnos</a>' +
          '    </li>' +
          '    <li class="nav-item nav-teacher">' +
          '      <a class="nav-link">Profesores</a>' +
          '    </li>' +
          '    <li class="nav-item nav-class">' +
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

function addLoader(elem){
  console.log("elem", elem);
  $(elem).append($('<div class="spinner-border ml-1 spinner-border-sm" role="status" aria-hidden="true"></div>'))
  .prop("disabled", true);
}

function removeLoader(elem){
  if($(elem).is(":disabled")){
    $(elem).find("div.spinner-border").remove()
    .prop("disabled", false);
  }
}
  

// funcion para generar datos de ejemplo: clases, mensajes entre usuarios, ...
// se puede no-usar, o modificar libremente
async function populate(classes, minStudents, maxStudents, minParents, maxParents, msgCount) {
  const U = Gb.Util;

  // genera datos de ejemplo
  let classIds = classes || ["1A", "1B"];
  let minStudentsInClass = minStudents || 2;
  let maxStudentsInClass = maxStudents || 5;
  let minParentsPerStudent = minParents || 1;
  let maxParentsPerStudent = maxParents || 3;
  let userIds = [];
  let tasks = [];

  classIds.forEach(cid => {
    tasks.push(() => Gb.addClass(new Gb.EClass(cid)));
    let teacher = U.randomUser(Gb.UserRoles.TEACHER, [cid]);
    userIds.push(teacher.uid);
    tasks.push(() => Gb.addUser(teacher));

    let students = U.fill(U.randomInRange(minStudentsInClass, maxStudentsInClass), () => U.randomStudent(cid));
    students.forEach(s => {
      tasks.push(() => Gb.addStudent(s));
      let parents = U.fill(U.randomInRange(minParentsPerStudent, maxParentsPerStudent),
        () => U.randomUser(Gb.UserRoles.GUARDIAN, [], [s.sid]));
      parents.forEach( p => {
        userIds.push(p.uid);
        tasks.push(() =>  Gb.addUser(p));
      });
    });
  });
  tasks.push(() => Gb.addUser(U.randomUser(Gb.UserRoles.ADMIN)));
  U.fill(msgCount, () => U.randomMessage(userIds)).forEach(m => tasks.push(() => Gb.send(m)));

  // los procesa en secuencia contra un servidor
  for (let t of tasks) {
    try {
        console.log("Starting a task ...");
        await t().then(console.log("task finished!"));
    } catch (e) {
        console.log("ABORTED DUE TO ", e);
    }
  }
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

  /*#####################
   # NAVBAR
   #####################*/
  $('.superior-nav').on('click', '.nav-email', e => {
    email.showEmailView(e);
    $(".superior-nav .nav-item.active").removeClass("active");
    $(".superior-nav .nav-item.nav-email").addClass("active");
  });

  $('.superior-nav').on("click",'.nav-responsible', e => {
    responsible.showResponsibleView(e);
    $(".superior-nav .nav-item.active").removeClass("active");
    $(".superior-nav .nav-item.nav-responsible").addClass("active");
  });

  $('.superior-nav').on('click','.nav-student', e => {
    student.showStudentView(e);
    $(".superior-nav .nav-item.active").removeClass("active");
    $(".superior-nav .nav-item.nav-student").addClass("active");
  });

  $('.superior-nav').on('click','.nav-teacher', e => {
    teacher.showTeacherView(e);
    $(".superior-nav .nav-item.active").removeClass("active");
    $(".superior-nav .nav-item.nav-teacher").addClass("active");
  });

  $('.superior-nav').on('click','.nav-class', e => {
  clases.showClassesView(e);
    $(".superior-nav .nav-item.active").removeClass("active");
    $(".superior-nav .nav-item.nav-class").addClass("active");
  });
  /*#####################
  # Email
  #####################*/
  $(".main-view").on("submit","form.email-new-form", function(event){
    email.sendNewEmail(event);
  });

  $(".main-view").on("submit","form.email-received-form", function(event){
    email.answerEmail(event);
  });

  $(".main-view").on("click","button#email-cancel", function(event){
    email.showEmailView(event);
  });

  $(".main-view").on("click","button#email-delete", function(){
    email.deleteEmail();
  });

  $(".main-view").on("click","div.email-fav-icon", function(){
    email.emailSetFav($(this));
  });

  $(".main-view").on("click","div.email-item", function(){
    email.showReceivedEmail($(this));
  });

  $(".main-view").on("click","button#email-new", function(){
    email.showNewEmail();
  });

  $(".main-view").on("click","button#email-search", function(){
    email.searchEmail();
  });

  $(".main-view").on("keyup","input#email-searcher", function(event){
    if (event.keyCode === 13)
      email.searchEmail();
  });

  $(".main-view").on("click","button.email-filter", function(){
    email.filterList($(this));
  });

  /*#####################
  # Student
  #####################*/
  
  $(".main-view").on("submit", "form.student-create-form", e=>{
    student.createStudent(e);
  });

  $(".main-view").on("click", "button#student-delete", e=>{
    student.deleteStudent(e);
  });

  $(".main-view").on("submit", "form.student-edit-form", e=>{
    student.editStudent(e);
  });
  
  /*#####################
  # Responsible
  #####################*/
  
  $(".main-view").on("submit", "form.responsible-create-form", e=>{
    responsible.createResponsible(e);
  });

  $(".main-view").on("click", "button#responsible-delete", e=>{
    responsible.deleteResponsible(e);
  });

  $(".main-view").on("submit", "form.responsible-edit-form", e=>{
    responsible.editResponsible(e);
  });

  $(".main-view").on("click","button#student-search", function(){
    student.searchStudent();
  });

  $(".main-view").on("keyup","input#student-search-input", function(event){
    if (event.keyCode === 13)
      student.searchStudent();
  });

  /*#####################
  # Teacher
  #####################*/
  
  $(".main-view").on("submit", "form.teacher-create-form", e=>{
    teacher.createTeacher(e);
  });

  $(".main-view").on("click", "button#teacher-delete", e=>{
    teacher.deleteTeacher(e);
  });

  $(".main-view").on("submit", "form.teacher-edit-form", e=>{
    teacher.editTeacher(e);
  });

  $(".main-view").on("click","button#teacher-search", function(){
    teacher.searchTeacher();
  });

  $(".main-view").on("keyup","input#teacher-search-input", function(event){
    if (event.keyCode === 13)
    teacher.searchTeacher();
  });

  /*#####################
  # Classes
  #####################*/
  
  $(".main-view").on("submit", "form.classes-create-form", e=>{
    clases.createClasses(e);
  });

  $(".main-view").on("click", "button#classes-delete", e=>{
    clases.deleteClasses(e);
  });

  $(".main-view").on("submit", "form.classes-edit-form", e=>{
    clases.editClasses(e);
  });
  /*#####################
  # Login
  #####################*/

  $(".main-view").on("submit","form.login", e=>{
    e.preventDefault();
    let user = $("#login-user").val();
    let password = $("#login-password").val();
    let elem = $(this).find("button#login-submit");
    addLoader(elem);
    Gb.login(user, password).then(d =>{
      if(d !== undefined){
          if(Gb.globalState.classes.length == 0) {
            populate(["1A", "1B"], 2, 4, 1, 3, 0).then(()=>{
              showSuperiorNavBar();
              email.showEmailView();
            })
          }else{
            showSuperiorNavBar();
            email.showEmailView();
          }
            
      }
      else{
        console.log("error");
        removeLoader(elem);
      }
    })
    
    /*.catch(e=>{
      removeLoader(elem);
      $(".main-view").append($("<p class='text-danger justify-content-center d-flex'>Datos de acceso incorrectos</p>"));
    });*/
  });

  /*#####################
  # Logout
  #####################*/

  $(".superior-nav").on("click","button#logout", e=>{
    e.preventDefault();
    if(confirm("¿Quieres cerrar la sesión?")){
      try{
        Gb.logout();
        showLoginForm();
      }catch(e){
        console.log("error", e);
      }
    }
  });

});