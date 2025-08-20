
var vistaActual = null
var idMedicoActual = null;
var nombreMedicoActual = null;
var nuevo_registro = null;//controla el camino por donde entra el medico
var nuevo_expediente = null; //indica si se va a crear un expediente o editar uno existente
var exp_id = null;
var exp_nombre = null
var especialidades_global = [];
function ver(id){
    if (vistaActual) { //se comprueba que la vista actual no sea un valor nulo, en caso de no serlo entra al if
        document.getElementById(vistaActual).classList.remove("visible"); //se quita la visibilidad de la vista actual
    }
    document.getElementById(id).classList.add("visible"); //se pone visible la nueva vista (que es el id)
    vistaActual = id; //la vista actual es el id
}
ver("acceso");


function entrar(){  //devuelve el id del medico que entra
    nuevo_registro = false;//indica que el medico que entra no es un nuevo registro sino que ya  existe

    login = document.getElementById("usuario").value
    contrasena = document.getElementById("contrasena").value
    rest.post('/api/medico/login',{ login: login, password: contrasena },function(estado,medicos){
        if(estado==200){
            ver("Inicio");
            document.getElementById('contrasena').value = '';
            document.getElementById('usuario').value = '';
            var p = document.getElementById("bienvenida");
            p.textContent = "Bienvenido Dr. "+medicos.nombre+" "+medicos.apellidos
            idMedicoActual = medicos.id;
            nombreMedicoActual = medicos.nombre;
            cargarExpedientes();
        }
        else{
            alert("Los datos introducidos son incorrectos")
        }})
    }
function registrarse(){
    /**Lleva a la funcion vista de datos medicos */
    cargarCentros();
    nuevo_registro = true; //el medico que entra es un nuevo registro
    ver("datosMedico")
}
function editarDatos(){
    cargarCentros();
    //se editan los datos del paciente
    ver("datosMedico");
    var idMed = idMedicoActual;
    //se obtiene el objeto de ese medico y se abre la vista de editarDatos
    rest.get("/api/medico/"+idMed,function(estado,medicoSA){//obtengo el medico con el id. medicoSA identifica al medico sin actualizar
        if (estado==200){
            //cojo los valores que hay en el medico y los muestro en el formulario para poderlos editar
            var nombre = document.getElementById('nombreMedico');//cogemos los datos del campo de html
            var apellidos = document.getElementById('apellidosMedico');
            var login = document.getElementById('login')
            var password = document.getElementById('contrasenaMed');
            var centro = document.getElementById('centros');
            nombre.value = medicoSA.nombre;
            apellidos.value = medicoSA.apellidos;
            login.value = medicoSA.login;
            password.value = '';
            centro.value = medicoSA.centro;
        }
        else if (estado==404){
            alert("No encuentro los datos del médico con ese id");
        }
        
    })
}
function guardarMedico(){
    var idMed = idMedicoActual;

    if (nuevo_registro==false){//significa que viene del boton entrar

        var nombreA = document.getElementById('nombreMedico').value;//cogemos los datos del campo de html
        var apellidosA = document.getElementById('apellidosMedico').value;
        var loginA = document.getElementById('login').value
        var passwordA = document.getElementById('contrasenaMed').value;
        var centroA = document.getElementById('centros').value

        rest.put("/api/medico/"+idMed,{
            nombre: nombreA,
            apellidos: apellidosA,
            login: loginA,
            password: passwordA,
            centro: centroA
        },function(estado,medicoActualizado){  //medico es el medico que tiene ese id
            ver("acceso")
            
      })
    }
    
    else{//significa que viene del boton registrar

        var nombreN = document.getElementById('nombreMedico').value;//cogemos los datos del campo de html
        var apellidos = document.getElementById('apellidosMedico').value;
        var login = document.getElementById('login').value
        var password = document.getElementById('contrasenaMed').value;
        var centro = document.getElementById('centros').value

        var nuevoMedico = {//creamos el objeto medico
            nombre : nombreN,
            apellidos: apellidos,
            login: login,
            password: password,
            centro: centro
        }
        
        rest.post("/api/medicos",nuevoMedico,function(estado,res){//enviamos el objeto medico
        if(estado==201){
            alert("Médico creado con éxito");
            nuevo_registro = true;
            ver("acceso")
        }
        else if(estado==403){
            alert("El usuario ya está escogido")
        }
        else{
            console.log("Ha fallado")
        }
})
}
    
    document.getElementById('nombreMedico').value = ''
    document.getElementById('apellidosMedico').value = ''
    document.getElementById('login').value = ''
    document.getElementById('contrasenaMed').value = ''
    document.getElementById('centros').value = ''
    
}
//Funcion para obtener las estadisticas
function estadisticas(){
    rest.get('/api/map/'+idMedicoActual+'/estadisticas', function(estado,estadisticas){
        console.log(estado)
        console.log(estadisticas)
        if(estado==200){
            alert('Total de expedientes: '+estadisticas.total+', asignados: '+ estadisticas.asignados+', resueltos: '+estadisticas.resueltos)
        }
        else{
            alert('Hay un error con las estadisticas')
        }
    })
}
// Función para enviar la solicitud DELETE desde el cliente
function borrarNoAsignados(){ //Lunes a las 13.00
    // Suponiendo que 'rest' es un objeto que maneja las solicitudes HTTP (AJAX)
    rest.delete('/api/map/' + idMedicoActual + '/expnoasignados', function(estado, respuesta){
        if (estado == 200) {
            alert("El número de expedientes eliminados es " + respuesta.eliminados);
            cargarExpedientes();
        } else {
            alert("Hubo un error al eliminar los expedientes.");
        }
    });
}

