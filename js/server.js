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

conexion.connect(error=>{
    if(error)
        console.log("❌ Error MySQL:",error);
    else
        console.log("✅ Conectado a MySQL");
});


// LOGIN
app.post("/login",(req,res)=>{

    const {usuario,contraseña}=req.body;

    const sql=`
    SELECT id_usuario,nombre,apellido,usuario,correo,rol
    FROM usuarios
    WHERE LOWER(usuario)=LOWER(?) AND contraseña=?
    `;

    conexion.query(sql,[usuario,contraseña],(error,resultado)=>{

        if(error)
            return res.status(500).json({mensaje:"Error servidor"});

        if(resultado.length>0){

            res.json({
                mensaje:"Login correcto",
                usuario:resultado[0]
            });

        }else{

            res.json({
                mensaje:"Usuario o contraseña incorrectos"
            });

        }
    });
});


// REGISTRO USUARIOS
app.post("/registro",(req,res)=>{

    const {
    nombre,
    apellido,
    matricula,
    correo,
    telefono,
    carrera,
    contraseña
    }=req.body;


    const usuario=(nombre.trim()+apellido.trim())
    .toLowerCase()
    .replaceAll(" ","");


    const sql=`
    INSERT INTO usuarios
    (nombre,apellido,usuario,contraseña,correo,matricula,telefono,carrera,rol)
    VALUES(?,?,?,?,?,?,?,?,?)
    `;

    conexion.query(sql,[
    nombre.trim(),
    apellido.trim(),
    usuario,
    contraseña,
    correo,
    matricula,
    telefono,
    carrera,
    "Alumno"
    ],error=>{

        if(error)
            return res.status(500).json({mensaje:"Error registro"});

        res.json({
            mensaje:"Usuario creado correctamente",
            usuario
        });

    });

});


// REGISTRO LIBROS
app.post("/libros",(req,res)=>{

    const {
    titulo,
    autor,
    categoria,
    cantidad
    }=req.body;


    const sql=`
    INSERT INTO libros(titulo,autor,categoria,cantidad)
    VALUES(?,?,?,?)
    `;


    conexion.query(sql,
    [titulo.trim(),autor,categoria,cantidad],
    error=>{

        if(error)
            return res.status(500).json({mensaje:"Error libro"});

        res.json({
            mensaje:"Libro guardado correctamente"
        });

    });

});


// MOSTRAR LIBROS POR CATEGORIA
app.get("/libros/:categoria",(req,res)=>{

    const categoria=req.params.categoria;

    conexion.query(
    "SELECT id_libro,titulo,autor,cantidad FROM libros WHERE categoria=?",
    [categoria],
    (error,resultado)=>{

        if(error)
            return res.status(500).json({mensaje:"Error libros"});

        res.json(resultado);

    });

});


