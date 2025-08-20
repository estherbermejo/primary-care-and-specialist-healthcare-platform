function obtenerTemperaturaCV(){
    rest.get("https://undefined.ua.es/telemedicina/api/datos", function(estado, datos) {
        if (estado == 200){
            datos.forEach(data => {
                if (data.id_area == 12) { // Comprobar si el id_area es 12 (Comunidad Valenciana)
                    data.datos.forEach(zona =>{
                        registro = {
                            codigo_postal: zona.codigo_postal,
                            temperatura: zona.temperatura,
                        }
                        console.log("Registro creado:", registro);
                       rest.post("/api/temperatura", registro, function(estado, respuesta) {
                            if (estado == 201) {
                                console.log("Registro creado con éxito:", respuesta);
                            } else {
                                console.error("Error al crear el registro:", estado);
                            }
                        })   
                    }) 
                }
            })
        } else {
            console.error("Error al obtener los datos de la API:", estado);
        }
    })
}
servidor.post("/api/temperatura", function(req, res) {
    codigo_postal = req.body.codigo_postal;
    temperatura = req.body.temperatura;
    conexion.query(`insert into temperatura (codigo_postal, temperatura) values ('${codigo_postal}', '${temperatura}')`, function(error, resultado) {
        if (error) {
            console.error("Error al insertar la temperatura:", error);
            return res.status(500).send({ error: "Error al insertar la temperatura" });
        }
        console.log("Temperatura insertada con éxito:", resultado);
        return res.status(201).send({ message: "Temperatura insertada con éxito" });
    });
})
function obtenerTemperaturaMedia(callback){
    rest.get("/api/temperatura", function(estado, temp_media) {
       if (estado == 200) {
            alert("Temperatura media de la Comunidad Valenciana: " + temp_media);
        }
        else if (estado == 404) {
            console.error("No se encontraron datos de temperatura");
            callback({ message: "No se encontraron datos de temperatura" });
        } else {
            console.error("Error al obtener la temperatura media:", estado);
            callback({ error: "Error al obtener la temperatura media" });
        }
    });
}
servidor.get("/api/temperatura", function(req, res) {conexion.query(`select avg(temperatura) as temperatura_media from temperatura`, function(error, temperatura_media) {
    if (error) {
        console.error("Error al obtener la temperatura media:", error);
        return res.status(500).send({ error: "Error al obtener la temperatura media" });
    }
    if (temperatura_media.length > 0) {
        console.log("Temperatura media obtenida:", temperatura_media[0].temperatura_media);
        return res.status(200).send({ temperatura_media: temperatura_media[0].temperatura_media });
    } else {
        console.log("No se encontraron datos de temperatura");
        return res.status(404).send({ message: "No se encontraron datos de temperatura" });
    }
})})


// Ejercicio 1. Crear tabla nueva en la Base de Datos a partir de los datos de la API de telemedicina


//Añades un boton en el html que al pulsarlo llame a esta funccion en el onclick
// <button onclick="crearTablaNueva()">Crear Tabla Nueva</button>