// Funciones de los expedientes
//cargar los expedientes al iniciar la vista de inicio

cargarExpedientes()
function mostrarExpediente(id_expediente){
    //hacer un get de todo los expedientes y obtener el id de la fila para identificar que expediente es con un for          
    rest.get('/api/map/'+idMedicoActual+'/expedientes',function(estado,expedientes){//quitar ID
        console.log(estado)
        if (estado == 200){
            expedientes.forEach(expediente=>{
                if(expediente.id == id_expediente) {
                    document.getElementById('id').value = expediente.id;
                    document.getElementById('medEspecialidad').value = expediente.me;
                    document.getElementById('especialidad').value = expediente.especialidad;
                    document.getElementById('sip').value = expediente.sip;
                    document.getElementById('nombrePac').value = expediente.nombre;
                    document.getElementById('apellidosPac').value = expediente.apellidos;
                    document.getElementById('fn').value = expediente.fecha_nacimiento;
                    document.getElementById('codMAP').value = expediente.map;
                    document.getElementById('genero').value = expediente.genero;
                    document.getElementById('observaciones').value = expediente.observaciones;
                    document.getElementById('solicitud').value = expediente.solicitud;
                    document.getElementById('respuesta').value = expediente.respuesta;
                    document.getElementById('fSolicitud').value = expediente.fecha_creacion;
                    document.getElementById('fAsignacion').value = expediente.fecha_asignacion;
                    document.getElementById('fResolucion').value = expediente.fecha_Resolucion;

                    nuevo_expediente = false; //expediente que actualizar
                    ver("expedientePaciente")
                    //ya estarian todos los datos que se tienen en el expediente en la pantalla
                }
            })
        }
        else{
            console.log("No se pueden cargar los expedientes ")
        }
    })
}
// Función para eliminar una fila de la tabla de expedientes
function EliminarFila(fila) {       //funcion que determina lo que sucederá al pulsar el botón eliminar
    var tabla = document.getElementById('tablaExpedientes');       //se obtiene el objeto tabla
    var tbody = tabla.getElementsByTagName('tbody')[0]; // se obtiene el objeto del cuerpo de la tabla
    tbody.removeChild(fila);    //se elimina la fila que se pasa por parámetro del cuerpo de la tabla
    
    id = fila.cells[0].innerHTML;
    
    rest.delete("/api/expediente/"+id, function(estado,expedientes){

    })
}
// Función para crear un nuevo expediente
function crearNuevoExp(){
    cargarEspecialidad();
    cargarGenero();
    
    ver("expedientePaciente") /**Lleva a la vista expediente */
    nuevo_expediente = true;        //el expediente es nuevo
    
    //obtiene el id del ultimo expediente y es el que muestra en el campo ID

    rest.get('/api/map/'+idMedicoActual+'/expedientes',function(estadoExp,expedientes){
        if (estadoExp==200){
            var ultExp = expedientes[expedientes.length-1];
            campoID = document.getElementById("id")
            campoID.value=ultExp.id + 1;
            campoCodMAP = document.getElementById('codMAP')
            campoCodMAP.value=idMedicoActual;

            document.getElementById('sip').value = ""
            document.getElementById('nombrePac').value = ""
            document.getElementById('apellidosPac').value = ""
            document.getElementById('fn').value = ""
            document.getElementById('observaciones').value = ""
            document.getElementById('respuesta').value = "Respuesta predefinida"
            document.getElementById('fSolicitud').value = new Date().toISOString().split('T')[0]
            document.getElementById('fAsignacion').value = ""
            document.getElementById('fResolucion').value = ""
            
        }
    })
    
}
// Función para guardar el expediente
function guardarExp(){
    //Debemos de hacer un if para conocer si hay un expediente que actualizar o otro nuevo que crear
    // Obtener datos del formulario
        var id = document.getElementById('id').value;
        var medEspecialidad = document.getElementById('medEspecialidad').value;
        var especialidad = document.getElementById('especialidad').value;
        var sip = document.getElementById('sip').value;
        var nombre = document.getElementById('nombrePac').value;
        var apellidos = document.getElementById('apellidosPac').value;
        var fechaNacimiento = document.getElementById('fn').value;
        var codMAP = document.getElementById('codMAP').value;
        var genero = document.getElementById('genero').value;
        var observaciones = document.getElementById('observaciones').value;
        var solicitud = document.getElementById('solicitud').value;
        var respuesta = document.getElementById('respuesta').value;
        var fSolicitud = document.getElementById('fSolicitud').value;
        var fAsignacion = document.getElementById('fAsignacion').value;
        var fResolucion = document.getElementById('fResolucion').value;
        // Validar campos obligatorios
        if (!fechaNacimiento) {  // Comprobar si la fecha de nacimiento está vacía
            alert("La fecha de nacimiento es obligatoria.");
            document.getElementById('fn').focus();  // Poner foco en el campo de fecha de nacimiento
            return;  
        }

        if (!sip) {  // Comprobar si el SIP está vacío
            alert("El SIP es obligatorio.");
            document.getElementById('sip').focus();  // Poner foco en el campo de SIP
            return;  
        }

        if (!solicitud) {  // Comprobar si la solicitud está vacía
            alert("La solicitud es obligatoria.");
            document.getElementById('solicitud').focus();  // Poner foco en el campo de solicitud
            return;  
        }

        // Construir objeto de datos
        var datosExpediente = {
            id: id,
            medEspecialidad: medEspecialidad, 
            sip: sip,
            nombre: nombre,
            apellidos: apellidos,
            map: codMAP,
            fn: fechaNacimiento,
            genero: genero,
            observaciones: observaciones,
            especialidad: especialidad,
            solicitud: solicitud,
            respuesta: respuesta,
            fecha_creacion: fSolicitud,
            fecha_asignacion: null, 
            fecha_resolucion: null
        }; 
    if (nuevo_expediente == false){
        //coger los datos del expediente (del formulario)

        //hacer un put en el que se actualice
        rest.put('/api/expedientes/'+id,datosExpediente,function(estado,respuesta){
            if(estado==200){
                console.log("Paciente actualizado")
            }
            else{
                console.log('error')
            }
        })
    }
    else{
        
        rest.post('/api/map/'+idMedicoActual+'/expedientes',datosExpediente,function(estado,respuesta){  //Creo que asi si
            if (estado == 201){
                console.log("éxito")
            }
            else{
                console.log("error")
            }
        })
    }

    cargarExpedientes()//se cargan los expedientes con el nuevo expediente en la tabla
    document.getElementById('sip').value = '';
    document.getElementById('fSolicitud').value = null;
    document.getElementById('id').value = '';
    document.getElementById('nombrePac').value = '';
    document.getElementById('apellidosPac').value = '';
    document.getElementById('codMAP').value = '';
    document.getElementById('fn').value = '';
    document.getElementById('solicitud').value = '';
    ver("Inicio")
}
// Función para cargar los expedientes del médico actual
function cargarExpedientes() {
    var div = document.getElementById('div_expedientes');
    var tabla = document.createElement('table');
    tabla.id = "tablaExpedientes";
    var tbody = document.createElement('tbody');
    var nombre_especialidad = "";

    rest.get("/api/map/"+idMedicoActual+"/expedientes", function(estado_E, expedientes) {
        if (estado_E == 200) {
            document.getElementById("expedienteNo").textContent = ""; // Limpiar mensaje de no expedientes
            console.log("Expedientes cargados:", expedientes);
            if (expedientes.length == 0) {
                document.getElementById("expedienteNo").textContent = "No hay expedientes asignados para este médico.";
                var tablaExistente = document.getElementById('tablaExpedientes');
                if (tablaExistente) {
                    div.removeChild(tablaExistente);
                }
                return;
            }
            var tablaExistente = document.getElementById('tablaExpedientes');
            if (tablaExistente) {
                div.removeChild(tablaExistente);
            }

            var encabezados = ['ID', 'F. Cre', 'F. Asig', 'F. Res', 'Especialidad', 'SIP', 'Eliminar', ' '];
            var filaEncabezados = document.createElement('thead');

            encabezados.forEach(function(encabezado) {
                var th = document.createElement('th');
                th.textContent = encabezado;
                filaEncabezados.appendChild(th);
            });
            tabla.appendChild(filaEncabezados);
            expedientes.forEach(expediente =>{
                    var fila = document.createElement('tr');

                    var colum_id = document.createElement("td");
                    colum_id.setAttribute("data-titulo", "Id");
                    var colum_fechaCre = document.createElement("td");
                    colum_fechaCre.setAttribute("data-titulo","Fecha Creacion")
                    var colum_fechaAsig = document.createElement("td");
                    colum_fechaAsig.setAttribute("data-titulo","Fecha Asignacion")
                    var colum_fechaRes = document.createElement("td");
                    colum_fechaRes.setAttribute("data-titulo","Fecha Resolución")
                    var column_Espe = document.createElement("td");
                    column_Espe.setAttribute("data-titulo","Especialidad")
                    var column_Sip = document.createElement("td");
                    column_Sip.setAttribute("data-titulo","SIP")
                    var column_El = document.createElement("td");
                    var column_chat = document.createElement("td");

                    // Se le asigna valor a cada celda según el contenido del expediente
                    colum_id.innerHTML = expediente.id;
                    colum_fechaCre.textContent = expediente.fecha_creacion;
                    colum_fechaAsig.textContent = expediente.fecha_asignacion;
                    colum_fechaRes.textContent = expediente.fecha_resolucion;
                    

                    // Obtener el nombre de la especialidad CAMBIAR
                    especialidades_global.forEach(esp =>{
                        if(esp.id == expediente.especialidad){
                            column_Espe.textContent = esp.nombre
                        }
                    })
                    
                    column_Sip.textContent = expediente.sip;

                    var botonEliminar = document.createElement("button"); // Creación y adición del botón eliminar
                    botonEliminar.innerHTML = "X";
                    botonEliminar.id = "botonEliminarTabla"
                    botonEliminar.onclick = function() {
                        EliminarFila(fila);
                    };
                    column_El.appendChild(botonEliminar);

                    var botonChatear = document.createElement("button"); // Crear y añadir el botón eliminar
                    botonChatear.innerHTML = "Chat";
                    botonChatear.id = "botonChatearTabla"
                    botonChatear.onclick = function() {
                        event.stopPropagation();
                        exp_id = expediente.id;
                        actualizarMensajes()
                        ver('chat')
                    };
                    column_chat.appendChild(botonChatear);

                    fila.append(colum_id);
                    fila.append(colum_fechaCre);
                    fila.append(colum_fechaAsig);
                    fila.append(colum_fechaRes);
                    fila.append(column_Espe);
                    fila.append(column_Sip);
                    fila.append(column_El);
                    fila.append(column_chat);
                    tbody.appendChild(fila);
                    tabla.appendChild(tbody);

                    fila.onclick = function() {
                        mostrarExpediente(expediente.id);
                    };
                
                
            })
        }
        div.appendChild(tabla);
    });
}

