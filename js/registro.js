// ==============================
// REGISTRO DE USUARIO
// ==============================

// Genera automáticamente el usuario conforme el alumno escribe
function generarUsuario() {

    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let matricula = document.getElementById("matricula").value.trim();

    // Si aún no hay información suficiente, limpia el campo
    if (nombre === "" || apellido === "" || matricula.length < 4) {
        document.getElementById("usuarioGenerado").value = "";
        return;
    }

    // Toma los últimos 4 dígitos de la matrícula
    let ultimos4 = matricula.slice(-4);

    // Genera el usuario
    let usuario = (nombre + apellido + ultimos4)
        .toLowerCase()
        .replaceAll(" ", "");

    // Lo muestra en el formulario
    document.getElementById("usuarioGenerado").value = usuario;
}

// Detecta cambios en los campos para actualizar el usuario automáticamente
document.getElementById("nombre").addEventListener("input", generarUsuario);
document.getElementById("apellido").addEventListener("input", generarUsuario);
document.getElementById("matricula").addEventListener("input", generarUsuario);

// ==============================
// ENVÍO DEL FORMULARIO
// ==============================

document.getElementById("formRegistro").addEventListener("submit", function(event){

    // Evita que la página se recargue
    event.preventDefault();

    // Obtiene los datos del formulario
    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let matricula = document.getElementById("matricula").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let carrera = document.getElementById("carrera").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmar = document.getElementById("confirmar").value.trim();

    // Obtiene el usuario generado
    let usuario = document.getElementById("usuarioGenerado").value.trim();

    // Validación de campos vacíos
    if(
        nombre === "" ||
        apellido === "" ||
        matricula === "" ||
        correo === "" ||
        telefono === "" ||
        carrera === "" ||
        password === "" ||
        confirmar === ""
    ){
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Validación de longitud mínima de matrícula
    if(matricula.length < 4){
        alert("La matrícula debe tener al menos 4 caracteres.");
        return;
    }

    // Validación de contraseñas
    if(password !== confirmar){
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Envía los datos al servidor
    fetch("http://localhost:3000/registro", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            nombre: nombre,
            apellido: apellido,
            usuario: usuario,
            contraseña: password,
            correo: correo,
            matricula: matricula,
            telefono: telefono,
            carrera: carrera,
            rol: "Alumno"

        })

    })

    .then(respuesta => respuesta.json())

    .then(datos => {

        alert(datos.mensaje);

        if(datos.mensaje === "Usuario creado correctamente"){

            alert("Tu usuario para iniciar sesión es:\n\n" + usuario);

            window.location.href = "iniciodesesion.html";

        }

    })

    .catch(error => {

        console.log("Error de conexión:", error);

        alert("No se pudo conectar con el servidor. Inténtalo más tarde.");
    });
});