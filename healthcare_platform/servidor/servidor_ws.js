//servidor webSocket
var http = require("http");
var httpServer = http.createServer();

var WebSocketServer = require("websocket").server;//instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
    httpServer: httpServer
});

var puerto = 4444;
httpServer.listen(puerto, function(){
    console.log("Servidor de WebSocket iniciado en puerto:", puerto);
});
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

var conexiones = [];

wsServer.on("request", function (request) {
    var connection = request.accept("medicos", request.origin);
    
    var cliente = {
        conexion: connection,
        nombre: null
    };
    conexiones.push(cliente);
    console.log("Cliente conectado");
    
    // Manejo de mensajes recibidos
    connection.on("message", function(message) {
        if (message.type === "utf8") {
            var msg = JSON.parse(message.utf8Data);
            console.log("Mensaje recibido:", msg);

            // Manejo de operaciones según el tipo
            switch (msg.operacion) {
                case "limpiar":
                    enviarATodos({ operacion: "limpiar" });
                    break;
                case "grupal"://enviar por grupal
                    enviarATodos(msg);
                    break;
                case "enviaraMEP":
                    enviarMensajeEspecifico("recibirdelMAP", msg.mensaje, cliente);
                    break;
        
                case "enviaraMAP":
                    enviarMensajeEspecifico("recibirdelMEP", msg.mensaje, cliente);
                    break;
            }
        }
    });

    connection.on("close", function () {
        console.log("Cliente desconectado");
        conexiones = conexiones.filter(c => c !== cliente);
    });
});
// Función para enviar mensajes a todos los clientes
function enviarATodos(mensaje) {
    var data = JSON.stringify(mensaje);
    conexiones.forEach(c => c.conexion.sendUTF(data));
}

// Función para enviar mensajes específicos (MAP o MEP)
function enviarMensajeEspecifico(operacion, mensaje, cliente) {
    var msg = JSON.stringify({ operacion: operacion, mensaje: mensaje });
    // Envía el mensaje al cliente específico
    cliente.conexion.sendUTF(msg);
}

//hasta aqui la estructura basica