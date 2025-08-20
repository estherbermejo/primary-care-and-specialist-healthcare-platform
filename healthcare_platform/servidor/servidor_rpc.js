const mysql = require("mysql")
const child_process = require("child_process");

const database = {
	host : 'localhost',
	user : 'usuario_telemedicina',
	password : 'esther000',
	database : 'telemedicina2024'
};

var conexion = mysql.createConnection(database);

conexion.connect(function (err) {
	if (err) {
		console.error('Error en la conexión de la base de datos:',err);
		process.exit();
	}
})

//Obtener la referencia de la libreria RPC
var rpc = require("./rpc_servidor.js");
const cors = require("cors");
const fs = require('fs'); // Importar el módulo fs
const { ChildProcess } = require("child_process");
//Obtener la referencia a los datos 
//var datos = require("./datos.js")

//Se inicializan los arrays de los datos

var genero = [];
var centros = [];
var expedientes = [];

//A continuacion se definen las funciones para obtener arrays de datos
function obtenerEspecialidades(callback) {
    var especialidades = [];  // Inicializamos el array vacío

    var sql_especialidades = "SELECT * FROM especialidades";
    conexion.query(sql_especialidades, function(err, data) {
        if (err) {
            console.log('Error en la query obtención especialidades: ', err);
            return callback(err, null);  // Devuelve el error al callback
        }
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var especialidad = {
                    id: data[i].id,
                    nombre: data[i].nombre
                };
                especialidades.push(especialidad);
            }
        }
        // Llamar al callback pasando null como error y el array de especialidades
        return callback(especialidades);
    });
}
function obtenerCentros(callback) {
    var sql_centros = "SELECT * FROM centros";
    conexion.query(sql_centros, function(err, data) {
        if (err) {
            console.log('Error en la query obtención centros: ', err);
            return callback(err, null);  // Devuelve el error al callback
        }
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var centro = {
                    id: data[i].id,
                    nombre: data[i].nombre
                };
                centros.push(centro);
            }
        }

        return callback(centros);  // Devuelve el array de centros
    });
}
function obtenerPatologias(callback) {
    conexion.query("SELECT * FROM patologias", function(err, data) {
        if (err) {
            console.log('Error en la query obtención patologías: ', err);
            return callback(err, null);  // Devuelve el error al callback
        }
        var patologias = [];
        console.log("Datos obtenidos de patologías:", data);
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var patologia = {
                    id: data[i].id,
                    nombre: data[i].nombre
                };
                console.log("Patología obtenida:", patologia);
                patologias.push(patologia);
            }
        }
        return callback(patologias);  // Devuelve el array de patologías
    });
}
function actualizarPatologia(id_expediente, nombre, callback) {
    // Actualiza la patología en la base de datos
    const consulta = `
        UPDATE expedientes
        SET patologia = ?
        WHERE id = ?
    `;
    conexion.query(consulta, [nombre, id_expediente], function(err, resultado) {
        if (err) {
            console.log('Error al actualizar la patología: ', err);
            return callback(false);  // Retorna false en caso de error
        }
        if (resultado.affectedRows > 0) {
            console.log('Patología actualizada con éxito.');
            return callback(true);  // Retorna true si la actualización fue exitosa
        } else {
            console.log('No se encontró el expediente para actualizar la patología.');
            return callback(false);  // Retorna false si no se encontró el expediente
        }
    });
}

function obtenerGenero(callback){
    conexion.query("select * from genero", function(err, data){
        if (err) {
            console.log('Error en la query obtención genero: ', err);
            return
        }
        genero.length = 0; //vacia el array de genero
        for (var i = 0; i < data.length; i++) {//tras
            var ge = {
                id: data[i].id,
                nombre: data[i].nombre
            }
            genero.push(ge)
        }
        return callback(genero)
    })
    
}
function obtenerExpediente(id_exp, callback) {
    conexion.query(`select * from expedientes where id = '${id_exp}'`, function(err, data) {
        if (err) {
            console.log('Error en la query de obtención de expediente: ', err);
            return callback(null); // Retorna null en caso de error
        }

        if (data.length === 0) {
            console.log('No se encontró ningún expediente con ese id.');
            return callback(null); // Retorna null si no se encuentra el expediente
        }


        // Función para validar y formatear fechas
        function formatFecha(fecha) {
            if (fecha && !isNaN(Date.parse(fecha))) {
                return new Date(fecha).toISOString().split('T')[0]; // Formato YYYY-MM-DD
            }
            return null; // Si la fecha es inválida, retorna null
        }

        // Crear el objeto expediente con las fechas formateadas
        const expediente = {
            id: data[0].id,
            map: data[0].map,
            me: data[0].me,
            sip: data[0].sip,
            nombre: data[0].nombre,
            apellidos: data[0].apellidos,
            fecha_nacimiento: formatFecha(data[0].fecha_nacimiento),
            genero: data[0].genero,
            observaciones: data[0].observaciones,
            solicitud: data[0].solicitud,
            respuesta: data[0].respuesta,
            fecha_asignacion: formatFecha(data[0].fecha_asignacion),
            fecha_resolucion: formatFecha(data[0].fecha_resolucion),
            fecha_creacion: formatFecha(data[0].fecha_creacion),
            especialidad: data[0].especialidad
        };

        return callback(expediente); // Devuelve el expediente a través del callback
    });
}

