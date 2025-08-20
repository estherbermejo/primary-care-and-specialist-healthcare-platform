var app = rpc("localhost","medico_especialista");
//funciones
var obtenerEspecialidades = app.procedure("obtenerEspecialidades");//con el nombre de la izquierda es con el que yo lo llamo aqui
var obtenerCentros = app.procedure("obtenerCentros");//nombre de la derecha es con el que esta en el servidor
var login = app.procedure("login"); //llamado a login, devuelve el id del medico si existe si no, da null.
var crearMe = app.procedure("crearME")
var actualizarme = app.procedure("actualizarme");
var obtenerDatosMedico = app.procedure("obtenerDatosMedico");
var obtenerGenero = app.procedure("obtenerGenero");
var obtenerExpDisponibles = app.procedure("obtenerExpDisponibles");
var asignarExp = app.procedure("asignarExp")
var obtenerExpAsignados = app.procedure("obtenerExpAsignados")
var resolverExp = app.procedure("resolverExp")
var anyadirMensaje = app.procedure("anyadirMensaje")
var obtenerExpediente = app.procedure('obtenerExpediente')
var limpiarMensajes = app.procedure('limpiarMensajes')
var obtenerFotos = app.procedure('obtenerFotos')
var filtrarImagen = app.procedure('filtrarImagen')
var obtenerValoracion = app.procedure('obtenerValoracion')
var crearValoracion = app.procedure('crearValoracion')
var actualizarValoracion = app.procedure('actualizarValoracion')
var consultarValoracion = app.procedure('consultarValoracion')
var obtenerValoracionMediadelMap = app.procedure('obtenerValoracionMediadelMap')

var obtenerPatologias = app.procedure('obtenerPatologias')
var actualizarPatologia = app.procedure('actualizarPatologia')

//cargadas todas las funciones se hace la funcion para ver las vistas
//variables globales, son las que se cargan
var vistaActual = null
var idMedicoActual = null;
var nuevo_registro = null;//controla el camino por donde entra el medico
var nuevo_expediente = null; //indica si se va a crear un expediente o editar uno existente
var filaTabla = null;
var nombreM = null;
var espeM = null;
var idExp_global = null;
var espNombre = null

//Servidor ws
var conexion = new WebSocket("ws://localhost:4444", "medicos");
function ver(id){
    if (vistaActual) { //se comprueba que la vista actual no sea un valor nulo, en caso de no serlo entra al if
        document.getElementById(vistaActual).classList.remove("visible"); //se quita la visibilidad de la vista actual
    }
    document.getElementById(id).classList.add("visible"); //se pone visible la nueva vista (que es el id)
    vistaActual = id; //la vista actual es el id
}
ver("acceso");


function entrar(){
    //se comprueba que la combinacion usuario/pass es correcta
    nuevo_registro=false;
    //si el entrar va bien
    var pass = document.getElementById('contrasena').value;
    var log = document.getElementById('usuario').value ;
    var p = document.getElementById("bienvenida");
        //callback para obtener el idMedico
    login(log, pass, function(id_ME) { //la función del html no se puede llamar igual a la del servidor
        console.log("El login que recibimos del servdor es", id_ME)
        idMedicoActual = id_ME;
        console.log(log,pass)
        if(id_ME!=null){
            ver("Inicio")
            obtenerDatosMedico(id_ME,function(datos){
            p.textContent = "Bienvenido Dr. "+datos.nombre+" "+datos.apellidos
            nombreM = datos.nombre
            espeM = datos.especialidad
            })
            
        }
        else{
            alert("Las credenciales introducidas no son las de un médico especialista")
        }
    })
    pass.value = "";
    log.value = "";

}