function cargarCentros(){
        //obtener el elemento select
        var select = document.getElementById('centros');
        //Se limipian las opciones del select para que no se acumulen
        select.innerHTML = '';
        rest.get("/api/centros",function(estado,centros){
            
           //Ahora agregamos opciones al select de centros
            centros.forEach((element) => {
                var option = document.createElement('option');
                option.value = element.id;
                option.textContent = element.nombre;
                select.appendChild(option);
        })}); 

}
cargarCentros();

function cargarGenero(){
    var select = document.getElementById('genero');
    //se limpian las opciones del select
    select.innerHTML = '';
    rest.get("/api/genero", function(estadoGen, genero){
        genero.forEach(elemento => {
            var option = document.createElement('option');
            option.value = elemento.id;
            option.textContent = elemento.nombre;
            select.appendChild(option)
        })
    })
}
cargarGenero();

function cargarEspecialidad(){
    var select = document.getElementById("especialidad")
    
    select.innerHTML = '';                          //se limpian las opciones para que no se acumulen
    rest.get('/api/especialidades',function(estadoEsp, especialidades){
        especialidades_global = especialidades
        especialidades.forEach(opcion =>{
            var esp = document.createElement("option")
            esp.value = opcion.id
            esp.textContent = opcion.nombre
            select.appendChild(esp)
        })
    })
}
cargarEspecialidad();


