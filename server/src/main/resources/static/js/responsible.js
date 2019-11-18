import * as Gb from './gbapi.js'

function showResponsibleView(){
    $(".main-view").empty().append(
        $(`<div class="responsible-list list container-fluid mt-2"></div>
        <div class="responsible-container form-container mt-2"></div>`));
    showList();
}
export {
    showResponsibleView
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