function registrarse(){
    nuevo_registro = true;
    cargarCentros();
    cargarEspecialidades();
    ver("datosMedico")
    
}
function cargarCentros(){
    //obtener el elemento select
    var select = document.getElementById('centros');
    select.innerHTML = '';
    obtenerCentros(function(listadoCentros){
        listadoCentros.forEach((element) => {
            var option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.nombre;
            select.appendChild(option); 
    })
    }); 

}
function cargarPatologias(){
    var select = document.getElementById('patologias');
    select.innerHTML = '';
    obtenerPatologias(function(listadoPatologias){
        listadoPatologias.forEach((element) => {
            var option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.nombre;
            select.appendChild(option); 
    })
    }); 
}
function guardarPatologia(){
    var id = document.getElementById('id').value;
    var patologia = document.getElementById('patologias').value;
    actualizarPatologia(id, patologia,function(resul){
            if(resul==true){
                alert("Guardado con éxito")
                ver('Inicio')
            }
            else if(resul == false){
                alert("Mal, no se ha podido guardar la patología")
            }
        })

}
function cargarGenero(id){
    select = document.getElementById('genero')
    obtenerGenero(function(genero){
        genero.forEach(element =>{
            if (element.id==id) {
                select.value = element.nombre
                return toString(element.nombre);
            } 
        })
        
    });
}
function cargarEspecialidades(id){
    //obtener el elemento select
    var select = document.getElementById('especialidad');
    var select2 = document.getElementById('especialidades');
    select.innerHTML = '';

    obtenerEspecialidades(function(listadoEspecialidades){
        listadoEspecialidades.forEach((element) => {
            var option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.nombre;
            espNombre = element.nombre
            select.appendChild(option);
            if(id == option.value){
                select2.value = element.nombre;
            }
            
    })
    }); 

}

function guardarMedicoEspecialista(){
    var id = idMedicoActual
    var nombreN = document.getElementById('nombreMedico').value;//cogemos los datos del campo de html
    var apellidos = document.getElementById('apellidosMedico').value;
    var login = document.getElementById('login').value
    var password = document.getElementById('contrasenaMed').value;
    var centro = document.getElementById('centros').value
    var especialidad = document.getElementById('especialidad').value;

    nuevoMedico = {
        nombre: nombreN,
        apellidos: apellidos,
        login: login,
        password: password,
        centro: centro,
        especialidad: especialidad
    }
    if(nuevo_registro ==  true){// es un medico nuevo
        crearMe(nuevoMedico,function(id){
            if(id != null){
                alert("Medico creado con éxito")
                ver('acceso')
            }
            else{
                alert("Ya existe un médico con estas credenciales")
            }
            })
    }
    else{
        actualizarme(id, nuevoMedico,function(resul){
            if(resul==true){
                alert("Medico actualizado con éxito")
                ver('Inicio')
            }
            else if(resul == false){
                alert("Ya existe un médico con estas credenciales")
            }
        })
    }
    document.getElementById('nombreMedico').value = '';//cogemos los datos del campo de html
    document.getElementById('apellidosMedico').value = '';
    document.getElementById('login').value = ''
    document.getElementById('contrasenaMed').value = '';
    document.getElementById('centros').value = '';
    document.getElementById('especialidad').value = '';
}

function cancelar(){
    document.getElementById('usuario').value = ''
    document.getElementById('contrasena').value = ''
    if(nuevo_registro==true){
        ver('acceso')
    }
    else{
        ver('Inicio')
        //limpiarCampos()
    }
}