//MAIN del MAP
function crearTablaNueva(){
    rest.get("https://undefined.ua.es/telemedicina/api/datos", function(estado, datos) {
        if (estado == 200){
            datos.forEach(data => {
                if (data.id_area == 12) { // Comprobar si el id_area es 12 (Comunidad Valenciana)
                    
                    data.datos.forEach(medicos =>{
                        registro = {
                            medico: medicos.medico,
                            especialidad: medicos.especialidad,
                            fecha_asig: medicos.fecha_asig,
                            fecha_resol: medicos.fecha_resol
                       }
                       console.log("Registro creado:", registro);
                       rest.post("/api/expedientes", registro, function(estado, respuesta) {
                            if (estado == 201) {
                                console.log("Registro creado con éxito:", respuesta);
                            } else {
                                console.error("Error al crear el registro:", estado);
                            }
                        })   
                    }) 
                }
            })
        }
    })
}
// Servidor del MAP
servidor.post("/api/expedientes", function(req, res) {
    var nuevoRegistro = req.body;
    // Aquí podrías agregar lógica para guardar el nuevo registro en una base de datos
    console.log("Nuevo registro recibido:", nuevoRegistro);
    res.status(201).send(nuevoRegistro); // Responder con el registro creado EL CODIGOOO
})
// En el main lo que haces es obtener los datos de la API, construyyes tu nuevo objeto como quieras y lo envias al servidor
// y en el servidor lo que haces es recibir ese objeto y guardarlo en la base de datos
// MAIN del ME
var insertarCV = app.procedure("insertarCV");
function importarCV(){
    rest.get("https://undefined.ua.es/telemedicina/api/datos", function(estado, registros) {
        if (estado == 200){
            const registrosCV = datos.filter(registros.id_area == 12);

            registrosCV.forEach(registro =>{
                registro.datos.forEach(expediente => {
                    const datosExpediente = {
                        medico: expediente.medico,
                        especialidad: expediente.especialidad,
                        fecha_asig: expediente.fecha_asig,
                        fecha_resol: expediente.fecha_resol
                    };
                    insertarCV(datosExpediente, function(respuesta){
                        if (respuesta.error) {
                            console.error("Error al insertar el registro:", respuesta.error);
                        } else {
                            alert("Registro insertado con éxito:");
                        }
                    })
                })
            })
        }
    })
}
// SERVIDOR del ME
app.resgister(insertarCV)
function insertarV(datos, callback){
    insertar = `insert into expedientes_cv (medico, especialidad, fecha_asig, fecha_resol) values ('${datos.medico}', '${datos.especialidad}', '${datos.fecha_asig}', '${datos.fecha_resol}')`;
    conexion.query(insertar,function(error, resultado){
        if (error){
            console.error("Error al insertar el registro:", error);
            return callback({ error: "Error al insertar el registro" });
        }
        else {
            console.log("Registro insertado con éxito:", resultado);
            return callback("ok");
        }
    })
}
// Ejercicio 2
/* Se desea incoporar información más detallada sobre los expedientes. Para ello se  debe añadir una tabla llamada 'estado_expedientes' que indique  si
un expediente está finalizado o no. En esta tabla se incoporan los siguientes campos:
        - id_expediente: Identificador del expediente (clave primaria).
        - estado: Estado del expediente: iniciado, en proceso, finalizado.
        - dificultad: Dificultad del expediente: baja, media, alta.
En la tabla de expedientes habrá que añadir una nueva columna referenciando a la columna correspondiente en la tabla 'estado_expedientes'. Además, implementar
un nuevo servicio que permita introducir nuevos datos en la tabla 'estado_expedientes' y otro servicio que permita modificar el estado de la tabla 'estado_expedientes'
dado su identificador.
*/
// Hacer una tabla nueva en la base de datos
// Añades una columna nueva en la tabla de expedientes

//<input type="text" id="estado_expediente" name="estado_expediente"></input>
//<input type="text" id="dificultad_expediente" name="dificultad_expediente"></input>
// <button onclick="insertarEstadoExpediente()">Insertar Estado Expediente</button>

