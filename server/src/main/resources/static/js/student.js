import * as Gb from './gbapi.js'

function showStudentView(){
    $(".main-view").empty().append(
        $(`<div class="student-list list container-fluid mt-2"></div><div class="student-container form-container mt-2"></div>`));
    showList();
}

function createStudentItem(s, index){

    let html = `<li data-index="${index}" data-sid="${s.sid}" data-firstname="${s.firstName}" data-lastname="${s.lastName}" data-cid="${s.cid}" class="row student-li list-group-item">
                  <div class="student-index" >${s.firstName} ${s.lastName} ( Class: ${s.cid} )</div>
                </li>`;

    $(".student-list ul").append(html);
}

function showList(){
    let html = `<div class="row justify-content-between container-fluid">
                    <button class="btn btn-primary" id="student-new">Nuevo Alumno</button>
                    <button class="btn btn-danger" id="student-delete-massive">Eliminar Alumno</button>
                </div>
                <div class="row input-group container-fluid mt-2">
                    <input type="text" class="form-control" placeholder="Buscar Alumno" aria-label="Buscar Alumno" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-search-students btn-outline-secondary" type="button">Buscar</button>
                    </div>
                </div>
                <ul class="container-fluid mt-2 list-group-flush list-group"></ul>`;

    $(".main-view .student-list").append($(html));

    $('#student-new').on('click', function (event) {

        if(!$('.student-list').hasClass('col-md-3')){
            $('.student-list').addClass('col-md-3');
        }

        let newForm = `<div style='padding: 89px;'>
                        <form class='student-create-form'>
                            <div class='form-group row'>
                              <label for='sid' class='col-sm-2 col-form-label'>DNI:</label>
                              <div class='col-sm-10'>
                                <input type='text' class='form-control' id='sid' placeholder='DNI'>
                              </div>
                            </div>
                            <div class='form-group row'>
                               <label for='firstName' class='col-sm-2 col-form-label'>Nombre:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='firstName' placeholder='Nombre'>
                               </div>
                             </div>
                             <div class='form-group row'>
                               <label for='lastName' class='col-sm-2 col-form-label'>Apellido:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='lastName' placeholder='Apellido'>
                               </div>
                             </div>
                             <div class='form-group row'>
                               <label for='cid' class='col-sm-2 col-form-label'>Clase:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='cid' placeholder='ID Clase'>
                               </div>
                             </div>
                             <div class='form-row  justify-content-between' style='margin-top: 20px'>
                               <div class=''>
                                 <button class='btn btn-success' id='student-create' type="submit">Crear</button>
                               </div>
                             </div>
                        </form>
                      </div>`;

        $('.main-view .student-container').empty().append(newForm);
    });

    updateStudentList();
}

function updateStudentList(){
    try {
        $(".student-list ul").empty();
        Gb.globalState.students.forEach( (s, index) =>  $(".student-list ul").append( createStudentItem(s, index) ) );
    } catch (e) {
        console.log('Error actualizando', e);
    }

    $('.student-li').on('click', function(){

        let sid = $(this).data('sid'),
            firstName = $(this).data('firstname'),
            lastName = $(this).data('lastname'),
            cid = $(this).data('cid');

        let editForm = `<div style="padding: 89px;">
                            <form class="student-edit-form">
                                <input type="hidden" value="${sid}">
                                <div class="form-group row">
                                  <label for="sid" class="col-sm-2 col-form-label">DNI:</label>
                                  <div class="col-sm-10">
                                    <input type="text" class="form-control" id="sid" value="${sid}">
                                  </div>
                                </div>
                                <div class="form-group row">
                                   <label for="firstName" class="col-sm-2 col-form-label">Nombre:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="firstName" value="${firstName}">
                                   </div>
                                 </div>
                                 <div class="form-group row">
                                   <label for="lastName" class="col-sm-2 col-form-label">Apellido:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="lastName" value="${lastName}">
                                   </div>
                                 </div>
                                 <div class="form-group row">
                                   <label for="cid" class="col-sm-2 col-form-label">Clase:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="cid" value="${cid}">
                                   </div>
                                 </div>
                                 <div class="form-row  justify-content-between" style="margin-top: 20px">
                                   <div class="">
                                     <button class="btn btn-danger" id="student-delete">Eliminar</button>
                                   </div>
                                   <div class="">
                                     <button class="btn btn-warning" id="student-edit" type="submit">Editar</button>
                                   </div>
                                 </div>
                            </form>
                        </div>`;

        $('.student-list').addClass('col-md-3');
        $('.main-view .student-container').empty().append(editForm);
    });
}

function createStudent(event){
  event.preventDefault();
  let param = {},
      inputs = $('.student-create-form .form-control');

  $.each(inputs, function (key, input) {
      param[input.id] = input.value;
      input.value = '';
  });

  let s = new Gb.Student(param.sid, param.first_name, param.last_name, param.cid, [] );
  try {
      Gb.addStudent(s).then( updateStudentList() );
      alert('El alumno se ha creado con exito');
  } catch (e) {
      alert('Alumno ya existe con ese ID');
  }
}

function deleteStudent(event){
  event.preventDefault();
  if(confirm("¿Seguro que desea borrar este alumno?")){
    let sid =  $('input[type=hidden]').val()
    Gb.rm(sid).then( updateStudentList() );
  }
}

function editStudent(event){
  event.preventDefault();
  let sid         = $('input#sid').val();
  let first_name  = $('input#firstname').val();
  let last_name   = $('input#lastname').val();
  let cid         = $('input#cid').val();
  let s = new Gb.Student(sid, first_name, last_name, cid, [] );
  Gb.set(s).then( updateStudentList() );
}

export {
    showStudentView,
    createStudent,
    deleteStudent,
    editStudent
}