function resolver(){

    id = document.getElementById('id').value
    resp = document.getElementById('respuesta').value

    resolverExp(id,resp,function(mensaje){
        if(mensaje==true){
            alert("Expediente resuelto con éxito")
            ver('Inicio')
            cargar_asignar_expedientes();//se carga la vista de asignar expedientes y carga los ex
        }
        else{
            alert('El expediente no ha podido ser resuelto')
        }
    })
}
function volverListado(){
    ver('AsignarExpediente')
    cargar_asignar_expedientes()
    console.log("cargando las asignaciones de expedientes...")
}
cargarCentros();
cargarEspecialidades();
cargarPatologias();
function editarDatos(){
    obtenerDatosMedico(idMedicoActual,function(exp){
        document.getElementById('nombreMedico').value = exp.nombre
        document.getElementById('apellidosMedico').value = exp.apellidos
        document.getElementById('login').value = exp.login
        document.getElementById('especialidad').value = exp.especialidad
        document.getElementById('centros').value = exp.centro
    })
    ver("datosMedico")
}
function asignar(expediente) {
    ver("expedientePaciente");
    cargarEspecialidades();
    cargarGenero();

    // Seleccionar los elementos del formulario
    var id = document.getElementById('id');
    var medEspecialidad = document.getElementById('medEspecialidad');
    var especialidad = document.getElementById('especialidad');
    var sip = document.getElementById('sip');
    var nombrePac = document.getElementById('nombrePac');
    var apellidosPac = document.getElementById('apellidosPac');
    var fecha_nac = document.getElementById('fn');
    var codMAP = document.getElementById('codMAP');
    var genero = document.getElementById('genero');
    var observaciones = document.getElementById('observaciones');
    var solicitud = document.getElementById('solicitud');
    var respuesta = document.getElementById('respuesta');
    var fSolicitud = document.getElementById('fSolicitud');
    var fAsignacion = document.getElementById('fAsignacion');
    var fResolucion = document.getElementById('fResolucion');

    // Limpiar los campos antes de asignar nuevos datos
    id.value = '';
    medEspecialidad.value = '';
    especialidad.value = '';
    sip.value = '';
    nombrePac.value = '';
    apellidosPac.value = '';
    fecha_nac.value = '';
    codMAP.value = '';
    genero.value = '';
    observaciones.value = '';
    solicitud.value = '';
    respuesta.value = '';
    fSolicitud.value = '';
    fAsignacion.value = '';
    fResolucion.value = '';

    // Asignar expediente
    asignarExp(idMedicoActual, expediente.id, function(estado) {
        console.log("estado", estado);
        if (estado) {
            // Obtener los datos del expediente seleccionado
            obtenerExpediente(expediente.id, function(exp_asignado) {
                if (exp_asignado) {
                    console.log("Expediente asignado obtenido:", exp_asignado);

                    // Rellenar los campos del formulario con los datos obtenidos
                    id.value = exp_asignado.id;
                    medEspecialidad.value = exp_asignado.me;
                    especialidad.value = cargarEspecialidades(exp_asignado.especialidad);
                    sip.value = exp_asignado.sip;
                    nombrePac.value = exp_asignado.nombre;
                    apellidosPac.value = exp_asignado.apellidos;
                    fecha_nac.value = exp_asignado.fecha_nacimiento;
                    codMAP.value = exp_asignado.map;
                    genero.value = cargarGenero(exp_asignado.genero);
                    observaciones.value = exp_asignado.observaciones;
                    solicitud.value = exp_asignado.solicitud;
                    respuesta.value = exp_asignado.respuesta;
                    fSolicitud.value = exp_asignado.fecha_creacion ;
                    fAsignacion.value = exp_asignado.fecha_asignacion;
                    fResolucion.value = exp_asignado.fecha_resolucion;
                }
            });
        }
    });
}


