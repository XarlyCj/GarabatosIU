import * as Gb from './gbapi.js'

console.log(Gb.globalState);

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