// MAIN del ME
app.procedure("crearNuevoEstado");
function insertarEstadoExpediente() {
    var estadoExpediente = document.getElementById("estado_expediente").value;
    var dificultadExpediente = document.getElementById("dificultad_expediente").value;

    nuevoEstado = {
        estado: estadoExpediente,
        dificultad: dificultadExpediente
    };
    crearNuevoEstado(nuevoEstado,function(respuesta) {
        if (respuesta.error) {
            console.error("Error al insertar el estado del expediente:", respuesta.error);
        } else {
            alert("Estado del expediente insertado con éxito:");
        }
    })
}
//Servidor del ME
app.registerAsync(crearNuevoEstado)
function crearNuevoEstado(nuevoEstado, callback ){
    consulta = `insert into estado_expedientes (estado, dificultad) values ('${nuevoEstado.estado}', '${nuevoEstado.dificultad}')`;
    conexion.query (consulta, function(error, respuesta){
        if (error) {
            console.error("Error al insertar el estado del expediente:", error);
            return callback({ error: "Error al insertar el estado del expediente" });
        } else {
            console.log("Estado del expediente insertado con éxito");
            return callback("ok");
        }
    })
}
// Para el update coges el id del expediente y pillas su estado_expediente, luego los updateas
// MAIN del ME
app.procedure("actualizarEstadoExpediente");
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
// Servidor del ME
app.registerAsync(updateEstado)
function updateEstado(estado_actualizado, callback) {
    consulta = `UPDATE estado_expedientes es
    JOIN expedientes ex ON ex.estado_expediente = es.id
    SET es.estado = '${estado_actualizado.estado}', es.dificultad = '${estado_actualizado.dificultad}' 
    WHERE ex.id = ${estado_actualizado.id_expediente}`;
    conexion.query(consulta, function(error, respuesta) {
        if (error) {
            console.error("Error al actualizar el estado del expediente:", error);
            return callback({ error: "Error al actualizar el estado del expediente" });
        } else {
            console.log("Estado del expediente actualizado con éxito", respuesta.affectedRows);
            return callback("ok");
        }
    });
}

// Ejercicio. Examen 1 Grupo 1
/*Se desea incoporar información al proyecto desarrollado en la practica 1. Se pretende en que provincia de la Comunidad Valenciana trabaja cada médico. Para ello se tendrá que añadir a la abase de datos la tabla Provincias
en la que figuran las provincias con sus identificadores {id:1, nombre:"Alicante"}, {id:2, nombre:"Castellón"}, {id:3, nombre:"Valencia"}.
y en la tabla con información del médico que se dberá añadir el identificador de cada provincia
Para mostrar esta nueva informacion se debera implementar un nuevo y ÚNICO servicio RES, que dado el NOMBRE de un provincia se muestren todos los médicos que pertenecen a esa provincia.

*/
// SERVIDOR EN REST
servidor.get("/api/provincia/:nombre", function(req, res) {
    nombreProvincia = req.params.nombre;
    consulta = `select m.nombre, m.apellidos from medicos m JOIN pronvincias p ON p.id = m.provincia_id where p.nombre = '${nombreProvincia}'`;
    // Seleccionas el nombre y los apellidos de la tabla MEDICOS, uniendo tabla provincias campo id con el id_provincia de medico 
    // cuando el campo nombre de provincias sea el del cuerpo de la peticion
    conexion.query(consulta, function(error, medicos) {
        if (error) {
            console.error("Error al obtener los médicos por provincia:", error);
            return res.status(500).send({ error: "Error al obtener los médicos por provincia" });
        }
        if (medicos.length > 0) {
            console.log("Médicos encontrados:", medicos);
            return res.status(200).send(medicos); // Devuelve los médicos encontrados
        } else {
            console.log("No se encontraron médicos para la provincia:", nombreProvincia);
            return res.status(404).send({ message: "No se encontraron médicos para la provincia especificada" });
        }
    });
})
function obtenerMedicosPorProvincia( callback) {
    nombreProvincia = document.getElementById("nombreProvincia").value;
    // <input type="text" id="nombreProvincia" name="nombreProvincia"></input>
    // <button onclick="obtenerMedicosPorProvincia()">Obtener Médicos por Provincia</button>
    rest.get(`/api/provincia/${nombreProvincia}`, function(estado, datos) {
        if (estado == 200) {
            console.log("Médicos encontrados:", datos);
            callback(datos); // Devuelve los médicos encontrados
        } else if (estado == 404) {
            console.error("No se encontraron médicos para la provincia especificada");
            callback({ message: "No se encontraron médicos para la provincia especificada" });
        } else {
            console.error("Error al obtener los médicos por provincia:", estado);
            callback({ error: "Error al obtener los médicos por provincia" });
        }
    })
}