function obtenerDatosMedico(id_ME, callback){//los datos seran:nombre, apellidos, login, contraseña, centro y especialidad
    conexion.query(`select * from medicos where id = '${id_ME}'`,function(err, datos_medico){
        if (err) { console.log('Error al obtener los datos del médico: ', err); }
        if (datos_medico.length === 0) {
            console.log('Médico no encontrado.');
            return callback(null, null); // Devolver null si no se encuentra el médico
        }
        else{
            var medico_sin_password = {
                id: datos_medico[0].id,
                nombre: datos_medico[0].nombre,
                apellidos: datos_medico[0].apellidos,
                login: datos_medico[0].login,
                especialidad: datos_medico[0].especialidad,
                centro: datos_medico[0].centro
            }
            return callback(medico_sin_password);
        }})
}

function obtenerExpDisponibles(id_especialidad, callback){
    conexion.query(`select id, map, fecha_creacion from expedientes where especialidad = '${id_especialidad}' 
        and fecha_asignacion is null and me is null`, function(err, data){
        if (err){
            console.log('Error al obtener expedientes disponibles: ', err);
        }
        return callback(data);
    })
}


function obtenerExpAsignados(id_me, callback){
    //var expedientes_asignados = [];//array de los exp. a los q se les ha asignado el medico en cuestion
    conexion.query(`select * from expedientes where me = '${id_me}'`, function(err, expedientes_asignados){
        if (err){
            console.log('Error al obtener expedientes asignados: ', err);
            }
        return callback(expedientes_asignados)
    })
}

function login(login, password, callback){//si es null es que no existe o no es especialista INCLUYE CALLBACK , tambien en return para todo lo que hay que devolver al cliente
    id_ME = null;
    //return id_ME
    conexion.query(`select id from medicos where login = '${login}' and password = '${password}'`, function(err, data){
        if (err) {
            console.log("No se encuentran los datos")
        }
        if (data.length > 0){
            id_ME = data[0].id
        }
        return callback(id_ME)
    })
}

function crearME(datos, callback){//los datos seran: nombre, apellidos, login, contraseña, centro y especialidad
    conexion.query(`select * from medicos where login='${datos.login}'`, function(err, data){
        if (err){
            console.log('Error en la query creación ME: ', err);
        }
        if (data.length > 0){
            console.log('El login ya existe')
            return callback(err)
        }
        else{
            conexion.query(`insert into medicos (nombre, apellidos, login, password, especialidad, centro) values
                ('${datos.nombre}', '${datos.apellidos}','${datos.login}','${datos.password}','${datos.especialidad}','${datos.centro}')
                `, function(err, data){
                    if (err) {
                        console.log('Error en la query creación ME, no se han podido insertar datos correctamente: ', err);
                    }
                    //se devuelve el id del nuevo medico creado
                    return callback(data.insertId)
                })

        }
    })
}

function actualizarme(id_me,data, callback){
    //se actualizan los datos
    conexion.query(`update medicos set nombre='${data.nombre}', apellidos='${data.apellidos}', login='${data.login}',
        especialidad='${data.especialidad}', centro='${data.centro}' where id='${id_me}'`, function(err,result){
            if (err) {
                console.log('Error al actualizar los datos del médico: ', err);
                return callback(err, false);  // Devolver false en caso de error
            }
            // Verificar si el medico se actualizado
            if (result.affectedRows > 0) {
                console.log('Médico actualizado con éxito.');
                return callback(true);  // Médico actualizado con éxito
            } else {
                console.log('Médico no encontrado.');
                return callback(false);  // No se encontró el médico con ese ID
            }
        } )
}

function resolverExp(id_exp,respuesta, callback){
    // Query SQL para actualizar los expedientes
    conexion.query(`update expedientes set fecha_resolucion=NOW() and respuesta='${respuesta}'
    where id = '${id_exp}'`, function(err, result) {
        if (err) {
            console.log('Error al resolver expediente: ', err);
            return callback(false)
        }
        console.log("Expediente resuelto con éxito")
        return callback(true)
    })
}

