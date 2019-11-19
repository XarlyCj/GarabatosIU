import * as Gb from './gbapi.js'

function showStudentView(){
    $(".main-view").empty().append(
        $(`<div class="student-list list container-fluid mt-2"></div><div class="student-container form-container mt-2"></div>`));
    showList();
}

function createStudentItem(s, index){
    let guardians = s.guardians.map(g=>{
      return Gb.resolve(g).first_name + " " + Gb.resolve(g).last_name;
    });
    let html = `<li data-index="${index}" data-sid="${s.sid}" data-firstname="${s.firstName}" data-lastname="${s.lastName}" data-cid="${s.cid}" class="row student-li">
                  <div class="student-index item col-md-3" >${s.firstName} ${s.lastName} </div>
                  <div class="student-index item col-md-3"> Clase: ${s.cid}</div>
                  <div class="student-index item col-md-6"> Responsables: ${guardians.join(",")}</div>
                </li>
                <hr/>`;

    $(".student-list ul").append(html);
}

function showList(){
    let html = `<div class="row justify-content-between container-fluid">
                    <button class="btn btn-primary" id="student-new">Nuevo Alumno</button>
                    <button class="btn btn-danger" id="student-delete-massive">Eliminar Alumno</button>
                </div>
                <div class="row input-group container-fluid mt-2">
                    <input type="text" class="form-control" id="student-search-input" placeholder="Buscar Alumno" aria-label="Buscar Alumno" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" id="student-search" type="button">Buscar</button>
                    </div>
                </div>
                <hr/>
                <ul class="container-fluid mt-2"></ul>`;

    $(".main-view .student-list").append($(html));

    $('#student-new').on('click', event => {

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

function searchStudent(){
  let filter = $("#student-search-input").val();
  let result = Gb.globalState.students.filter(s => {
      if(s.firstName.toLowerCase().includes(filter) || s.lastName.toLowerCase().includes(filter) || s.cid.includes(filter) || s.guardians.includes(filter)) return true;
      else return false;
  });
  updateStudentList(result);
}

function updateStudentList(students){

    try{

        let studentList = $(".student-list ul");
        studentList.empty();

        if(students === undefined){
            Gb.globalState.students.forEach( (s, index) =>  studentList.append( createStudentItem(s, index) ) );
        }else{
            students.forEach( (s, index) =>  studentList.append( createStudentItem(s, index) ) );
        }

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

function searchStudents(string){
    let students = [];
    Gb.globalState.students.forEach( (student, index) => {
        $.each(student, (key, val) => {
            console.log("val", val, "string", string);
            let flag = false;
            if( val.includes(string) && !flag ){
                students.push(student);
                flag = true;
            }
        })
    });
    return students;
}

function createStudent(event){
  event.preventDefault();
  let param = {},
      inputs = $('.student-create-form .form-control');

  $.each(inputs, function (key, input) {
      param[input.id] = input.value;
      input.value = '';
  });

  let s = new Gb.Student(param.sid, param.firstName, param.lastName, param.cid, [] );
  try {
      Gb.addStudent(s).then(()=> {
        alert('El alumno se ha creado con exito');
        updateStudentList(); 
      });
      
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
    editStudent,
    searchStudent
}