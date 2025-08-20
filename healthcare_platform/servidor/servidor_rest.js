const mysql = require("mysql")

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
const bodyParser = require('body-parser');
//Modulo express libreria REST
var express = require("express");
const {hostname} = require("os");
const cors = require("cors");
const fs = require('fs'); // Importar el módulo fs

var especialidades = []; // Array para almacenar las especialidades
var centros = []; // Array para almacenar los centros
var genero = []; // Array para almacenar los géneros

var servidor = express();
// Aumentar el tamaño máximo permitido
servidor.use(bodyParser.json({ limit: '10mb' })); // Cambia '10mb' al tamaño que consideres adecuado
servidor.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Para formularios

// rutas
//Estas funciones sirven para que al poner una URL te muestre el index
servidor.use("/map", express.static("../map")); // servir la web del cliente
servidor.use("/me", express.static("../me")); // servir la web del cliente

servidor.use("/", express.json({ strict: false })); // interpretar el body de la solicitud como JSON 
servidor.use(cors());


//Métodos GET y POST

//Get para obtener las especialidades

servidor.get("/api/especialidades", function (req, res){    //1
    var sql_especialidades = "select * from especialidades"
        conexion.query(sql_especialidades, function(err,data) {
            if (err) {
                console.log('Error en la query obtención especialidades: ', err);
                return;
            }

        //vaciar el array especialidades
            especialidades.length = 0;
        //se rellena el array de especialidades
            for (var i = 0; i < data.length;i++){
                var especialidad = {
                    id: data[i].id,
                    nombre : data[i].nombre
                }

                especialidades.push(especialidad)

            }
            siguienteIdEspecialidad = especialidades.length //indica cual es el siguiente idEspecialidad
        });
    res.status(200).json(especialidades);
})
//Get para obtener los centros
servidor.get("/api/centros", function(req, res){        //2
    var sql_centros = "select * from centros"
    conexion.query(sql_centros, function(err, data){
        if (err) {
            console.log('Error en la query obtención centros: ', err);
            return;
        }
        //vaciar el array centros
        centros.length = 0;
        //rellenar el array centros
        for (var i = 0; i < data.length; i++) {
            var centro = {
                id: data[i].id,
                nombre: data[i].nombre

            }
            centros.push(centro)
        }
        
        siguienteIdCentros = centros.length
    })
    res.status(200).json(centros);
});
//Post realiza un login para médico
servidor.post("/api/medico/login",function(req,res){ //3
    console.log("Login médico")
    var contrasena = req.body.password;
    var login = req.body.login
    var sql_medicos = `select * from medicos where login='${login}' and password='${contrasena}' and especialidad=0`

    conexion.query(sql_medicos, function(err, data){
        console.log("Datos de la query: ",data)
        if (err) {
            console.log('Error en la query login: ', err);
            return;
        }
        if (data == []){//si el conjunto de data es vacio no 404
            res.status(204).json("No se ha encontrado al médico con ese usuario")
        }
        else{
            console.log("La consulta ha sido éxitosa")
            medico  = {
                id: data[0].id,
                nombre: data[0].nombre,
                apellidos: data[0].apellidos,
                login: data[0].login,
                password: data[0].password,
                especialidad: data[0].especialidad,
                centro: data[0].id_centro
            }
            
            return res.status(200).json(medico); //solo deberia devolver el id
        }  
    })
    
});

//Obtiene los datos del medico, no devuelve la contaeseña
servidor.get("/api/medico/:id",function(req,res){//4
    var id = req.params.id;
    sql_idM = `select * from medicos where id=${id}`
    conexion.query(sql_idM, function(err, data){
        if (err) {
            console.log("Error en la query obtener datos medico",err);
            return
        }
        if (data == []){//si el conjunto de data es vacio 
            res.status(204).json("No se ha encontrado al médico con el id: "+id)
        }
        else{
            
            var medicoSinPass = {
                id: data[0].id,
                nombre : data[0].nombre,
                apellidos : data[0].apellidos,
                login : data[0].login,
                especialidad: data[0].especialidad,
                centro: data[0].centro
            }
            res.status(200).json(medicoSinPass);//no se tiene que omstrar la contraseña
            return;
        }        
    })
    
})