function cargar_asignar_expedientes() {
    document.getElementById("div_expedientes").innerHTML = "";
    cargarEspecialidades();
    cargarGenero();
    ver("AsignarExpediente");

    // Obtener la especialidad del médico actual
    obtenerDatosMedico(idMedicoActual, function(datos) {
        var especialidadMedicoActual = datos.especialidad;

        // Obtener los expedientes disponibles para esa especialidad
        obtenerExpDisponibles(especialidadMedicoActual, function(expedientesDis) {
            console.log("Expedientes disponibles:", expedientesDis);
            if(document.getElementById("tabla_expDisponibles")){
                    // Si ya existe una tabla, la eliminamos para evitar duplicados
                    document.getElementById("tabla_expDisponibles").remove();
                }
            if(expedientesDis.length == 0){
                alert("No hay expedientes disponibles para la especialidad seleccionada");
            }
            else{
                
                // Crear la tabla de expedientes disponibles
                var div = document.getElementById("div_expedientes");
                var tabla = document.createElement('table');
                tabla.id = "tabla_expDisponibles";
                var tbody = document.createElement('tbody');

                // Crear los encabezados de la tabla
                var encabezados = ['ID', 'Nombre MAP', 'F. creación', ' '];
                var filaEncabezados = document.createElement('tr');
                encabezados.forEach(function(encabezado) {
                    var th = document.createElement("th");
                    th.textContent = encabezado;
                    filaEncabezados.appendChild(th);
                });
                tabla.appendChild(filaEncabezados);
                //los expedientes disponibles que da esta funcion sonlos que no estan asignados
                expedientesDis.forEach(function(expediente) {// esta formado por id el map y la fecha de creacion
                    var fila = document.createElement("tr");

                    // Crear las celdas de la fila
                    var tdId = document.createElement("td");
                    tdId.textContent = expediente.id;
                    fila.appendChild(tdId);

                    var tdMAP = document.createElement("td");
                    obtenerDatosMedico(expediente.map, function(datosMed) {
                        tdMAP.textContent = datosMed.nombre;
                    });
                    fila.appendChild(tdMAP);

                    var tdFC = document.createElement("td");
                    tdFC.textContent = expediente.fecha_creacion ? new Date(expediente.fecha_creacion ).toISOString().split('T')[0] : null,
                    fila.appendChild(tdFC);

                    var tdBoton = document.createElement("td");

                    var botonAsignar = document.createElement("button");
                    botonAsignar.textContent = "Asignar";
                    botonAsignar.onclick = function() {
                        asignar(expediente, function(success) {
                            if (success) {
                                // Eliminar la fila de la tabla solo si la asignación fue exitosa
                                tabla.parentNode.removeChild(fila);
                            } else {
                                console.error("Error al asignar el expediente.");
                                // Manejo adicional de errores si es necesario
                            }
                        });
                    };
                    
                    tdBoton.appendChild(botonAsignar);
                    fila.appendChild(tdBoton);

                    var tdChat = document.createElement("td");
                    var botonChat = document.createElement("button");
                    botonChat.textContent = "Chat";
                    botonChat.onclick = function(event) {
                        event.stopPropagation();
                        idExp_global = expediente.id;
                        
                        ver('chatMAPEsp');
                    };
                    tdChat.appendChild(botonChat);
                    fila.appendChild(tdChat);

                    // Agregar la fila a tbody
                    tbody.appendChild(fila);
                });

                // Agregar tbody a la tabla
                tabla.appendChild(tbody);

                // Agregar la tabla al div contenedor
                div.appendChild(tabla);
            }
        });
    });
}
function pedirValoracion(){
    idMAP = document.getElementById('codMAP').value;
    idExp = document.getElementById('id').value;    
    idME = idMedicoActual;
    obtenerValoracion(idExp, idMAP, idME, function(valoracion){
        if (valoracion != null){
            document.getElementById('valoracion').value = valoracion  
            document.getElementById('etiquetaValor').textContent = valoracion
        }
        else{
            document.getElementById('valoracion').value = 1 
            document.getElementById('etiquetaValor').textContent = 1
        }
        
        
    })
}

function cargarValoracionMedia(idMAP){
    obtenerValoracionMediadelMap(idMAP, function(valoracionMedia){
        console.log("Valoración media recibida:", valoracionMedia);
        if(valoracionMedia != null){
            document.getElementById('valoracionMedia').value = valoracionMedia;
        }
        else{
            document.getElementById('valoracionMedia').value = 0;
        }
    })
}

