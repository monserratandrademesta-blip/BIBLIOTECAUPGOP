// Escucha el evento de envío (submit) del formulario de registro de usuario
document.getElementById("formRegistro").addEventListener("submit", function(event){

    // Cancela la recarga automática de la página que realiza el navegador por defecto al enviar un formulario
    event.preventDefault();


    // Obtiene los valores ingresados en cada input del formulario mediante sus IDs
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let matricula = document.getElementById("matricula").value;
    let correo = document.getElementById("correo").value;
    let telefono = document.getElementById("telefono").value;
    let carrera = document.getElementById("carrera").value;
    let password = document.getElementById("password").value;
    let confirmar = document.getElementById("confirmar").value;



    // Estructura condicional para validar que ambas contraseñas escritas sean exactamente iguales
    if(password !== confirmar){

        // Notifica al usuario que cometió un error al escribir las claves
        alert("Las contraseñas no coinciden");
        return; // Detiene la ejecución para que no se envíe la petición al backend

    }



    // Genera automáticamente un nombre de usuario uniendo nombre y apellido, todo en minúsculas y sin espacios
    // Ejemplo: Monserrat Andrade -> monserratandrade

    let usuario = (nombre + apellido)
        .toLowerCase()
        .replaceAll(" ", "");



    // Realiza la petición HTTP POST enviando el paquete de datos al endpoint de registro
    fetch("http://localhost:3000/registro", {


        // Establece el método de envío POST
        method: "POST",


        // Indica al servidor backend que el cuerpo del mensaje va en formato JSON
        headers: {

            "Content-Type": "application/json"

        },


        // Convierte el objeto de datos recopilados en una cadena JSON
        body: JSON.stringify({

            nombre: nombre,

            apellido: apellido,

            usuario: usuario,

            contraseña: password,

            correo: correo,

            matricula: matricula,

            telefono: telefono,

            carrera: carrera,

            rol: "Alumno" // Asigna por defecto el rol de Alumno a todo nuevo usuario registrado

        })


    })



    // Parsea y convierte la respuesta del servidor a formato JSON legible por JS
    .then(respuesta => respuesta.json())



    // Recibe la respuesta formateada en la variable 'datos'
    .then(datos => {


        // Muestra en una ventana de alerta el mensaje que devuelve la API (ej. "Usuario creado correctamente")
        alert(datos.mensaje);



        // Si la inserción en MySQL fue exitosa, redirige automáticamente a la pantalla de Login
        if(datos.mensaje === "Usuario creado correctamente"){

            window.location.href = "iniciodesesion.html";

        }



    })



    // Captura fallas de red o errores cuando el servidor Node.js no está encendido
    .catch(error => {


        // Imprime el detalle en consola para revisión técnica
        console.log("Error:", error);

        // Muestra un mensaje amigable al usuario
        alert("Error al conectar con el servidor");


    });



});