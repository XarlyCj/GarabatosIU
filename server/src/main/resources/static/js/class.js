import * as Gb from './gbapi.js'

function showStudentView(){
    $(".main-view").empty().append(
        $(`<div class="Classes-list list container-fluid mt-2"></div><div class="classes-container form-container mt-2"></div>`));
    showList();
}

function createStudentItem(s, index){

    let html = `<li data-index="${index}" data-cid="${s.cid}" data-Name="${s.cid}" class="row classes-li list-group-item">
                  <div class="classes-index" >${s.cid}</div>
                </li>`;

    $(".classes-list ul").append(html);
}

function showList(){
    let html = `<div class="row justify-content-between container-fluid">
                    <button class="btn btn-primary" id="classes-new">Nuevo Clase</button>
                    <button class="btn btn-danger" id="classes-delete-massive">Eliminar Clase</button>
                </div>
                <div class="row input-group container-fluid mt-2">
                    <input type="text" class="form-control" id="classes-search-input" placeholder="Buscar Clase" aria-label="Buscar Clase" aria-describedby="basic-addon2">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" id="classes-search" type="button">Buscar</button>
                    </div>
                </div>
                <ul class="container-fluid mt-2 list-group-flush list-group"></ul>`;

    $(".main-view .classes-list").append($(html));

    $('#classes-new').on('click', event => {

        if(!$('.classes-list').hasClass('col-md-3')){
            $('.classes-list').addClass('col-md-3');
        }

        let newForm = `<div style='padding: 89px;'>
                        <form class='classes-create-form'>
                            <div class='form-group row'>
                              <label for='cid' class='col-sm-2 col-form-label'>Nombre de la clase</label>
                              <div class='col-sm-10'>
                                <input type='text' class='form-control' id='cid' placeholder='1ºA'>
                              </div>
                            </div>
                             <div class='form-group row'>
                               <label for='teachers' class='col-sm-2 col-form-label'>Profesor:</label>
                               <div class='col-sm-10'>
                                 <input type='text' class='form-control' id='teachers' placeholder='Manolo Garcia'>
                               </div>
                             </div>
                             <div class='form-row  justify-content-between' style='margin-top: 20px'>
                               <div class=''>
                                 <button class='btn btn-success' id='classes-create' type="submit">Crear</button>
                               </div>
                             </div>
                        </form>
                      </div>`;

        $('.main-view .classes-container').empty().append(newForm);
    });

    $('#classes-search').on('click', event => {
        let string = $('input#classes-search-input').val();
        if( string === '' || string === undefined){
            updateClassesList(undefined);
        }else{
            let classes = searchClasses(string);
            updateClassesList(classes);
        }
    });

    updateClassesList();
}

function updateClassesList(classes){

    try{

        let classesList = $(".classes-list ul");
        classesList.empty();

        if(classes === undefined){
            Gb.globalState.classes.forEach( (s, index) =>  classesList.append( createClassesItem(s, index) ) );
        }else{
            classes.forEach( (s, index) =>  classesList.append( createClassesItem(s, index) ) );
        }

    } catch (e) {
        console.log('Error actualizando', e);
    }

    $('.classes-li').on('click', function(){

        let cid = $(this).data('cid'),
            teachers = $(this).data('teachers'),
            students = $(this).data('students');

        let editForm = `<div style="padding: 89px;">
                            <form class="classes-edit-form">
                                <input type="hidden" value="${cid}">
                                <div class="form-group row">
                                  <label for="cid" class="col-sm-2 col-form-label">Clase</label>
                                  <div class="col-sm-10">
                                    <input type="text" class="form-control" id="cid" value="${cid}">
                                  </div>
                                </div>
                                ${
                                    teaches.forEach(p=> {
                                        `
                                <div class="form-group row">
                                <label for="teachers" class="col-sm-2 col-form-label">Profesores:</label>
                                <div class="col-sm-10">
                                  <input type="text" class="form-control" id="Profesor" value="${p}">
                                </div>
                              </div>
                                        `
                                    })
                                }
                                ${
                                    students.forEach(a => {
                                        `
                                <div class="form-group row">
                                <label for="teachers" class="col-sm-2 col-form-label">Studiantes:</label>
                                <div class="col-sm-10">
                                  <input type="text" class="form-control" id="Profesor" value="${a}">
                                </div>
                              </div>
                                        `
                                    })
                                }
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

        $('.classes-list').addClass('col-md-3');
        $('.main-view .classes-container').empty().append(editForm);
    });

}

function searchClasses(string){
    let classes = [];
    Gb.globalState.classes.forEach( clase => {
        $.each(clase, (key, val) => {
            console.log("val", val, "string", string);
            let flag = false;
            if( val.includes(string) && !flag ){
                classes.push(clase);
                flag = true;
            }
        })
    });
    return classes;
}

function createClasses(event){
  event.preventDefault();
  let param = {},
      inputs = $('.classes-create-form .form-control');

  $.each(inputs, function (key, input) {
      param[input.cid] = input.value;
      input.value = '';
  });

  let c = new Gb.classes(param.cid, param.students, param.teachers, [] );
  try {
      Gb.addClass(c).then( updateClassesList() );
      alert('La clase se ha creado con exito');
  } catch (e) {
      alert('Clase ya existe con ese ID');
  }
}

function deleteClasses(event){
  event.preventDefault();
  if(confirm("¿Seguro que desea borrar esta Clase?")){
    let cid =  $('input[type=hidden]').val()
    Gb.rm(cid).then( updateClassesList() );
  }
}

function editClasses(event){
  event.preventDefault();
  let cid         = $('input#sid').val();
  let teachers  = $('input#firstname').val();
  let students   = $('input#lastname').val();
  let c = new Gb.clase(cid, teachers, students, [] );
  Gb.set(c).then( updateClassesList() );
}

export {
    showClassesView,
    createClasses,
    deleteClasses,
    editClasses
}