function guardarValoracion(valoracion){
    
    valoracion = document.getElementById('valoracion').value;
    idMAP = document.getElementById('codMAP').value;
    idExp = document.getElementById('id').value;
    idME = idMedicoActual;
    consultarValoracion(idExp, idMAP, idME, function(id){
       if(id == null){//si no existe la valoracion
            crearValoracion(idExp, idMAP, idME, valoracion, function(respuesta){
                if(respuesta){
                    alert("Valoración creada con éxito")
                }
                else{
                    alert("No se ha podido crear la valoración")
                }
            })
        }
        else if (id != null){
            actualizarValoracion(id, valoracion, function(respuesta){
                if(respuesta == true){
                    alert("Valoración actualizada con éxito")
                }
                else{
                    alert("No se ha podido actualizar la valoración")
                }
            })
        }
    })
}
function mostrar(exp){
    ver("expedientePaciente");
    cargarEspecialidades();
    cargarGenero();

    // Seleccionar los elementos del formulario
    var id = document.getElementById('id');
    var medEspecialidad = document.getElementById('medEspecialidad');
    var especialidad = document.getElementById('especialidad');
    var sip = document.getElementById('sip');
    var nombrePac = document.getElementById('nombrePac');
    var apellidosPac = document.getElementById('apellidosPac');
    var fecha_nac = document.getElementById('fn');
    var codMAP = document.getElementById('codMAP');
    var genero = document.getElementById('genero');
    var observaciones = document.getElementById('observaciones');
    var solicitud = document.getElementById('solicitud');
    var respuesta = document.getElementById('respuesta');
    var fSolicitud = document.getElementById('fSolicitud');
    var fAsignacion = document.getElementById('fAsignacion');
    var fResolucion = document.getElementById('fResolucion');
    var valoracion = document.getElementById('valoracionMedia');

    // Limpiar los campos antes de asignar nuevos datos
    id.value = '';
    medEspecialidad.value = '';
    especialidad.value = '';
    sip.value = '';
    nombrePac.value = '';
    apellidosPac.value = '';
    fecha_nac.value = '';
    codMAP.value = '';
    genero.value = '';
    observaciones.value = '';
    solicitud.value = '';
    respuesta.value = '';
    fSolicitud.value = '';
    fAsignacion.value = '';
    fResolucion.value = '';
    valoracion.value = '';

    id.value = exp.id;
    medEspecialidad.value = exp.me;
    especialidad.value = cargarEspecialidades(exp.especialidad);
    sip.value = exp.sip;
    nombrePac.value = exp.nombre;
    apellidosPac.value = exp.apellidos;
    fecha_nac.value = exp.fecha_nacimiento;
    codMAP.value = exp.map;
    genero.value = cargarGenero(exp.genero);
    observaciones.value = exp.observaciones;
    solicitud.value = exp.solicitud;
    respuesta.value = exp.respuesta;
    fSolicitud.value = exp.fecha_creacion;
    fAsignacion.value = exp.fecha_asignacion;
    fResolucion.value = exp.fecha_resolucion;
    valoracion.value = cargarValoracionMedia(document.getElementById('codMAP').value);
    pedirValoracion();


    //ejecuta la funcion auxiliar
    obtenerFotos(exp.id, function(arrayFotos){//ayyar Imgenes lleva id,fecha, img
        if(arrayFotos.length == 0){
            console.log("No hay fotos de este expediente")
        }
        else{
            crearTablaFotos(arrayFotos)
        }
    })


}
//hazte una funcion auxiliar en la que haces el obtenerFto y la tabla
function crearTablaFotos(datos){
    console.log("Imagen recibida"); 
    var div = document.getElementById('fotosPaciente')//cojo el div donde se van a colocar las fotos
    //compruebo si ya existe una tabla como con los exp
    var tablaExistente = document.getElementById('tablaImagenes');
    if (tablaExistente) {
        div.removeChild(tablaExistente);//la borro porque ya existe
    }
    var tabla = document.createElement('table');//creo un objeto tabla
    tabla.id = "tablaImagenes";//le pongo un id para poder identificarla
    var tbody = document.createElement('tbody');
    var filaEncabezados = document.createElement('tr');//creo los encabezados
    var encabezados = ['ID','Fecha Creacion','Imagen',' ']
    encabezados.forEach(function(encabezados){
        var th = document.createElement('th');//creo las celdas del encabezado y las añado a la fila
            th.textContent = encabezados;
            filaEncabezados.appendChild(th)
        })
    tabla.appendChild(filaEncabezados)//añado la fila de los encabezados a la tabla
    //crear filas con los datos
    datos.forEach( dato =>{
        console.log("Escribo la foto con id:",dato.id)
        var fila = document.createElement("tr");//creo una fila para cada dato
        var colum_id = document.createElement("td");
        var colum_fecha = document.createElement("td");
        var colum_imagen = document.createElement("td");
        var colum_select = document.createElement("td");
        var colum_button_filtrado = document.createElement("td");

        //añado contenido a cada celda
        colum_id.textContent = dato.id;
        //formateo la fecha para que se vea mejor
        var fecha = new Date(dato.fecha);
        
        var fechaFormateada = `${String(fecha.getUTCDate()).padStart(2, '0')}/` + `${String(fecha.getUTCMonth() + 1).padStart(2, '0')}/` + `${fecha.getUTCFullYear()} ` +
        `${String(fecha.getUTCHours()).padStart(2, '0')}:` +`${String(fecha.getUTCMinutes()).padStart(2, '0')}:` + `${String(fecha.getUTCSeconds()).padStart(2, '0')}`;

        colum_fecha.textContent = fechaFormateada; // Salida: 13/10/2024 22:00:00
        
        //crear elemento html para las imagenes
        var imgElement = document.createElement("img");
        imgElement.src = "data:image/jpeg;base64," + dato.img;
        imgElement.style.width = "100px"; // Ajusta el tamaño según sea necesario

        imgElement.addEventListener("click", function() {
            if (imgElement.style.width === "100px") {
                imgElement.style.width = "300px"; // Aumenta el tamaño al hacer clic
            }
            else {
                imgElement.style.width = "100px"; // Vuelve al tamaño original al hacer clic de nuevo
            }
        })

        colum_imagen.appendChild(imgElement);
        
        //Crear el objeto select
        var select = document.createElement("select");
        select.id = `selectFiltro_${dato.id}`;
        
        var opciones = ["grayscale","blur","invert","threshold","rotate","flip","flop"];
        opciones.forEach(function(opcion){
            var option = document.createElement("option");
            option.value = opcion;
            option.textContent = opcion;
            select.appendChild(option)
        })
        colum_select.appendChild(select);

        //Crear un campo input para las opciones del filtro
        var inputOpcion = document.createElement("input");
        inputOpcion.type = "text";
        inputOpcion.id = `inputOpcion_${dato.id}`; // ID único 
        inputOpcion.placeholder = "Opciones del filtro"
        inputOpcion.style.display = 'none'//oculto el cacharro por defecto
        colum_select.appendChild(inputOpcion);
        var filtroconOpciones;
        //segun la seleccion del select
        select.addEventListener("change", function(){
            var filtroSeleccionado = this.value;
            if (["blur","threshold","rotate"].includes(filtroSeleccionado)){
                inputOpcion.style.display = 'inline-block'
                filtroconOpciones = true;
            }
            else{
                inputOpcion.style.display = 'none'; // Ocultar
                filtroconOpciones = false;
            }
        })

        // Crear el botón de filtrado
        var buttonFiltrado = document.createElement("button");
        buttonFiltrado.textContent = "Filtrar";
        buttonFiltrado.id = `buttonFiltrado_${dato.id}`;
        buttonFiltrado.onclick = function() {
            console.log("El id de la fila cuya foto estas filtrando es ", dato.id);
            
            // Obtener el filtro seleccionado y las opciones
            var filtroSeleccionado = document.getElementById(`selectFiltro_${dato.id}`).value;
            var opcionFiltro = document.getElementById(`inputOpcion_${dato.id}`).value;
            console.log("El filtro seleccionado es: ", filtroSeleccionado);
            var imagenFiltrada;
            // Verificar si el filtro tiene opciones
            if (filtroconOpciones) {
                console.log("Este filtro tiene opciones");
                console.log("La opción es: ", opcionFiltro);
                // esta vacía?
                if (opcionFiltro.trim() === "") {
                    alert("La opción del filtro no puede estar vacía. Por favor, ingresa un valor válido.");
                    return;
                }
                // Si no 
                filtrarImagen(dato.id, filtroSeleccionado, opcionFiltro, function(imagenFiltrada) {
                    if (imagenFiltrada) {
                        // Actualizar el src de la imagen en tu página web
                        imgElement.src = "data:image/jpeg;base64," + imagenFiltrada;
                        colum_imagen.appendChild(imgElement);
                        console.log("Imagen filtrada y actualizada en la tabla.");
                    } else {
                        console.error("No se pudo filtrar la imagen.");
                    }
                });
            } else {
                console.log("Este filtro no tiene opciones");
                filtrarImagen(dato.id, filtroSeleccionado, null, function(imagenFiltrada) {
                    if (imagenFiltrada) {
                        // Actualizar el src de la imagen en tu página web
                        imgElement.src = "data:image/jpeg;base64," + imagenFiltrada;
                        colum_imagen.appendChild(imgElement);
                        console.log("Imagen filtrada y actualizada en la tabla.");
                    } else {
                        console.error("No se pudo filtrar la imagen.");
                    }
                });
            }
        };

        // Añadir el botón de filtrado a la columna
        colum_button_filtrado.appendChild(buttonFiltrado);

        fila.appendChild(colum_id);//añado las columnas con su contenido a la fila
        fila.appendChild(colum_fecha);
        fila.appendChild(colum_imagen);
        fila.appendChild(colum_select);
        fila.appendChild(colum_button_filtrado);
        tbody.appendChild(fila)
    })
    tabla.appendChild(tbody)
    div.appendChild(tabla)
}

