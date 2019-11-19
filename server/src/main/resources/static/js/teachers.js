import * as Gb from './gbapi.js'

function showTeacherView(){
    $(".main-view").empty().append(
        $(`<div class="teacher-list list container-fluid mt-2"></div><div class="teacher-container form-container mt-2"></div>`));
    showList();
}

function createTeacherItem(t, index){

    let html = `<li data-index="${index}" data-uid="${t.uid}" data-firstname="${t.first_name}" data-lastname="${t.last_name}" data-tels="${t.tels}" data-classes="${t.classes}" class="row teacher-li list-group-item">
                  <div class="teacher-index" > ${t.first_name} ${t.last_name} </div>
                </li>`;

    $(".teacher-list").append(html);
}

function showList(){
    let html = `<div class="row justify-content-between container-fluid">
                    <button class="btn btn-primary" id="teacher-new">Nuevo Profesor</button>
                    <button class="btn btn-danger" id="teacher-delete-massive">Eliminar Profesor</button>
                </div>
                <div class="row input-group container-fluid mt-2">
                    <input type="text" class="form-control" placeholder="Buscar Profesor" aria-label="Buscar Profesor" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-search-teachers btn-outline-secondary" type="button">Buscar</button>
                    </div>
                </div>
                <ul class="container-fluid mt-2 list-group-flush list-group"></ul>
                <hr/>`;

    $(".main-view .teacher-list").append($(html));

    $('#teacher-new').on('click', function (event) {

        if(!$('.teacher-list').hasClass('col-md-3')){
            $('.teacher-list').addClass('col-md-3');
        }

        let newForm = `<div style='padding: 89px;'><form class='teacher-create-form'>
                            <div class='form-group row'>
                              <label for='uid' class='col-sm-2 col-form-label'>DNI:</label>
                              <div class='col-sm-10'>
                                <input type='text' class='form-control' id='uid' placeholder='DNI'>
                              </div>
                            </div>
                            <div class='form-group row'>
                               <label for='first_name' class='col-sm-2 col-form-label'>Nombre:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='first_name' placeholder='Nombre'>
                               </div>
                             </div>
                             <div class='form-group row'>
                               <label for='last_name' class='col-sm-2 col-form-label'>Apellido:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='last_name' placeholder='Apellido'>
                               </div>
                             </div>
                             <div class='form-group row'>
                               <label for='tels' class='col-sm-2 col-form-label'>Telefono:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='tels' placeholder='Telefonos'>
                               </div>
                             </div>
                             <div class='form-group row'>
                               <label for='classes' class='col-sm-2 col-form-label'>Clases:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='classes' placeholder='ID Clases'>
                               </div>
                             </div>
                             <div class='form-row  justify-content-between' style='margin-top: 20px'>
                               <div class=''>
                                 <button class='btn btn-warning' id='teacher-create' >Crear</button>
                               </div>
                             </div>
                        </form></div>`;

        $('.main-view .teacher-container').empty().append(newForm);
    });

    updateTeacherList();
}

function updateTeacherList(){
    try {
        let teacherList = $(".teacher-list ul");
        teacherList.empty();
        Gb.globalState.users.forEach( function(t, index){ 
        	if (t.type === 'teacher') {
        		teacherList.append( createTeacherItem(t, index) )
        	}
        });
    } catch (e) {
        console.log('Error actualizando', e);
    }

    $('.teacher-li').on('click', function(){

        let uid = $(this).data('uid'),
            first_name = $(this).data('firstname'),
            last_name = $(this).data('lastname'),
            tels = $(this).data('tels'),
            classes = $(this).data('classes');

        let editForm = `<div style="padding: 89px;">
                            <form class="teacher-edit-form">
                                <input type="hidden" value="${uid}">
                                <div class="form-group row">
                                  <label for="uid" class="col-sm-2 col-form-label">DNI:</label>
                                  <div class="col-sm-10">
                                    <input type="text" class="form-control" id="uid" value="${uid}">
                                  </div>
                                </div>
                                <div class="form-group row">
                                   <label for="first_name" class="col-sm-2 col-form-label">Nombre:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="first_name" value="${first_name}">
                                   </div>
                                 </div>
                                 <div class="form-group row">
                                   <label for="last_name" class="col-sm-2 col-form-label">Apellidos:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="last_name" value="${last_name}">
                                   </div>
                                 </div>
                                 <div class="form-group row">
                                   <label for="tels" class="col-sm-2 col-form-label">Telefonos:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="tels" value="${tels}">
                                   </div>
                                 </div>
                                 <div class="form-group row">
                                   <label for="classes" class="col-sm-2 col-form-label">Clases:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="classes" value="${classes}">
                                   </div>
                                 </div>
                                 <div class="form-row  justify-content-between" style="margin-top: 20px">
                                   <div class="">
                                     <button class="btn btn-danger" id="teacher-edit" type="submit">Eliminar</button>
                                   </div>
                                   <div class="">
                                     <button class="btn btn-warning" id="teacher-delete" type="submit">Editar</button>
                                   </div>
                                 </div>
                            </form>
                        </div>`;

        $('.teacher-list').addClass('col-md-3');
        $('.main-view .teacher-container').empty().append(editForm);
    });
}

/* Handlers */
$('#teacher-create').click( event => {
	console.log('creatingTeacher');
    event.preventDefault();
    let param = {},
        inputs = $('.teacher-create-form .form-control');

    $.each(inputs, function (key, input) {
        param[input.id] = input.value;
        input.value = '';
    });

    let s = new Gb.User(param.uid, 'teacher', param.first_name, param.last_name, param.tels.replace(/\s/g, '').split(','), param.classes.replace(/\s/g, '').split(','), [], 'SamplePass123');
    try {
        Gb.addUser(s).then( updateTeacherList() );
        alert('El profesor se ha creado con exito');
    } catch (e) {
        alert('Profesor ya existe con ese ID');
    }

});

$('#teacher-delete').on('click', event => {
	console.log('deletingTeacher');
    event.preventDefault();
    let uid =  $('input[type=hidden]').val()
    Gb.rm(uid).then( updateTeacherList() );
});

$('#teacher-edit').on('click', event => {
	console.log('updatingTeacher');
    event.preventDefault();
    let uid         = $('input#uid').val();
    let first_name  = $('input#firstname').val();
    let last_name   = $('input#lastname').val();
    let tels 		= $('input#tels').val().replace(/\s/g, '').split(',');
    let classes     = $('input#classes').val().replace(/\s/g, '').split(',');
    let s = new Gb.User(uid, 'teacher', first_name, last_name, tels, classes, [], 'SamplePass123');
    Gb.set(s).then( updateTeacherList() );
});

export {
    showTeacherView
}