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

        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Por favor, completa todos los campos.",
            confirmButtonColor: "#022875"
        });

        return;
    }


    // Validación de longitud mínima de matrícula
    if(matricula.length < 4){

        Swal.fire({
            icon: "warning",
            title: "Matrícula inválida",
            text: "La matrícula debe tener al menos 4 caracteres.",
            confirmButtonColor: "#022875"
        });

        return;
    }


    // Validación de contraseñas
    if(password !== confirmar){

        Swal.fire({
            icon: "error",
            title: "Contraseñas diferentes",
            text: "Las contraseñas no coinciden.",
            confirmButtonColor: "#022875"
        });

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


        if(datos.mensaje === "Usuario creado correctamente"){


            Swal.fire({

                icon: "success",

                title: "¡Registro exitoso!",

                html: `

                    <p>Tu cuenta fue creada correctamente.</p>

                    <p>
                    <strong>
                    Tu usuario para iniciar sesión es:
                    </strong>
                    </p>


                    <div style="
                        background:#f4f7ff;
                        border:2px solid #022875;
                        border-radius:10px;
                        padding:15px;
                        font-size:24px;
                        font-weight:bold;
                        color:#022875;
                        margin:15px 0;
                    ">
                        ${usuario}
                    </div>


                    <button id="copiarUsuario"
                    style="
                        background:#022875;
                        color:white;
                        border:none;
                        padding:10px 20px;
                        border-radius:8px;
                        cursor:pointer;
                    ">
                         Copiar usuario
                    </button>


                    <p style="margin-top:15px;">
                    Guárdalo para iniciar sesión.
                    </p>

                `,


                confirmButtonText: "Ir a iniciar sesión",

                confirmButtonColor: "#022875",

                allowOutsideClick: false,


                didOpen: () => {


                    document
                    .getElementById("copiarUsuario")
                    .addEventListener("click", function(){


                        navigator.clipboard.writeText(usuario);


                        Swal.showValidationMessage(
                            " Usuario copiado correctamente"
                        );


                    });


                }


            }).then(() => {


                window.location.href = "iniciodesesion.html";


            });



        }else{


            Swal.fire({

                icon: "error",

                title: "Error",

                text: datos.mensaje,

                confirmButtonColor: "#022875"

            });


        }


    })


    .catch(error => {


        console.log("Error de conexión:", error);


        Swal.fire({

            icon: "error",

            title: "Error de conexión",

            text: "No se pudo conectar con el servidor. Inténtalo más tarde.",

            confirmButtonColor: "#022875"

        });


    });


});