function mostrarExpAsignados(){
    document.getElementById("div_expedientesAsignados").innerHTML = ""
    cargarEspecialidades();
    cargarCentros();

    //se obtienen los expedientes que ya han sido asignados a ese medico segun el id
    obtenerExpAsignados(idMedicoActual,function(expedientes){
        if (expedientes == []){
            alert("Este médico especialista no tiene expedientes asignados")
        }
        else{
            //se crea la tabla
            div = document.getElementById("div_expedientesAsignados");
            tabla = document.createElement('table');
            tabla.id = "tabla_expAsignados";
            tbody = document.createElement('tbody');
            //se crean los encabezados
            var encabezados = ['ID', 'Nombre MAP', 'F. creación', 'F. asignación ','F. resolución', ' ' ];
            var filaEncabezados = document.createElement('tr');
            encabezados.forEach( (encabezado) => {
                var th = document.createElement("th");
                th.textContent = encabezado;
                filaEncabezados.appendChild(th);
            })
            tabla.appendChild(filaEncabezados)// se añaden los encabezaddos a la tabla
                expedientes.forEach((exp =>{
                    //console.log(exp)
                    var fila = document.createElement("tr");
                    var tdId = document.createElement("td");//id
                    var tdMAP = document.createElement("td");// nombre del medico de atencion primaria
                    var tdFC = document.createElement("td");//fecha creacion
                    var tdFA = document.createElement('td');//fecha asignacion
                    var tdFR = document.createElement('td');//fecha resolucion
                    var tdChat = document.createElement('td')//chat
        
                    tdId.textContent = exp.id;
                    //tdMAP.textContent = exp.map;
                    obtenerDatosMedico(exp.map,function(datosMed){
                        tdMAP.textContent = datosMed.nombre
                        
                        fila.append(tdId);
                        fila.append(tdMAP);
                        fila.append(tdFC);
                        fila.append(tdFA);
                        fila.append(tdFR);

                        fila.onclick = function(){
                            mostrar(exp)
                            
                        }
                        fila.append(tdChat)
                        tbody.appendChild(fila)
                    })
                    // el contenido es la fecha, si es null se deja como null
                    tdFC.textContent = exp.fecha_creacion ? new Date(exp.fecha_creacion).toISOString().split('T')[0] : null
                    tdFA.textContent = exp.fecha_asignacion ? new Date(exp.fecha_asignacion).toISOString().split('T')[0] : null
                    tdFR.textContent = exp.fecha_resolucion ? new Date(exp.fecha_resolucion).toISOString().split('T')[0] : null
                    //Boton para chat 
                    btnChat=document.createElement('button');
                    btnChat.id = "botonChatAsignados"
                    btnChat.innerHTML = "Chat";//personal
                    btnChat.onclick= function(){
                        event.stopPropagation();
                        idExp_global = exp.id
                        ver('chatMAPEsp')
                    }
                    tdChat.append(btnChat)
                    
                }))
                tabla.appendChild(tbody);
                div.appendChild(tabla);
                ver('ExpedientesAsignados')}
})
}
function salir(){
    document.getElementById('nombreMedico').value = '';//cogemos los datos del campo de html
    document.getElementById('apellidosMedico').value = '';
    document.getElementById('login').value = ''
    document.getElementById('contrasenaMed').value = '';
    document.getElementById('centros').value = '';
    document.getElementById('especialidad').value = '';
    document.getElementById('usuario').value = ''
    document.getElementById('contrasena').value = ''
    ver("acceso")
     
}