//5. Crea un nuevo médico. Mandar en el body todos los datos excepto ID, que lo creará 
servidor.post("/api/medicos", function(req,res){  
    
    login = req.body.login
    
    //El servidor comprobará que no se repite el campo login con otro médico.
    var sql_login = `select id from medicos where login = '${login}'`  
    conexion.query(sql_login, function(err, data){
        if(err){
            console.log("Error login query",err);
        }
        if(data.length != 0){// si devuelve datos -> existe alguien con ese login
            console.log("El login esta repetido")
            res.status(403).json("Login repetida")
            return

        }
        else{//Inserta los datos del nuevo medico
            var sql_nuevoMed = `insert into medicos ( nombre, apellidos, login, password, especialidad, centro) 
            values ('${req.body.nombre}', '${req.body.apellidos}', '${req.body.login}', '${req.body.password}',
            '0','${req.body.centro}')`
            conexion.query(sql_nuevoMed, function(err, nuevo_data){
                if(err){
                    console.log("Error query nuevo médico",err);
                    res.status(500).json("Error al crear el nuevo médico");
                    return
                }
                res.status(201).json({
                    message: "Nuevo médico creado con éxito",
                    nuevoMedico: nuevo_data
                });
                })
        }
    })

    
})
servidor.put("/api/medico/:id",function(req,res){   // 6.Cambia la información del médico indicado en el ID. Nuevamente evitar que se repita un login con otro médico
    id = req.params.id;
    //
    sql_update = `update medicos set nombre='${req.body.nombre}', apellidos='${req.body.apellidos}', 
    login='${req.body.login}', password='${req.body.password}', especialidad='0', centro='${req.body.centro}' where id ='${id}'`
    conexion.query(sql_update, function(err,data){
        if(err){
            console.log("Error al actualizar los datos del médico",err)
        }
        else{
            
           res.status(200).json("Médico cambiado con éxito") 
        }
    })
})
//Get para los géneros
servidor.get("/api/genero", function(req, res){
    var sql_genero = "select * from genero"
        conexion.query(sql_genero, function(err,data) {
            if (err) {
                console.log('Error en la query obtención genero: ', err);
                return;
            }

        //vaciar el array especialidades
            genero.length = 0;
        //se rellena el array de especialidades
            for (var i = 0; i < data.length;i++){
                var gen = {
                    id: data[i].id,
                    nombre : data[i].nombre
                }

                genero.push(gen)

            }
        });
    res.status(200).json(genero);
});

//Get para obtener el 'ID' de los expedientes del MAP
servidor.get("/api/map/:id/expedientes", function(req,res){//7. Obtiene un array con los expedientes creados por un MAP
    id = req.params.id
    expedientes_delMAP = [];
    //selecciona los expedientes que estén asignados al medico de atención primaria con id = ${id}
    var sql_expedientesMAP = `select * from expedientes where map = '${id}'`
    conexion.query(sql_expedientesMAP, function(err,data){
        if(err){
            console.log("Error en la quera obtener expedientes de este map:"+ id+". ", err)
        }
        else{
            for(var i = 0; i < data.length; i++){
                //crea un nuevo objeto expediente con los datos obtenidos y se formatean los que sean necesarios

                exp = {
                    id: data[i].id,
                    map: data[i].map,
                    me: data[i].me,
                    sip: data[i].sip,
                    nombre: data[i].nombre,
                    apellidos: data[i].apellidos,
                    fecha_nacimiento: data[i].fecha_nacimiento ? new Date(data[i].fecha_nacimiento).toISOString().split('T')[0] : null,
                    genero: data[i].genero,
                    observaciones: data[i].observaciones,
                    solicitud: data[i].solicitud,
                    respuesta: data[i].respuesta,
                    fecha_creacion: data[i].fecha_creacion ? new Date(data[i].fecha_creacion).toISOString().split('T')[0] : null,//essta linea da minisustos
                    fecha_asignacion: data[i].fecha_asignacion ? new Date(data[i].fecha_asignacion).toISOString().split('T')[0] : null,
                    fecha_resolucion: data[i].fecha_resolucion ? new Date(data[i].fecha_resolucion).toISOString().split('T')[0] : null,
                    especialidad: data[i].especialidad
                }
                expedientes_delMAP.push(exp)

            }
            res.status(200).json(expedientes_delMAP);
        }
    })
})