function asignarExp(id_me,id_ex,callback){
    conexion.query(`update expedientes set me = ${id_me}, fecha_asignacion = NOW()
    where id = '${id_ex}'`, function(err,resultado){
        if(err){
            console.log('Error al asignar expediente: ', err);
            return callback(false)
        }
        return callback(true)

    })
}
function obtenerFotos(idExpediente, callback){
    conexion.query(`select * from fotos WHERE expediente = ${idExpediente}`, function(err,fotos){
        if(err){
            console.log('Error al obtener fotos: ', err);
            callback(false)
        }
        var arrayImagenes = [];//es un array de objetos de tipo {id}
        //recorro un for
        fotos.forEach(function (foto) {
            var idFoto = foto.id;
            var fecha = foto.fecha;
            var nombreFto = "imagen" + idFoto + ".jpg";
            console.log("Leo la imagen");

            try {
                var imagen = fs.readFileSync("../imagenes/" + nombreFto, { encoding: "base64" });
                arrayImagenes.push({ id: idFoto, fecha: fecha, img: imagen }); // Se añade al array
            } catch (error) {
                console.error("Error al leer la imagen del archivo:", error);
            }
        });
        callback(arrayImagenes)
    })
}
//Filtrado de imagenes
function filtrarImagen(idImagen, operacion,opcion,callback){
    // llamará al comando ttmagen con los argumentos necesarios
    var rutaImagenEntrada = "../imagenes/imagen"+idImagen+".jpg"
    
    const rutaImagenSalida = `../imagenes/imagen${idImagen}_filtrada.jpg`
    
    // El comando `ttimagen` sigue la sintaxis correcta.
    const comando = `ttimagen "${rutaImagenEntrada}" "${rutaImagenSalida}" "${operacion}" ${opcion}`;//sobre una imagen concreta del servidor creando una imagen filtrada
    child_process.exec(comando,(error)=>{
        console.log("Mi comando",comando)
        if (error) {
            console.error(`Error ejecutando el comando: ${error.message}`);
            return;
        }
        console.log("Imagen filtrada correcta")
        //Lee la imagen del directorio
        fs.readFile(rutaImagenSalida, { encoding: "base64" },(err,imagen_filtrada)=>{
            console.log("Imagen leída de la ruta")
            if(err){
                console.log('Error al leer la imagen filtrada: ', err);
                return callback(err)
                }
            //borra la imagen
            fs.unlink(rutaImagenSalida, (err)=>{
                console.log("Imagen borrada correctamente")
                if(err){
                    console.log('Error al borrar la imagen filtrada: ', err);
                    return callback(err)
                }
                callback(imagen_filtrada);
            //devuelve el archivo
            })
        });
    })
    
    
}
//Funcionalidades del servidor para la parte extraordinaria de la práctica
function consultarValoracion(id_exp, id_map, id_me, callback){//obtiene el id de la valoracion si existe, si no lo crea y devuelve el id de la nueva valoracion
    // Primero, verifica si ya existe una valoración para el expediente y el médico
    conexion.query(`select id from valoraciones where expediente_id = '${id_exp}' and map_id = '${id_map}' and me_id = '${id_me}'`, function(err, data){
        if (err) {
            console.log("No ha sido posible consultar la valoración ", err);
            return callback({ error: "Error al consultar la valoración" }, null);
            }
        if (data.length > 0) {
            return callback(data[0].id);
        } else {
            return callback(null);
        }
    })
}