// GUARDAR PRESTAMO
app.post("/prestamos",(req,res)=>{

    const {
    usuario,
    libro,
    fecha_entrega,
    fecha_tramite,
    nombre_prestatario
    }=req.body;


    const usuarioNormalizado=usuario.trim();
    const libroNormalizado=libro.toString().trim();


    // Buscar usuario
    conexion.query(
    "SELECT id_usuario FROM usuarios WHERE LOWER(usuario)=LOWER(?)",
    [usuarioNormalizado],
    (errorUsuario,usuarios)=>{

        if(errorUsuario)
            return res.status(500).json({mensaje:"Error usuario"});

        if(usuarios.length===0)
            return res.status(404).json({mensaje:"Usuario no encontrado"});

        const id_usuario=usuarios[0].id_usuario;

        // Buscar libro por ID o por Título
        const sqlLibro = "SELECT id_libro,cantidad FROM libros WHERE id_libro=? OR LOWER(titulo)=LOWER(?)";

        conexion.query(
        sqlLibro,
        [libroNormalizado, libroNormalizado],
        (errorLibro,libros)=>{

            if(errorLibro)
                return res.status(500).json({mensaje:"Error libro"});

            if(libros.length===0)
                return res.status(404).json({mensaje:"Libro no encontrado"});

            const id_libro=libros[0].id_libro;
            const cantidad=libros[0].cantidad;

            // Revisar disponibilidad
            if(cantidad<=0){
                return res.json({
                    mensaje:"Libro no disponible"
                });
            }

            // Insertar préstamo
            conexion.query(
            `
            INSERT INTO prestamos
            (id_usuario,id_libro,fecha_entrega,fecha_tramite,nombre_prestatario,estado)
            VALUES(?,?,?,?,?,'Prestado')
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

                // Actualizar inventario (-1)
                conexion.query(
                "UPDATE libros SET cantidad=cantidad-1 WHERE id_libro=?",
                [id_libro]
                );

                res.json({
                    mensaje:"Préstamo guardado",
                    codigo:resultado.insertId
                });

            });

        });

    });

});


// BUSCAR PRESTAMOS ACTIVOS POR NOMBRE
app.get("/prestamos/nombre/:nombre",(req,res)=>{

    const nombre=req.params.nombre;

    conexion.query(
    `
    SELECT
    prestamos.id_prestamo,
    usuarios.nombre,
    usuarios.apellido,
    libros.titulo,
    prestamos.fecha_entrega,
    prestamos.estado
    FROM prestamos
    INNER JOIN usuarios ON prestamos.id_usuario=usuarios.id_usuario
    INNER JOIN libros ON prestamos.id_libro=libros.id_libro
    WHERE LOWER(CONCAT(usuarios.nombre,' ',usuarios.apellido)) LIKE LOWER(?)
    AND prestamos.estado='Prestado'
    `,
    ["%"+nombre+"%"],
    (error,resultado)=>{

        if(error){
            console.log("Error buscando préstamos:",error);
            return res.status(500).json({ mensaje:"Error buscando préstamos" });
        }

        res.json(resultado);

    });

});


// BUSCAR PRESTAMO PARA DEVOLUCION POR ID
app.get("/prestamos/:id",(req,res)=>{

    const id=req.params.id;

    conexion.query(
    `
    SELECT 
    prestamos.id_prestamo,
    usuarios.usuario,
    libros.titulo,
    prestamos.fecha_entrega,
    prestamos.estado
    FROM prestamos
    INNER JOIN usuarios ON prestamos.id_usuario=usuarios.id_usuario
    INNER JOIN libros ON prestamos.id_libro=libros.id_libro
    WHERE prestamos.id_prestamo=?
    `,
    [id],
    (error,resultado)=>{

        if(error){
            console.log("Error buscando préstamo:",error);
            return res.status(500).json({ mensaje:"Error buscando préstamo" });
        }

        if(resultado.length===0){
            return res.json({ mensaje:"Préstamo no encontrado" });
        }

        res.json(resultado[0]);

    });

});


// REGISTRAR DEVOLUCION (MARCAR DEVUELTO Y AUMENTAR INVENTARIO)
app.put("/prestamos/:id",(req,res)=>{

    const id=req.params.id;

    // Buscar libro relacionado al préstamo
    conexion.query(
    "SELECT id_libro FROM prestamos WHERE id_prestamo=?",
    [id],
    (error,resultado)=>{

        if(error){
            console.log("Error buscando préstamo:",error);
            return res.status(500).json({ mensaje:"Error buscando préstamo" });
        }

        if(resultado.length===0){
            return res.json({ mensaje:"Préstamo no encontrado" });
        }

        const id_libro=resultado[0].id_libro;

        // Cambiar estado del préstamo a Devuelto
        conexion.query(
        "UPDATE prestamos SET estado='Devuelto' WHERE id_prestamo=?",
        [id],
        (error)=>{

            if(error){
                console.log("Error actualizando estado:",error);
                return res.status(500).json({ mensaje:"Error devolución" });
            }

            // Aumentar inventario del libro (+1)
            conexion.query(
            "UPDATE libros SET cantidad=cantidad+1 WHERE id_libro=?",
            [id_libro],
            (error)=>{

                if(error){
                    console.log("Error actualizando inventario:",error);
                    return res.status(500).json({ mensaje:"Error inventario" });
                }

                res.json({ mensaje:"Devolución registrada correctamente" });

            });

        });

    });

});


// PAGINA PRINCIPAL
app.get("/",(req,res)=>{
    res.send("Servidor Biblioteca funcionando");
});


// INICIAR SERVIDOR
app.listen(PORT,()=>{
    console.log("🚀 Servidor corriendo en puerto "+PORT);
});