function salir(){
    /**Lleva a la vista de acceso */
    ver("acceso")
}

function volverListado(){
    //lleva a la vista de inicio
    ver("Inicio")
    
}

function cancelar(){
    //lleva a la vista de acceso (sin iniciar sesión)
    ver("acceso")
}


//Registrar tus expedientes en el ministerio de Sanidad
function realizarRegistro(){
    var id_medico = idMedicoActual;
    var nombre_medico = nombreMedicoActual;
    //siempre que le das al boton se hace un post , no se controla si se ha hecho antes o no
    rest.get("/api/map/"+id_medico+"/expedientes", function(estado, expedientes) {
        if(estado == 200){

            var cuerpoDatos = [];
            expedientes.forEach(expediente=>{
                let especialidad_expediente ;
                //saca el nombre de la especialidad
                especialidades_global.forEach(esp =>{
                    if(esp.id == expediente.especialidad){//segun el id de especialidad de cada expediente y elarray donde esta (id->nombre)
                        especialidad_expediente = esp.nombre//asigno el nombre a la especialidad segun la del expediente
                    }
                })
 
                var registro = {//cada registro es un expediente, habrá tantos como tenga el medico de AP
                    medico: nombre_medico,
                    especialidad: especialidad_expediente,
                    fecha_asig: expediente.fecha_asignacion,
                    fecha_resol: expediente.fecha_resolucion,
                }
                cuerpoDatos.push(registro)//se añaden
            })

            var body = {"id_area" : 2, 
                "fecha" : new Date().toISOString().split('T')[0], 
                "datos" :cuerpoDatos}
            //crea el mensaje con el formato pedido
            rest.post("https://undefined.ua.es/telemedicina/api/datos",body,function(estado, respuesta){
                console.log(estado)
                if(estado == 201){
                    alert("El registro de los datos de los expediente se ha enviado al Ministerio de Sanidad correctamente")

                }
                else{
                    alert("Error")
                }
            })
        }
    })
}
function contarRegistros(){
    var id_area = 2;//Aragón
    rest.get("https://undefined.ua.es/telemedicina/api/datos",function(estado, datos){
        if(estado == 200){
            var contador = 0;
            datos.forEach(data => {//examino todos los datos los que son del area que quiero contar
                if(data.id_area == id_area){
                    contador++;
                }
            })
            alert("Se tienen " + contador+ " registros de la Comunidad Autónoma de Aragón")
        }
    })
}
// EXAMEN : // Contar los registros de la Comunidad DE Aragón
function expedientesCV(){
    var id_area = 12;//Aragón
    rest.get("https://undefined.ua.es/telemedicina/api/datos",function(estado, respuesta){
        console.log("obtenido datos")
        if(estado == 200){
            var contador = 0;
            respuesta.forEach(data => {//examino todos los datos los que son del area que quiero contar
                
                if(data.id_area == id_area){//este registro 
                    console.log("este tiene el id que corresponde");
                    (data.datos).forEach(da=>{//recorres el array de datos de dentro
                        console.log("data")
                        if(da.especialidad=="Cardiología"){
                            contador++;
                        }
                    })
                    

                    
                }
            })
            alert("Se tienen " + contador+ " registros de la Comunidad Valenciana ")
        }
    })
}