function crearValoracion(id_exp, id_map, id_me, valoracion, callback){//crea una nueva valoracion y devuelve el id de la nueva valoracion
    conexion.query(`insert into valoraciones (expediente_id, map_id, me_id, valoracion) values ('${id_exp}', '${id_map}', '${id_me}', '${valoracion}') `, function(err, data){
        if (err) {
            console.log("No ha sido posible crear la valoración ", err);
            return callback(null); // Retorna null en caso de error
        }
        return callback(data.insertId); // Devuelve el id de la nueva valoración
    })
}
function actualizarValoracion(id_valoracion, valoracion, callback){//actualiza la valoracion
    
    // Actualiza la valoración en la base de datos
    conexion.query(`update valoraciones set valoracion = '${valoracion}' where id = '${id_valoracion}'`, function(err, resultado){
        if (err) {
            console.log("No ha sido posible actualizar la valoración ", err);
            return callback(false); // Retorna false en caso de error
        }
        if (resultado.affectedRows > 0) {
            console.log("Valoración actualizada con éxito");
            return callback(true); // Retorna true si la actualización fue exitosa
        } else {
            console.log("No se encontró la valoración para actualizar");
            return callback(false); // Retorna false si no se encontró la valoración
        }

    })
}
function obtenerValoracion(id_exp, id_map, id_me, callback) {
    // Obtiene la valoración de un expediente
    conexion.query(
        `select id, valoracion from valoraciones where expediente_id = '${id_exp}' and map_id = '${id_map}' and me_id = '${id_me}'`,
        function (err, data) {
            if (err) {
                console.log("No ha sido posible obtener la valoración ", err);
                return callback({ error: "Error al obtener la valoración" }, null);
            }
            if (data.length > 0) {
                // Devuelve un objeto con id y valoracion
                return callback(data[0].valoracion);
            } else {
                // No se encontró valoración
                return callback(null);
            }
        }
    );
}
function obtenerValoracionMediadelMap(id_map, callback) {
    // Obtiene la valoración de un expediente
    conexion.query(
        `select avg(valoracion) as media from valoraciones where map_id = '${id_map}'`,
        function (err, data) {
            if (err) {
                console.log("No ha sido posible obtener la valoración ", err);
                return callback({ error: "Error al obtener la valoración" }, null);
            }
            if (data.length > 0) {
                return callback(data[0].media);
            } 
        }
    );
}
// PRUEBA DE EJERCICIOS


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
// Examen

//Metodos de RPC con mensajes

function anyadirMensaje(mensaje,id_exp){//este mtodo esta corregido
    console.log("El mensaje que llega",mensaje)
    //Extraigo los datos del mensaje
    var expedienteId = id_exp
    var medicoId = mensaje.medicoId
    var autor = mensaje.autor
    var contenido = mensaje.contenido
    var fecha = mensaje.fechaHora
    // Almacenar el mensaje en la base de datos
    var sql_insertMensaje = `insert into mensajes (expediente_id, medico_id, autor, contenido, fecha_creacion) 
    values ('${expedienteId}', '${medicoId}', '${autor}', '${contenido}','${fecha}')`;

    conexion.query(sql_insertMensaje, function (err, result) {
        if (err) {
            console.log("Error al insertar el mensaje en la base de datos:", err);
            return callback({ error: "Error al añadir los mensajes" }, null);
        }
        if (result.affectedRows > 0) {
            // Mensajes añadidos con éxito al cliente RPC
            return callback(null, { message: "Mensajes añadidos con éxito" });
        } else {
            // Enviar mensaje de "No se han añadido" al cliente RPC
            return callback({ message: "No se han añadido los mensajes" }, null);
        }
    });

    return expedientes;
}

function limpiarMensajes(id_exp, callback){//este metodo esta corregido
    sql_eliminar = `delete from mensajes where expediente_id = '${id_exp}' and autor='ME'`
    conexion.query(sql_eliminar, function(err, result) {
        if(err){
            console.log("Error en la query eliminar mensajes",err)
            return callback({ error: "Error al eliminar los mensajes" }, null);
        }
        if (result.affectedRows > 0) {
            console.log("Mensajes borrados con éxito.");
            // Enviar éxito al cliente RPC
            return callback(null, { message: "Mensajes borrados con éxito" });
        } else {
            // Enviar mensaje de "No hay mensajes" al cliente RPC
            return callback({ message: "No hay mensajes para eliminar" }, null);
        }
    })
}

//Se crea el servidor RPC
var servidor = rpc.server();
var app = servidor.createApp("medico_especialista")//este nombre es el que se vincula al principio del main

//Registro de los metodos que se van a desarrollar
app.registerAsync(obtenerEspecialidades);
app.registerAsync(obtenerCentros);
app.registerAsync(login);
app.registerAsync(crearME);
app.registerAsync(actualizarme)
app.registerAsync(obtenerDatosMedico);
app.registerAsync(obtenerExpDisponibles);
app.registerAsync(asignarExp);
app.registerAsync(obtenerExpAsignados);
app.registerAsync(resolverExp);
app.registerAsync(obtenerGenero);
app.registerAsync(anyadirMensaje);
app.registerAsync(obtenerExpediente);
app.registerAsync(limpiarMensajes);
app.registerAsync(obtenerFotos);
app.registerAsync(filtrarImagen);
app.registerAsync(obtenerValoracion);
app.registerAsync(crearValoracion);
app.registerAsync(actualizarValoracion);
app.registerAsync(consultarValoracion);
app.registerAsync(obtenerValoracionMediadelMap);
// REGISTRO DE LOS METODOS DE PRUEBA DE EJERCICIOS
app.registerAsync(updateEstado);
app.registerAsync(obtenerPatologias);
app.registerAsync(actualizarPatologia);

//Console el servidor funciona correctamente
console.log("RPC en marcha")