//Post para hacer un nuevo expediente
servidor.post("/api/map/:id/expedientes", function (req, res) { //8.Crea un nuevo expediente para el id de MAP indicado
    
    const nuevoExpediente = {
        map: req.body.map,
        me: null,
        sip: req.body.sip,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        fecha_nacimiento: req.body.fn,
        genero: req.body.genero,
        observaciones: req.body.observaciones,
        especialidad: req.body.especialidad,
        solicitud: req.body.solicitud,
        respuesta: req.body.respuesta,
        fecha_creacion: req.body.fecha_creacion,  // Fecha actual en formato YYYY-MM-DD
        fecha_asignacion: null,
        fecha_resolucion: null
    };
    

    
    var sql_nuevoExp = `insert into expedientes 
    (map, me, sip, nombre, apellidos, fecha_nacimiento, genero, observaciones, especialidad, solicitud, respuesta, fecha_creacion, fecha_asignacion, fecha_resolucion)
    values (${nuevoExpediente.map}, ${nuevoExpediente.me}, '${nuevoExpediente.sip}', '${nuevoExpediente.nombre}', '${nuevoExpediente.apellidos}', 
    '${nuevoExpediente.fecha_nacimiento}', '${nuevoExpediente.genero}', '${nuevoExpediente.observaciones}', '${nuevoExpediente.especialidad}', 
    '${nuevoExpediente.solicitud}', '${nuevoExpediente.respuesta}', '${nuevoExpediente.fecha_creacion}', ${nuevoExpediente.fecha_asignacion}, ${nuevoExpediente.fecha_resolucion})`;

    
    conexion.query(sql_nuevoExp, function(err,nuevoExp){
        if(err){
            console.log("Error query nuevo expediente",err);
            res.status(500).json("Error al crear el nuevo expediente");
            return
        }
        console.log("Expediente guardado con exito")
        res.status(201).json({
            message: "Nuevo expediente creado con éxito",
            nuevoExp: nuevoExp
        })
    })
});

//Put de los expedientes
servidor.put("/api/expedientes/:id",function(req,res){//9. Actualiza los datos de un expediente. No pasar los datos prohibidos anteriormente.
    id = req.params.id;
    sql_updateExp = `update expedientes set
        map = '${req.body.map}',
        me = ${req.body.me !== undefined ? `'${req.body.me}'` : 'NULL'},          
        sip = '${req.body.sip}', nombre = '${req.body.nombre}', apellidos = '${req.body.apellidos}', 
        fecha_nacimiento = '${req.body.fn}', genero = '${req.body.genero}',  observaciones = '${req.body.observaciones}', 
        especialidad = '${req.body.especialidad}', 
        solicitud = '${req.body.solicitud}', respuesta = '${req.body.respuesta}', 
        fecha_creacion = '${req.body.fecha_creacion}', 
        fecha_asignacion = ${req.body.fecha_asignacion !== undefined ? `'${req.body.fecha_asignacion}'` : 'NULL'}, 
        fecha_resolucion = ${req.body.fecha_resolucion !== undefined ? `'${req.body.fecha_resolucion}'` : 'NULL'} 
        WHERE id = '${id}'`; // Asegura que se actualiza el registro correcto usando el ID


    conexion.query(sql_updateExp, function(err, result) {
        if (err) {
            console.error("Error al actualizar el expediente:", err);
            return res.status(500).json({ message: "Error al actualizar el expediente." });
        }

        // Verificar 
        if (result.affectedRows > 0) {// affectedRows indica las filas afectadas por la consulta
            res.status(200).json("Expediente cambiado con éxito");
        } else {
            res.status(404).json({ message: "Expediente no encontrado." });
        }
    });
})

