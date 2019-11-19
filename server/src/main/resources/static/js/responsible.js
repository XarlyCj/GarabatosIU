import * as Gb from './gbapi.js'

function showResponsibleView(){
    $(".main-view").empty().append(
        $(`<div class="responsible-list list container-fluid mt-2"></div><div class="responsible-container form-container mt-2"></div>`));
    showList();
}

function createresponsibleItem(r, index){

    let html = `<li data-index="${index}" data-uid="${r.uid}" data-firstname="${r.first_name}" data-lastname="${r.last_name}" data-tels="${r.tels}" data-student="${r.student}" class="row responsible-li list-group-item">
                  <div class="responsible-index" > ${r.first_name} ${r.last_name} </div>
                </li>`;

    $(".responsible-list").append(html);
}

function showList(){
    let html = `<div class="row justify-content-between container-fluid">
                    <button class="btn btn-primary" id="responsible-new">Nuevo Responsable</button>
                    <button class="btn btn-danger" id="responsible-delete-massive">Eliminar Responsable</button>
                </div>
                <div class="row input-group container-fluid mt-2">
                    <input type="text" class="form-control" placeholder="Buscar Responsable" aria-label="Buscar Responsable" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-search-responsibles btn-outline-secondary" type="button">Buscar</button>
                    </div>
                </div>
                <ul class="container-fluid mt-2 list-group-flush list-group"></ul>
                <hr/>`;

    $(".main-view .responsible-list").append($(html));

    $('#responsible-new').on('click', function (event) {

        if(!$('.responsible-list').hasClass('col-md-3')){
            $('.responsible-list').addClass('col-md-3');
        }

        let newForm = `<div style='padding: 89px;'><form class='responsible-create-form'>
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
                               <label for='student' class='col-sm-2 col-form-label'>Students:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='student' placeholder='ID Student'>
                               </div>
                             </div>
                             <div class='form-row  justify-content-between' style='margin-top: 20px'>
                               <div class=''>
                                 <button class='btn btn-warning' id='responsible-create' >Crear</button>
                               </div>
                             </div>
                        </form></div>`;

        $('.main-view .responsible-container').empty().append(newForm);
    });

    updateresponsibleList();
}

function updateresponsibleList(){
    try {
        let responsibleList = $(".responsible-list ul");
        responsibleList.empty();
        Gb.globalState.users.forEach( function(r, index){ 
        	if (r.type === 'guardian') {
        		responsibleList.append( createresponsibleItem(r, index) )
        	}
        });
    } catch (e) {
        console.log('Error actualizando', e);
    }

    $('.responsible-li').on('click', function(){

        let uid = $(this).data('uid'),
            first_name = $(this).data('firstname'),
            last_name = $(this).data('lastname'),
            tels = $(this).data('tels'),
            student = $(this).data('student');

        let editForm = `<div style="padding: 89px;">
                            <form class="responsible-edit-form">
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
                                   <label for="last_name" class="col-sm-2 col-form-label">Apellido:</label>
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
                                   <label for="student" class="col-sm-2 col-form-label">Clases:</label>
                                   <div class="col-sm-10">
                                     <input type="text" class="form-control" id="student" value="${student}">
                                   </div>
                                 </div>
                                 <div class="form-row  justify-content-between" style="margin-top: 20px">
                                   <div class="">
                                     <button class="btn btn-danger" id="responsible-edit" type="submit">Eliminar</button>
                                   </div>
                                   <div class="">
                                     <button class="btn btn-warning" id="responsible-delete" type="submit">Editar</button>
                                   </div>
                                 </div>
                            </form>
                        </div>`;

        $('.responsible-list').addClass('col-md-3');
        $('.main-view .responsible-container').empty().append(editForm);
    });
}

/* Handlers */
function createResponsible(event){
    event.preventDefault();
    let param = {},
        inputs = $('.responsible-create-form .form-control');

    $.each(inputs, function (key, input) {
        param[input.id] = input.value;
        input.value = '';
    });

    let s = new Gb.User(param.uid, 'guardian', param.first_name, param.last_name, param.tels,[],param.student, 'pass');
    try {
        Gb.addUser(s).then( updateresponsibleList() );
        alert('El Responsable se ha creado con exito');
    } catch (e) {
        alert('Responsable ya existe con ese ID');
    }
}
function deleteResponsible(event){
    event.preventDefault();
    let uid =  $('input[type=hidden]').val()
    Gb.rm(uid).then( updateresponsibleList() );
    alert('El Responsable se ha borrado con exito');
}


function editResponsible(event){
    event.preventDefault();
    let uid         = $('input#uid').val();
    let first_name  = $('input#firstname').val();
    let last_name   = $('input#lastname').val();
    let tels 		= $('input#tels').val();
    let student     = $('input#student').val();
    let s = new Gb.User(uid, 'guardian', first_name, last_name, tels, [], student, 'pass');
    Gb.set(s).then( updateresponsibleList() );
}
export {
    showResponsibleView,
    createResponsible,
    deleteResponsible,
    editResponsible
}