// VALORACIONES - PRACTICA EXTRAORDINARIA
function misValoraciones(){
    ver("valoraciones");
    // Obtener valoraciones del médico actual
    console.log("Cargando valoraciones del médico con ID:", idMedicoActual);
    cargarValoraciones(idMedicoActual);
    
    // Obtener media de las valoraciones el medico actual
    cargarValoracionMedia(idMedicoActual);
    // Obtener la posicion relativa del médico actual en la lista de médicos ordenados por media de valoraciones. (esto lo calculamos en el servidor)
    cargarPosicionRelativa(idMedicoActual);
    // Le pongo arriba el nombre del médico y su media de valoraciones
    rest.get("/api/medico/"+idMedicoActual, function(estado, medico) {
        if (estado == 200) {
            document.getElementById("nombreMedicoValoracion").textContent = "Dr. " + medico.nombre + " " + medico.apellidos;
            }
        else {
            console.error("Error al obtener el médico:", estado);
            document.getElementById("nombreMedicoValoracion").textContent = "Médico no encontrado";
        }
    })
    // Valoracion relativa

}
function cargarValoraciones(idMap) {
    rest.get("/api/map/" + idMap + "/valoraciones", function(estado,valoraciones) {
        if (estado !== 200) {
            console.error("Error al obtener las valoraciones:", estado);
            document.getElementById("valoracionesMAP").innerHTML = "<p>No se han encontrado valoraciones.</p>";
        }
        if (valoraciones && valoraciones.length > 0) {
            representarValoraciones(valoraciones);
        }
        else {
            alert("No tienes valoraciones registradas.");
        }
    })
}
function representarValoraciones(valoraciones) {
    if (!valoraciones || valoraciones.length === 0) {
        return;
    }
    var contenedor = document.getElementById("valoracionesContainer");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de añadir nuevas valoraciones

    // Tabla y encabezados 
    if (document.getElementById("tablaValoraciones")) {
        contenedor.removeChild(document.getElementById("tablaValoraciones"));
    }
    var tabla = document.createElement("table");
    tabla.id = "tablaValoraciones";
    var thead = document.createElement("thead");
    var filaEncabezados = document.createElement("tr");
    var encabezados = ["Expediente", "Especialista", "Valoración"];
    encabezados.forEach(function(encabezado){
        var th = document.createElement("th");
        th.textContent = encabezado;
        filaEncabezados.appendChild(th);
    })
    thead.appendChild(filaEncabezados);
    tabla.appendChild(thead);
    var tbody = document.createElement("tbody");
    tabla.appendChild(tbody);
    // Añadir las valoraciones a la tabla
    valoraciones.forEach(function(valoracion){
        rest.get("/api/medico/"+valoracion.me_id, function(estado, medico) {
            if (estado != 200) {
                console.error("Error al obtener el médico:", estado);
                return;
            }
            var fila = document.createElement("tr");

            celdaExpediente = document.createElement("td")
            celdaExpediente.textContent = valoracion.expediente_id; // Expediente
            fila.appendChild(celdaExpediente);

            celdaMe = document.createElement("td");
            celdaMe.textContent = medico.nombre + " " + medico.apellidos; // Especialista
            fila.appendChild(celdaMe); // Especialista

            celdaValoracion = document.createElement("td");
            var slider = document.createElement("input");
            slider.type = "range";
            slider.min = 1;
            slider.max = 10;
            slider.step = 1;
            slider.value = valoracion.valoracion; // Valoración del médico
            slider.disabled = true; // Deshabilitar el slider para que no se pueda modificar
            slider.className = "sliderValoracion";
            //Numero bajo slider
            num = document.createElement("div");
            num.textContent = valoracion.valoracion; // Valoración del médico
            num.style.textAlign = "center"; // Centrar el número
            num.style.marginTop = "5px"; // Espacio entre el slider y el número
            celdaValoracion.appendChild(num); // Añadir el número debajo del slider
            // Color según valor
            const value = parseInt(valoracion.valoracion);
            if (value <= 3) {
                slider.classList.add("rojo");
            } else if (value <= 6) {
                slider.classList.add("amarillo");
            } else {
                slider.classList.add("verde");
            }

            // Marcas
            const datalist = document.createElement("datalist");
            const datalistId = `ticks-${valoracion.id}`; // ← id único
            datalist.id = datalistId;
            slider.setAttribute("list", datalistId);

            for (let i = 1; i <= 10; i++) {
                const option = document.createElement("option");
                option.value = i;
                datalist.appendChild(option);
            }

            celdaValoracion.appendChild(slider);
            
            //celdaValoracion.appendChild(datalist);
            fila.appendChild(celdaValoracion);

            tbody.appendChild(fila); 
        })
        
    })
    tabla.appendChild(tbody); 
    contenedor.appendChild(tabla);
}
function cargarValoracionMedia(idMap) {
    rest.get("/api/map/" + idMap + "/valoracion_media", function(estado, valoracionMedia) {
        if (estado !== 200) {
            console.error("Error al obtener la valoración media:", estado);
            return 0; // Retorna 0 en caso de error
        }
        console.log("Valoración media obtenida:", valoracionMedia);
        if (valoracionMedia.media != 0  && valoracionMedia.media !== undefined) {
            document.getElementById("valoracionMedia").textContent = "Su valoración media es: " + valoracionMedia.media.toFixed(2); // Mostrar la media con dos decimales
        
        } else {
            console.error("No se pudo obtener la media de valoraciones.");
            return 0; // Retorna 0 si no hay media
        }

    })
}
function cargarPosicionRelativa(idMAP){
    console.log("Cargando posición relativa del médico actual...");
    rest.get("/api/map/"+idMAP+"/posicion_relativa", function(estado, ids_maps) {
        if (estado != 200) {
            console.error("Error al obtener la posición relativa:", estado);
            return;
        }
        if (ids_maps.length === 0) {
            console.error("No se encontraron valoraciones para calcular la posición relativa del médico.");
            return;
        }
        console.log("Valoraciones obtenidas:", ids_maps);
        posicionRelativa = calcularPosicionRelativa(idMedicoActual, ids_maps);
        document.getElementById("posicionRelativa").textContent = "Su posición relativa es: " + posicionRelativa.posicion + " de " + posicionRelativa.totalPuestos + " médicos";
    })
}
function calcularPosicionRelativa(idMAP, iDs_valoraciones){
    var posicion = 1;
    var valoracion_estudio;
    iDs_valoraciones.forEach(function(medico){//primero asignaas la valoracion al medico
        if (medico.map_id == idMAP){
            valoracion_estudio = medico.val_media;
            console.log("Valoración del médico actual:", valoracion_estudio);
        }
    });
    iDs_valoraciones.forEach(function(medico){//calculas la posicion
        if (valoracion_estudio < medico.val_media){//si tienes media menor estas un puesto por detras de el
            posicion += 1;
        }
    });
    console.log("Posición del médico actual:", posicion);
    console.log("Total de puestos:", iDs_valoraciones.length);
    var totalPuestos = iDs_valoraciones.length;
    return { posicion: posicion, totalPuestos: totalPuestos };
}
//WEB SOCKET medico atencion primaria
var conexion = new WebSocket("ws://localhost:4444/", "medicos");