//Delete de expediente con ese ID
servidor.delete('/api/expediente/:id', function (req, res) {    //10. borra un expediente
    var id = req.params.id;
    sql_borrarExp = `delete from expedientes where id = '${id}'`;
    conexion.query(sql_borrarExp, function (err, result) {
        if (err) {
            console.error("Error al borrar el expediente:", err);
            return res.status(500).json({ message: "Error al borrar el expediente."})
                
            }
        // Verificar si se borró el expediente
        if (result.affectedRows > 0) {
            res.status(200).json("Expediente borrado con éxito");
            } else {
            res.status(404).json({ message: "Expediente no encontrado." });
        }})
    
});


//Historico de los mensajes RETO
//Eliminar los mensajes relacionados con un expediente en la tabla mensajes
servidor.delete('/api/mensajes/:idExp', function(req, res) {
    var idExp = req.params.idExp;
    sql_eliminar = `delete from mensajes where expediente_id = '${idExp}' and autor = 'MAP'`
    conexion.query(sql_eliminar, function(err, result) {
        if(err){
            console.log("Error en la query eliminar mensajes",err)
            return res.status(500).json({error: "Error al eliminar los mensajes"})
        }
        if(result.affectedRows > 0){
            res.status(200).json("Mensajes borrados con éxito")
        }
        else{
            res.status(404).json({message: "No hay mensajes para eliminar"})
        }
    })
})

//Gestion de imagenes 
servidor.post("/api/expediente/:id/fotos", function (req, res) {
    console.log("soy el post del servidor el de las fotos")
    //mando el expediente id
    var imagen = req.body.imagen
    var id_expediente = req.params.id
    console.log(id_expediente)
    
    conexion.query(`insert into fotos (expediente) values (${id_expediente})`,function(err,result){
        if (err) {
            console.error("Error al insertar la imagen en la base de datos:", err);
            return res.status(500).json({ error: 'Error al guardar la imagen en la base de datos' });
        }
        // Obtener el id de la imagen insertada
        const id_imagen = result.insertId;

        // Generar el nombre del archivo basado en num_exp y id_imagen
        const nombreImagen = `imagen${id_imagen}.jpg`;
        //guardar la imagen en la carpeta
        console.log("Voy a guardarme la foto en el directorio")
        fs.writeFileSync("../imagenes/"+nombreImagen, imagen, { encoding: "base64" });//exp+num foto METER EN LA CARPETA IMAGENES
        console.log("Imagen recibida y almacenada:", nombreImagen);
        res.json({ mensaje: 'Imagen guardada correctamente', idImagen: id_imagen });
    })
    
    
});

// Obtener foto
servidor.get("/api/expediente/:id/fotos", function (req, res) {
    console.log("Solicita imagen");
    var idExpediente = req.params.id; // Se obtiene el id del expediente

    // Hacer una consulta a la base de datos
    conexion.query(`SELECT * FROM fotos WHERE expediente = ${idExpediente}`, function (err, BDfotos) {
        if (err) {
            console.error("Error al obtener la imagen de la base de datos:", err);
            return res.status(500).json({ error: 'Error al obtener la imagen de la base' });
        }

        var arrayImagenes = []; // Es un array de objetos de tipo {id, fecha, img}

        // Recorro los resultados para procesar cada imagen
        BDfotos.forEach(function (foto) {
            var idFoto = foto.id;
            var fecha = foto.fecha;
            var nombreFto = "imagen" + idFoto + ".jpg";
            console.log("Leo la imagen",idFoto);

            try {
                var imagen = fs.readFileSync("../imagenes/" + nombreFto, { encoding: "base64" });
                arrayImagenes.push({ id: idFoto, fecha: fecha, img: imagen }); // Se añade al array
            } catch (error) {
                console.error("Error al leer la imagen del archivo:", error);
            }
        });

        res.json(arrayImagenes);
    });
});
//Eliminar imagen
servidor.delete("/api/foto/:id", function(req, res) {
    console.log("Eliminando foto con ID:", req.params.id); // Para depurar
    var idFoto = req.params.id;

    // Asegúrate de que la consulta SQL sea correcta
    conexion.query(`DELETE FROM fotos WHERE id = '${idFoto}'`, function(err, result) {
        if (err) {
            console.log("Error al eliminar la foto:", err);
            return res.status(500).json({ error: 'Error al eliminar la foto' });
        }

        var eliminados = result.affectedRows; // Las filas eliminadas: affected
        var ruta = '../imagenes/imagen' + idFoto + '.jpg';
        fs.unlink(ruta, err => {
            console.log("Ruta de la imagen a eliminar:", ruta);
            if (err) {
                console.log("Error al eliminar la imagen:", err);
                return res.status(500).json({ error: 'Error al eliminar la imagen' });
            }
            else{
                console.log("Imagen eliminada con éxito");
            }
        });

        if (eliminados > 0) {
            return res.status(200).json(true);
        } else {
            return res.status(404).json(false);
        }
    });
});

