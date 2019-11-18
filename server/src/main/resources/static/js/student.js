import * as Gb from './gbapi.js'

function showStudentView(){
    $(".main-view").empty().append(
        $(`<div class="student-list list container-fluid mt-2"></div><div class="student-container form-container mt-2"></div>`));
    showList();
}

function showList(){
    let html = `<div class="row justify-content-between container-fluid">
                    <button class="btn btn-primary" id="student-new">Nuevo Alumno</button>
                    <button class="btn btn-danger" id="student-delete">Eliminar Alumno</button>
                </div>
                <div class="row input-group container-fluid mt-2">
                    <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-search-students btn-outline-secondary" type="button">Buscar</button>
                    </div>
                </div>
                <ul class="container-fluid mt-2 list-group-flush list-group"></ul>
                <hr/>`;
    $(".main-view .student-list").append($(html));

    updateStudentList();
}

function updateStudentList(){
    try {
        let studentList = $(".student-list ul");
        studentList.empty();
        Gb.globalState.students.forEach( (s, index) =>  studentList.append( createStudentItem(s, index) ) );
    } catch (e) {
        console.log('Error actualizando', e);
    }

    $('.student-li').on('click', function(){

        let sid = $(this).data('sid'),
            firstName = $(this).data('firstName'),
            lastName = $(this).data('lastName'),
            cid = $(this).data('cid');

        let editForm = `<form class="student-edit-form">
                            <div class="form-group row">
                              <label for="sid" class="col-sm-2 col-form-label">DNI:</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="sid" placeholder="DNI">
                              </div>
                            </div>
                            <div class="form-group row">
                               <label for="firstName" class="col-sm-2 col-form-label">Nombre:</label>
                               <div class="col-sm-10">
                                 <input type="text" class="form-control" id="firstName" placeholder="Nombre">
                               </div>
                             </div>
                             <div class="form-group row">
                               <label for="lastName" class="col-sm-2 col-form-label">Apellido:</label>
                               <div class="col-sm-10">
                                 <input type="text" class="form-control" id="lastName" placeholder="Apellido">
                               </div>
                             </div>
                             <div class="form-group row">
                               <label for="cid" class="col-sm-2 col-form-label">Clase:</label>
                               <div class="col-sm-10">
                                 <input type="text" class="form-control" id="cid" placeholder="ID Clase">
                               </div>
                             </div>
                             <div class="form-row  justify-content-between" style="margin-top: 20px">
                               <div class="">
                                 <button class="btn btn-danger" id="student-edit" type="submit">Eliminar</button>
                               </div>
                               <div class="">
                                 <button class="btn btn-warning" id="student-delete" type="submit">Editar</button>
                               </div>
                             </div>
                        </form>`;

        $('.student-list').addClass('col-md-3');
        $('.main-view .student-container').empty().append(editForm);
    });
}

function createStudentItem(s, index){

    let html = `<li data-index="${index}" data-sid="${s.sid}" data-firstName="${s.firstName}" data-lastName="${s.lastName}" data-class="${s.cid}" class="row student-li list-group-item">
                  <div class="student-index" >${s.firstName} ${s.lastName} ( Class: ${s.cid} )</div>
                </li>`;

    $(".student-list").append(html);
}

function showNewStudent(){
    if(!$('.student-list').hasClass('col-md-3')){
        $('.student-list').addClass('col-md-3');
    }

    let newForm = `<form class="student-edit-form">
                            <div class="form-group row">
                              <label for="sid" class="col-sm-2 col-form-label">DNI:</label>
                              <div class="col-sm-10">
                                <input type="text" class="form-control" id="sid" placeholder="DNI">
                              </div>
                            </div>
                            <div class="form-group row">
                               <label for="firstName" class="col-sm-2 col-form-label">Nombre:</label>
                               <div class="col-sm-10">
                                 <input type="text" class="form-control" id="firstName" placeholder="Nombre">
                               </div>
                             </div>
                             <div class="form-group row">
                               <label for="lastName" class="col-sm-2 col-form-label">Apellido:</label>
                               <div class="col-sm-10">
                                 <input type="text" class="form-control" id="lastName" placeholder="Apellido">
                               </div>
                             </div>
                             <div class="form-group row">
                               <label for="cid" class="col-sm-2 col-form-label">Clase:</label>
                               <div class="col-sm-10">
                                 <input type="text" class="form-control" id="cid" placeholder="ID Clase">
                               </div>
                             </div>
                             <div class="form-row  justify-content-between" style="margin-top: 20px">
                               <div class="">
                                 <button class="btn btn-danger" id="student-edit" type="submit">Eliminar</button>
                               </div>
                               <div class="">
                                 <button class="btn btn-warning" id="student-delete" type="submit">Editar</button>
                               </div>
                             </div>
                        </form>`;

    $('.main-view .student-container').empty().append(newForm);
}

export {
    showStudentView
}
/**  OLD   **/

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