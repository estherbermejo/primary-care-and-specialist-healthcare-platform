//Datos
var especialidades = [
    {id: 0, nombre: "Atención Primaria"},
    {id: 1, nombre: "Cardiología"},
    {id: 2, nombre: "Dermatología"}
]
var genero = [
    {id: 0, nombre: "Masculino"},
    {id: 1, nombre: "Femenino"},
    {id: 2, nombre: "Otro"}
]

var centros = [
    {id:0, nombre: "Hospital General Universitario Dr. Balmis"},
    {id:1, nombre: "Hospital Universitario de San Juan de Alicante"},
    {id:2, nombre: "Hospital General de Elche"},
    {id:3, nombre: "Hospital de la Marina Baja" },
    {id:4, nombre: "Hospital General de Elda" },
    {id:5, nombre: "Hospital Universitario del Vinalopó" },
    {id:6, nombre: "Hospital la Pedrera" },
    {id:7, nombre: "Hospital San Vicente" },
    {id:8, nombre: "Hospital de Torrevieja" },
    {id:9, nombre: "Hospital Virgen de los Lirios" }
]
var medicos = [
    {id: 1, nombre: "María Josefa", apellidos:"Buero Vallejo", login:"map1",password:'map1', especialidad:0, centro:7},
    {id: 2, nombre: "María de las Mercedes", apellidos:"de Orleans y Borbón", login:"map2", password:"map2", especialidad:0, centro:3},
    {id: 3, nombre:'Jose Carlos', apellidos:'García', login:'me1', password:"me1", especialidad:1 ,centro:9},
    {id: 4, nombre:'María de los Ángeles', apellidos:'López', login:'me2', password:"me2",especialidad:1,centro:0},
    {id: 5, nombre:'Guiomar', apellidos:'Canales', login:'me3', password:"me3",especialidad:2,centro:2},
    {id: 6, nombre: "Luis", apellidos: "Gómez Sánchez", login: "me4", password: "me4", especialidad: 2, centro: 1}
]
var expedientes = [
    {id: 1, map: 1, me: "", sip: "85494455", nombre: "Lola", apellidos: "Castillo Martínez", fecha_nacimiento: '2000-02-27', genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: '2024-01-20', fecha_asignacion: null, fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 2, map: 1, me: "", sip: "44785596", nombre: "Alba", apellidos: "Moreno López", fecha_nacimiento: '2000-08-21', genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: '2024-03-18', fecha_asignacion: null, fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 3, map: 1, me: 3, sip: "11452365", nombre: "Taylor", apellidos: "Swift", fecha_nacimiento: '1997-02-01', genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: '2024-03-18', fecha_asignacion: '2020-11-12', fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 4, map: 1, me: 5, sip: "99887744", nombre: "Foley", apellidos: "Cissé Camara", fecha_nacimiento: '2003-09-25', genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: '2023-12-19', fecha_asignacion: '2020-09-21', fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 5, map: 2, me: "", sip: "11223344", nombre: "Andrea", apellidos: "Sala Aracil", fecha_nacimiento: '2003-05-18', genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: '2024-01-20', fecha_asignacion: null, fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 6, map: 2, me: "", sip: "33221100", nombre: "Carlos", apellidos: "Martínez Pérez", fecha_nacimiento: "2002-11-05", genero: 0, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2023-12-19", fecha_asignacion: null, fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 7, map: 2, me: 4, sip: "77889900", nombre: "María", apellidos: "Gutiérrez Sánchez", fecha_nacimiento: "2001-07-30", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-01-20", fecha_asignacion: '2020-01-02', fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 8, map: 2, me: 6, sip: "66554433", nombre: "Pedro", apellidos: "García Fernández", fecha_nacimiento: "1998-03-14", genero: 0, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-03-18", fecha_asignacion: '2019-06-12', fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 9, map: 2, me: 4, sip: "11235813", nombre: "Julia", apellidos: "García", fecha_nacimiento: "2000-01-01", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-02-02", fecha_asignacion: '2019-12-01', fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 10, map: 2, me: 3, sip: "98765432", nombre: "Miguel", apellidos: "Hernández", fecha_nacimiento: "1999-04-15", genero: 0, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-04-01", fecha_asignacion: '2021-11-12', fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 11, map: 1, me: 5, sip: "45678901", nombre: "Ana", apellidos: "Pérez", fecha_nacimiento: "2001-05-20", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-05-10", fecha_asignacion: '2021-05-08', fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 12, map: 1, me: "", sip: "65432109", nombre: "David", apellidos: "Martín", fecha_nacimiento: "2002-08-30", genero: 0, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-06-15", fecha_asignacion: null, fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 13, map: 1, me: "", sip: "54875963", nombre: "Pedro", apellidos: "Lopez", fecha_nacimiento: "2000-11-12", genero: 0, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-07-01", fecha_asignacion: null, fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 14, map: 1, me: 5, sip: "96325889", nombre: "Dani", apellidos: "Martinez", fecha_nacimiento: "2003-02-14", genero: 0, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-02-14", fecha_asignacion: '2018-09-23', fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 15, map: 1, me: 6, sip: "99887722", nombre: "Cristina", apellidos: "Jimenez", fecha_nacimiento: "1997-06-20", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-06-20", fecha_asignacion: '2022-12-01', fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 16, map: 2, me: 6, sip: "44556687", nombre: "Paloma", apellidos: "Gutierrez", fecha_nacimiento: "1998-11-11", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-04-05", fecha_asignacion: '2023-08-27', fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []},
    {id: 17, map: 2, me: "", sip: "22334455", nombre: "Paola", apellidos: "Fernandez", fecha_nacimiento: "2001-07-23", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-03-01", fecha_asignacion: null, fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 18, map: 1, me: "", sip: "11223344", nombre: "Iker", apellidos: "Rodriguez", fecha_nacimiento: "1999-05-18", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-02-18", fecha_asignacion: null, fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 19, map: 2, me: "", sip: "11223344", nombre: "Nuria", apellidos: "Díaz", fecha_nacimiento: "2001-03-10", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-01-10", fecha_asignacion: null, fecha_resolucion: null, especialidad: 1, mensajesMEP: [], mensajesMAP: []},
    {id: 20, map: 2, me: 3, sip: "99887766", nombre: "Eva", apellidos: "Sánchez", fecha_nacimiento: "2002-12-22", genero: 1, observaciones: "", solicitud: "solicitud realizada por el MAP a un ME", respuesta: null, fecha_creacion: "2024-02-22", fecha_asignacion: '2015-09-12', fecha_resolucion: null, especialidad: 2, mensajesMEP: [], mensajesMAP: []}
];

var siguienteIdEspecialidad =  3;
var siguienteIdCentros = 10;
var siguienteIdMedico = 7;
var siguienteIdExpediente = 9;


exports.especialidades = especialidades;
exports.genero = genero;
exports.centros = centros;
exports.medicos = medicos;
exports.expedientes = expedientes;
exports.siguienteIdEspecialidad = siguienteIdEspecialidad;
exports.siguienteIdCentros = siguienteIdCentros;
exports.siguienteIdExpediente = siguienteIdExpediente;
exports.siguienteIdMedico =  siguienteIdMedico;