function volverInicio(){
    ver('Inicio')
}

//RETO
function anyadir(mensaje){
    anyadirMensaje(mensaje,idExp_global,function(expedientes){
    })
}




//PRUEBA DE EJERCICIOS
// MAIN del ME

var updateEstado = app.procedure("updateEstado");
function actualizarEstadoExpediente(){
    var id_expediente = document.getElementById("id").value;
    var estadoExpediente = document.getElementById("estado_expediente").value;
    var dificultadExpediente = document.getElementById("dificultad_expediente").value;

    estado_actualizado = {
        id_expediente: id_expediente,
        estado: estadoExpediente,
        dificultad: dificultadExpediente
    };
    updateEstado(estado_actualizado, function(respuesta) {
        if (respuesta.error) {
            console.error("Error al actualizar el estado del expediente:", respuesta.error);
        } else {
            alert("Estado del expediente actualizado con éxito:");
        }
    })
}
//CHAT DE MÉDICOS medico especialista
// Evento de mensaje del servidor
conexion.addEventListener("message", function (event) {
    var msg = JSON.parse(event.data);
    console.log("El mensaje recibido en ME:", msg)
    /**msg = {
     * operacion:'operacion', 
     * mensaje:{
     *      id_expediente:'id_expediente', 
     *      medico_id:'medico_id', 
     *      autor:'autor',  
     *      contenido:'contenido'},
     *      fechaHora: 'DD/M/AAAA, HH:MM:SS'
     * }**/
    switch (msg.operacion) {
        case "limpiar":
            limpiar(msg.id_exp);  //limpia mensajes
            break;
        case "recibirdelMAP":
            // Añadir el mensaje recibido desde el MAP a la interfaz
            anyadir_aInterfazChat("<li class='recibido'> (" + msg.fechaHora + ') ' + msg.nombreMedico + ": " + msg.contenido + "</li>", msg.id_exp);
            anyadirMensaje(msg.contenido, msg.id_exp);  // Actualiza el historial local de mensajes
            break;
    }
});

