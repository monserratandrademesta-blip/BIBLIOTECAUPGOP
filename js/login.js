// Función principal que procesa el inicio de sesión del usuario
function login(){

    // Captura el valor ingresado en el campo de texto del usuario
    let usuario = document.getElementById("usuario").value.trim();

    // Captura la clave ingresada en el campo de contraseña
    let contraseña = document.getElementById("password").value.trim();

    // NUEVO: Validación de campos vacíos (Evita peticiones innecesarias)
    if(usuario === "" || contraseña === ""){
        alert("Por favor, completa todos los campos.");
        return; // Detiene la ejecución si falta algún dato
    }

    // Realiza una petición POST al endpoint '/login' de la API de Node.js
    fetch("http://localhost:3000/login",{

        // Especifica el método HTTP utilizado para enviar datos
        method:"POST",

        // Define las cabeceras de la petición indicando formato JSON
        headers:{
            "Content-Type":"application/json"
        },

        // Convierte el objeto de datos en una cadena JSON para enviarlo al servidor
        body:JSON.stringify({

            usuario:usuario,
            contraseña:contraseña

        })

    })


    // Recibe la respuesta de la API y la parsea a un objeto JSON de JavaScript
    .then(res=>res.json())


    // Evalúa la respuesta enviada por el servidor
    .then(data=>{


        // Condicional: verifica si la autenticación fue exitosa
        if(data.mensaje==="Login correcto"){


            // Guarda en el almacenamiento local (localStorage) los datos e información del rol del usuario
            localStorage.setItem(
                "usuario",
                JSON.stringify(data.usuario)
            );


            // Despliega una alerta de bienvenida con el nombre del usuario
            alert("Bienvenido "+data.usuario.nombre);


            // Redirige al usuario hacia la pantalla del catálogo principal
            window.location.href="catalogo.html";


        }
        else{


            // Notifica al usuario en caso de datos erróneos
            alert("Usuario o contraseña incorrectos");


        }


    })


    // Captura errores de red o caídas del servidor
    .catch(error=>{


        // Muestra el detalle técnico en la consola para depuración
        console.log(error);

        // Muestra una alerta amigable al usuario sobre la falla de conexión
        alert("Error al conectar con el servidor");


    });


}