// Eventos
conexion.addEventListener("open", function () {
    console.log("Cliente conectado!!!");
});

conexion.addEventListener("message", function (event) { //escucha atentamente
    var msg = JSON.parse(event.data);
    switch (msg.operacion) {
        case "limpiar":
            limpiar(msg.id_exp);
            break;
        case "recibirdelMEP":
            anyadir_aInterfazChat("<li class='recibido'> (" + msg.fechaHora + ') ' + msg.nombreMedico + ": " + msg.contenido + "</li>", msg.id_exp);
            actualizarMensajes();
            break;
    }
});
function enviarMensaje(operacion, mensaje) {
    conexion.send(JSON.stringify({ operacion: operacion, mensaje: mensaje }));
}

function enviarMensajeMAP() {
    // Coger el valor del mensaje y limpiar la entrada
    var inputMensaje = document.getElementById("inputMensaje").value;
    document.getElementById("inputMensaje").value = '';  // Limpiar la caja de texto

    // Crear el mensaje directamente
    var msg = crearMensaje(inputMensaje, idMedicoActual);
    enviarMensaje("enviaraMEP", msg);//enviar por wSocket
    console.log("Hemos superado la funcionn de enviar el constructor")

    rest.post('/api/mensajes', { msg }, function (estado, respuesta) {

        if (estado === 201) {
            console.log('Mensaje añadido a la base de datos.');
            // Añadir el mensaje al historial local después de confirmación de la base de datos
            anyadir_aInterfazChat("<li class='enviado'> (" + msg.fechaHora + ') ' + msg.nombreMedico + ": " + msg.contenido + "</li>");
        } else {
            console.log('Error al añadir el mensaje al expediente.');
        }
    });

    // Actualizar los mensajes mostrados
    actualizarMensajes(); // Asegúrate de que esta función esté definida
}