//Subir mensajes del map
servidor.post('/api/mensajes', function(req, res) {
    //se extraen los datos
    var expedienteId = req.body.msg.id_expediente;
    var medicoId = req.body.msg.medico_id;//Se asume que el ID del médico se envia
    var autor = req.body.msg.autor; //MAP o ME
    var contenido = req.body.msg.contenido;
    var fecha  = req.body.msg.fechaHora
    // Crear la consulta SQL para insertar el mensaje
    var sql_insertMensaje = `insert into mensajes (expediente_id, medico_id, autor, contenido, fecha_creacion) 
    values ('${expedienteId}', '${medicoId}', '${autor}', '${contenido}','${fecha}')`;

    // Ejecutar la consulta
    conexion.query(sql_insertMensaje, function(err, result) {
        if (err) {
            console.log("Error al insertar el mensaje:", err);
            return res.status(500).json("Error al añadir el mensaje"); // Error en la base de datos
        }
        return res.status(201).json("Mensaje añadido con éxito"); //todo ha ido bien
    });
});

// Practica extraordinaria
// Todas las valoraciones de un MAP
servidor.get("/api/map/:id/valoraciones", function(req, res) { //11. Obtiene un array con las valoraciones de un MAP
    idMAP = req.params.id;
    conexion.query(`select * from valoraciones where map_id = '${idMAP}'`, function(err, valoraciones) {
        if (err) {
            console.error("Error al obtener las valoraciones:", err);
            return res.status(500).json({ error: 'Error al obtener las valoraciones' });
        }
        
        // Si no hay valoraciones, devolver un array vacío
        if (valoraciones.length === 0) {
            return res.status(200).json([]);
        }
        // Devolver las valoraciones obtenidas
        res.status(200).json(valoraciones);
    })
})
// Media de las valoraciones de un MAP
servidor.get("/api/map/:id/valoracion_media", function(req, res) { //11. Obtiene un array con las valoraciones de un MAP
    idMAP = req.params.id;
    conexion.query(`select avg(valoracion) as media from valoraciones where map_id = '${idMAP}'`, function(err, valoracion) {
        if (err) {
            console.error("Error al obtener la valoración media:", err);
            return res.status(500).json({ error: 'Error al obtener la valoración media' });
        }
        
        // Si no hay valoraciones, devolver un array vacío
        if (valoracion.length === 0 || valoracion[0].media === null) {
            return res.status(200).json({ media: 0 });
        }
        // Devolver la valoración media obtenida
        res.status(200).json({ media: valoracion[0].media });
    })
})
// Posicion relativa: Dic clave:valor => idMAP: valoracion media
servidor.get("/api/map/:id/posicion_relativa", function(req, res) { //12. Obtiene la posición relativa de un MAP en función de su valoración media
    // obtener los map_id y su valoracion media
    idMAP = req.params.id;
    
    conexion.query(`select map_id, avg(valoracion) as val_media from valoraciones group by map_id`,function(err,ids_medias){
        if (err){
            console.error("Error al obtener las valoraciones medias de los MAPs:", err);
        }
        if (ids_medias.length === 0) {
            return res.status(200).json(0); // No hay valoraciones, posición 0
        }
        else {
            res.status(200).json(ids_medias);
        }
    })
})

//Poner en marcha el servidor en un puerto.
var puerto = 3000;
servidor.listen(puerto, function(){
    console.log("Servidor en marcha en puerto", puerto);
});