// Función para enviar mensajes al servidor mediante WebSocket
function enviarMensaje(operacion, mensaje) {
    conexion.send(JSON.stringify({ operacion: operacion, mensaje: mensaje }));
}

// Función específica para enviar mensajes del MEP al MAP
function enviarMensajeMEP() {
    // Obtener el valor del mensaje desde la caja de texto
    var inputMensaje = document.getElementById("inputMensaje").value;
    document.getElementById("inputMensaje").value = '';  // Limpiar la caja de texto

    // Crear el mensaje con los detalles
    var msg = crearMensaje(inputMensaje, idMedicoActual);
    enviarMensaje("enviaraMAP", msg);  // Enviar el mensaje al servidor por WebSocket
    console.log("Mensaje enviado a través del WebSocket");

    // También guarda el mensaje en la base de datos y actualiza el historial local
    anyadirMensaje(msg.contenido, exp_id);
    actualizarChat(msg);  // Añade el mensaje a la interfaz del chat
}

// Función para crear un mensaje con la estructura predefinida
function crearMensaje(contenido, idMed) {
    return {
        id_expediente: exp_id,  
        medico_id: idMed,       
        autor: 'ME',            // El autor es el Médico Especialista (ME)
        contenido: contenido,   
        fechaHora: new Date().toLocaleString()  // Hora actual
    };
}

// Función para limpiar los mensajes del expediente (desde la interfaz)
function limpiar(id_exp) {
    limpiarMensajes(id_exp, function(err, result) {
        if (err) {
            console.log(err.error);
        } else {
            console.log(result.message);
            document.getElementById("mensajes_chat").innerHTML = "";  // Limpiar en la interfraz
        }
    });
}

// Función para añadir un mensaje a la interfaz del chat
function anyadir_aInterfazChat(msg) {
    document.getElementById("mensajes_chat").innerHTML += msg;  
}

// Función para actualizar el chat local con el mensaje enviado
function actualizarChat(msg) {
    var chat = "<li class='enviado'> (" + msg.fechaHora + ') ' + msg.nombreMedico + ": " + msg.contenido + "</li>";
    document.getElementById('mensajes_chat').innerHTML += chat;  
}

// Evento cuando la conexión WebSocket se cierra
conexion.addEventListener("close", function () {
    console.log("Desconectado el MEP del servidor.");
});

// Evento de error en la conexión WebSocket
conexion.addEventListener("error", function () {
    console.log("Error con la conexión del MEP.");
});