function crearMensaje(contenido, idMed) {//construye el mensaje con la estructura predefinida y establece la hora
    return {
        id_expediente: exp_id,
        medico_id: idMed,
        autor: 'MAP' ,
        contenido: contenido,
        fechaHora: new Date().toLocaleString()
    };
}


function limpiar() {//borra los mensajes del expediente en el que estas -> BORRA ESE CHAT
    rest.delete('/api/mensajes/' + exp_id , function (estado, respuesta) {
        if (estado === 200) {
            actualizarMensajes();
            console.log('Mensajes eliminados.');
        }
    });
}

function anyadir_aInterfazChat(msg) {
    // Añadir el mensaje a la interfaz
    document.getElementById("mensajes_chat").innerHTML += msg;
}

function actualizarMensajes() {
    rest.get('/api/mensajes/' + exp_id, function (estado, mensajes) {
        //se piden los mensajes de ese expediente
        if (estado === 200) {
            document.getElementById("mensajes_chat").innerHTML = ""; // Limpiar el área de mensajes
            mensajes.forEach(function (mensaje) {
                document.getElementById("mensajes_chat").innerHTML += "<li>(" + mensaje.fecha_creacion + ') ' + mensaje.autor + ": " + mensaje.contenido + "</li>";
            });
        }
    });
}


// Evento de conexión cerrada
conexion.addEventListener("close", function () {
    console.log("Desconectado el MAP del servidor!!!");
});

// Evento de error
conexion.addEventListener("error", function () {
    console.log("Error con la conexión del MAP!!!");
});




