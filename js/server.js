// Importa el framework Express para la creación de rutas y servidor HTTP
const express=require("express");
// Importa el controlador mysql2 para conectarse a la base de datos MySQL
const mysql=require("mysql2");
// Importa el middleware CORS para permitir peticiones desde el frontend en el navegador
const cors=require("cors");

// Inicializa la aplicación de Express
const app=express();
// Define el puerto donde escuchará el servidor local
const PORT=3000;

// Mensaje de confirmación en la consola del backend al cargar el script
console.log("🔥 SERVER NUEVO CARGADO");

// Habilita el soporte de peticiones cruzadas (CORS)
app.use(cors());
// Habilita el procesamiento automático de cuerpos de mensajes en formato JSON
app.use(express.json());

// Parámetros de configuración de la conexión con la base de datos MySQL en la nube
const conexion=mysql.createConnection({
    host:"40.233.7.26",
    user:"biblioteca_app",
    password:"Biblioteca@2026!",
    database:"biblioteca"
});


// Establece el enlace directo con el motor de la base de datos MySQL
conexion.connect(error=>{
    if(error){
        console.log("❌ Error MySQL:",error);
    }else{
        console.log("✅ Conectado a MySQL");
    }
});


// ENDPOINT DE INICIO DE SESIÓN (LOGIN)
app.post("/login",(req,res)=>{

// Extrae del cuerpo (body) de la petición los parámetros usuario y contraseña
const {usuario,contraseña}=req.body;

// Consulta SQL parametrizada utilizando '?' para prevenir ataques de inyección SQL
const sql=`
SELECT id_usuario,nombre,apellido,usuario,correo,rol
FROM usuarios
WHERE usuario=? AND contraseña=?
`;

// Ejecuta la consulta SQL pasando los parámetros recibidos
conexion.query(sql,[usuario,contraseña],(error,resultado)=>{

if(error){
console.log(error);
return res.status(500).json({mensaje:"Error servidor"});
}

// Condicional: si la consulta retorna al menos un registro coincide con la cuenta
if(resultado.length>0){

res.json({
mensaje:"Login correcto",
usuario:resultado[0] // Envía al frontend los datos del usuario autenticado (sin exponer la contraseña)
});

}else{

res.json({
mensaje:"Usuario o contraseña incorrectos"
});

}

});

});



// ENDPOINT DE REGISTRO DE NUEVO USUARIO
app.post("/registro",(req,res)=>{

// Extrae todos los datos enviados desde el formulario de registro HTML
const {
nombre,
apellido,
matricula,
correo,
telefono,
carrera,
contraseña
}=req.body;


// Lógica interna para construir el identificador del usuario (nombre + apellido sin espacios y en minúsculas)
const usuario=(nombre+apellido)
.toLowerCase()
.replaceAll(" ","");


// Sentencia SQL para insertar el nuevo perfil en la tabla 'usuarios'
const sql=`
INSERT INTO usuarios
(nombre,apellido,usuario,contraseña,correo,matricula,telefono,carrera,rol)
VALUES(?,?,?,?,?,?,?,?,?)
`;


// Ejecuta la inserción en la base de datos
conexion.query(
sql,
[
nombre,
apellido,
usuario,
contraseña,
correo,
matricula,
telefono,
carrera,
"Alumno" // Se asigna automáticamente el rol 'Alumno'
],
error=>{

if(error){

console.log("❌ Error registro:",error);

return res.status(500).json({
mensaje:"Error al registrar usuario"
});

}

// Responde al frontend que la transacción fue exitosa
res.json({
mensaje:"Usuario creado correctamente"
});


});

});



// ENDPOINT PARA GUARDAR UN NUEVO LIBRO
app.post("/libros",(req,res)=>{

// Desestructura la información requerida para el alta del libro
const {
titulo,
autor,
categoria,
cantidad
}=req.body;


// Sentencia SQL para insertar registros en la tabla 'libros'
const sql=`
INSERT INTO libros
(titulo,autor,categoria,cantidad)
VALUES(?,?,?,?)
`;


// Ejecuta la consulta de inserción enviando el arreglo de datos del libro
conexion.query(
sql,
[
titulo,
autor,
categoria,
cantidad
],
error=>{

if(error){

console.log("❌ Error libro:",error);

return res.status(500).json({
mensaje:"Error al guardar libro"
});

}


// Devuelve mensaje de confirmación
res.json({
mensaje:"Libro guardado correctamente"
});


});

});



// ENDPOINT PARA OBTENER LOS LIBROS POR CATEGORÍA
app.get("/libros/:categoria",(req,res)=>{

// Captura el parámetro enviado dinámicamente en la URL
const categoria=req.params.categoria;


// Consulta SQL para filtrar los registros por la categoría especificada
const sql="SELECT * FROM libros WHERE categoria=?";


// Consulta la base de datos enviando la categoría recibida
conexion.query(
sql,
[categoria],
(error,resultado)=>{


if(error){

console.log("❌ ERROR MYSQL LIBROS:",error);

return res.status(500).json({
mensaje:error.message
});

}


// Imprime en la consola de Node.js la lista de libros encontrados en la BD
console.log("📚 Libros encontrados:",resultado);


// Devuelve al cliente el arreglo de objetos JSON correspondiente a los libros
res.json(resultado);


});

});



// ENDPOINT DE VERIFICACIÓN / ESTADO
app.get("/",(req,res)=>{
res.send("Servidor Biblioteca funcionando");
});



// INICIALIZACIÓN DEL SERVIDOR
app.listen(PORT,()=>{

// Escucha las peticiones entrantes en el puerto asignado (3000)
console.log(`🚀 Servidor corriendo en puerto ${PORT}`);

});