const express=require("express");
const mysql=require("mysql2");
const cors=require("cors");

const app=express();
const PORT=3000;

app.use(cors());
app.use(express.json());

console.log("Intentando conectar a MySQL...");

const conexion=mysql.createConnection({
host:"40.233.7.26",
user:"biblioteca_app",
password:"Biblioteca@2026!",
database:"biblioteca",
connectTimeout:10000
});

console.log("Configuración MySQL cargada");
conexion.connect(error=>{
if(error) console.log("❌ Error MySQL:",error);
else console.log("✅ Conectado a MySQL");
});


app.post("/login",(req,res)=>{

const {usuario,contraseña}=req.body;

const sql=`
SELECT id_usuario,nombre,apellido,usuario,correo,rol
FROM usuarios
WHERE usuario=? AND contraseña=?`;

conexion.query(sql,[usuario,contraseña],(error,resultado)=>{

if(error)return res.status(500).json({mensaje:"Error servidor"});

if(resultado.length>0)
res.json({mensaje:"Login correcto",usuario:resultado[0]});
else
res.json({mensaje:"Usuario o contraseña incorrectos"});

});

});


app.post("/registro",(req,res)=>{

const {nombre,apellido,matricula,correo,telefono,carrera,contraseña}=req.body;

const usuario=(nombre+apellido).toLowerCase().replaceAll(" ","");

const sql=`
INSERT INTO usuarios
(nombre,apellido,usuario,contraseña,correo,matricula,telefono,carrera,rol)
VALUES(?,?,?,?,?,?,?,?,?)`;

conexion.query(sql,
[nombre,apellido,usuario,contraseña,correo,matricula,telefono,carrera,"Alumno"],
error=>{

if(error)return res.status(500).json({mensaje:"Error registro"});

res.json({mensaje:"Usuario creado correctamente"});

});

});


app.post("/libros",(req,res)=>{

const {titulo,autor,categoria,cantidad}=req.body;

const sql=`
INSERT INTO libros(titulo,autor,categoria,cantidad)
VALUES(?,?,?,?)`;

conexion.query(sql,
[titulo,autor,categoria,cantidad],
error=>{

if(error)return res.status(500).json({mensaje:"Error libro"});

res.json({mensaje:"Libro guardado correctamente"});

});

});
app.get("/libros/:categoria",(req,res)=>{

const categoria=req.params.categoria;

conexion.query(
"SELECT * FROM libros WHERE categoria=?",
[categoria],
(error,resultado)=>{

if(error)return res.status(500).json({mensaje:"Error libros"});

res.json(resultado);

});

});
app.post("/prestamos",(req,res)=>{

const {
usuario,
libro,
fecha_entrega,
fecha_tramite,
nombre_prestatario
}=req.body;


conexion.query(
"SELECT id_usuario FROM usuarios WHERE usuario=?",
[usuario],
(errorUsuario,usuarios)=>{


if(errorUsuario){
console.log("❌ Error buscando usuario:", errorUsuario);
return res.status(500).json({mensaje:"Error usuario"});
}


if(usuarios.length===0)
return res.status(404).json({mensaje:"Usuario no encontrado"});


const id_usuario=usuarios[0].id_usuario;



conexion.query(
"SELECT id_libro,cantidad FROM libros WHERE titulo=?",
[libro],
(errorLibro,libros)=>{


if(errorLibro)
return res.status(500).json({mensaje:"Error libro"});


if(libros.length===0)
return res.status(404).json({mensaje:"Libro no encontrado"});


const id_libro=libros[0].id_libro;
const cantidad=libros[0].cantidad;



if(cantidad<=0){

return res.json({
mensaje:"Libro no disponible"
});

}



conexion.query(
`
INSERT INTO prestamos
(id_usuario,id_libro,fecha_entrega,fecha_tramite,nombre_prestatario)
VALUES(?,?,?,?,?)
`,
[
id_usuario,
id_libro,
fecha_entrega,
fecha_tramite,
nombre_prestatario
],
(error,resultado)=>{


if(error){

console.log("❌ Error préstamo:",error);

return res.status(500).json({
mensaje:"Error préstamo"
});

}



// RESTAR STOCK DEL LIBRO //
console.log("Intentando actualizar stock del libro:", id_libro);
conexion.query(
`
UPDATE libros
SET cantidad=cantidad-1
WHERE id_libro=?
`,
[id_libro],
function(errorStock){

    if(errorStock){
        console.log("❌ Error actualizando stock:", errorStock);
    }else{
        console.log("✅ Stock actualizado");
    }

}
);
res.json({

mensaje:"Préstamo guardado",
codigo:resultado.insertId

});


});


});


});


});


app.get("/",(req,res)=>{

res.send("Servidor Biblioteca funcionando");

});


app.listen(PORT,()=>{

console.log("🚀 Servidor corriendo en puerto "+PORT);

});