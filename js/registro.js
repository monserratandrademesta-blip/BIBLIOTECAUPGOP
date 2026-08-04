// ==============================
// REGISTRO DE USUARIO
// ==============================

// Genera automáticamente el usuario conforme el alumno escribe
function generarUsuario() {

    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let matricula = document.getElementById("matricula").value.trim();

    if (nombre === "" || apellido === "" || matricula.length < 4) {
        document.getElementById("usuarioGenerado").value = "";
        return;
    }

    let inicialNombre = nombre.charAt(0);
    let inicialApellido = apellido.charAt(0);

    let ultimos4 = matricula.slice(-4);

    let usuario = (inicialNombre + inicialApellido + ultimos4)
        .toLowerCase()
        .replaceAll(" ", "");

    document.getElementById("usuarioGenerado").value = usuario;
}



// ==============================
// VALIDACIONES MIENTRAS ESCRIBE
// ==============================

// Nombre
document.getElementById("nombre").addEventListener("input", function () {

    this.value = this.value
        .replace(/[^a-zA-Z\s]/g, "")
        .replace(/\s{2,}/g, " ")
        .slice(0,25);

    generarUsuario();

});



// Apellido
document.getElementById("apellido").addEventListener("input", function () {

    this.value = this.value
        .replace(/[^a-zA-Z\s]/g, "")
        .replace(/\s{2,}/g, " ")
        .slice(0,25);

    generarUsuario();

});



// Matrícula
document.getElementById("matricula").addEventListener("input", function(){

    this.value = this.value.replace(/\D/g,"");

    generarUsuario();

});



// Teléfono
document.getElementById("telefono").addEventListener("input", function(){

    this.value = this.value.replace(/\D/g,"").slice(0,10);

});



// Correo
document.getElementById("correo").addEventListener("input", function(){

    let correo = this.value.toLowerCase();

    // Solo permite letras, números, punto, guion, guion bajo y @
    correo = correo.replace(/[^a-z0-9@._-]/g,"");

    // No permite comenzar con . _ o -
    correo = correo.replace(/^[._-]+/,"");

    // No permite dos puntos seguidos
    correo = correo.replace(/\.{2,}/g,".");

    // No permite dos guiones bajos seguidos
    correo = correo.replace(/_{2,}/g,"_");

    // No permite dos guiones seguidos
    correo = correo.replace(/-{2,}/g,"-");

    // Solo permite un @
    let partes = correo.split("@");

    if(partes.length>2){

        correo = partes[0] + "@" + partes.slice(1).join("");

    }

    this.value = correo;

});



// ==============================
// ENVÍO DEL FORMULARIO
// ==============================

document.getElementById("formRegistro").addEventListener("submit",function(event){

    event.preventDefault();

    let nombre=document.getElementById("nombre").value.trim();
    let apellido=document.getElementById("apellido").value.trim();
    let matricula=document.getElementById("matricula").value.trim();
    let correo=document.getElementById("correo").value.trim();
    let telefono=document.getElementById("telefono").value.trim();
    let carrera=document.getElementById("carrera").value.trim();
    let password=document.getElementById("password").value.trim();
    let confirmar=document.getElementById("confirmar").value.trim();

    let usuario=document.getElementById("usuarioGenerado").value.trim();
    // ==============================
    // VALIDACIÓN DE CAMPOS VACÍOS
    // ==============================

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
            icon:"warning",
            title:"Campos incompletos",
            text:"Por favor, completa todos los campos.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    // ==============================
    // VALIDACIÓN DEL NOMBRE
    // ==============================

    if(nombre.length < 2 || nombre.length > 25){

        Swal.fire({
            icon:"warning",
            title:"Nombre inválido",
            text:"El nombre debe contener entre 2 y 25 letras.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    // ==============================
    // VALIDACIÓN DEL APELLIDO
    // ==============================

    if(apellido.length < 2 || apellido.length > 25){

        Swal.fire({
            icon:"warning",
            title:"Apellido inválido",
            text:"El apellido debe contener entre 2 y 25 letras.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    // ==============================
    // VALIDACIÓN DE MATRÍCULA
    // ==============================

    if(matricula.length < 4){

        Swal.fire({
            icon:"warning",
            title:"Matrícula inválida",
            text:"La matrícula debe contener al menos 4 números.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    // ==============================
    // VALIDACIÓN DEL TELÉFONO
    // ==============================

    if(telefono.length !== 10){

        Swal.fire({
            icon:"warning",
            title:"Teléfono inválido",
            text:"El teléfono debe contener exactamente 10 números.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    // ==============================
    // VALIDACIÓN DEL CORREO
    // ==============================

    const regexCorreo =
    /^(?![._-])[a-z0-9]+([._-]?[a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)+$/;

    if(!regexCorreo.test(correo)){

        Swal.fire({
            icon:"warning",
            title:"Correo inválido",
            text:"Ingrese un correo electrónico válido.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    // ==============================
    // VALIDACIÓN DE CONTRASEÑA
    // ==============================

    if(password.length < 8){

        Swal.fire({
            icon:"warning",
            title:"Contraseña insegura",
            text:"La contraseña debe contener al menos 8 caracteres.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    if(password !== confirmar){

        Swal.fire({
            icon:"error",
            title:"Contraseñas diferentes",
            text:"Las contraseñas no coinciden.",
            confirmButtonColor:"#022875"
        });

        return;
    }


    // ==============================
    // ENVÍO AL SERVIDOR
    // ==============================

    fetch("http://localhost:3000/registro",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            nombre:nombre,
            apellido:apellido,
            usuario:usuario,
            contraseña:password,
            correo:correo,
            matricula:matricula,
            telefono:telefono,
            carrera:carrera,
            rol:"Alumno"

        })

    })

    .then(respuesta=>respuesta.json())
    .then(datos=>{
        if(datos.mensaje === "Usuario creado correctamente"){

            Swal.fire({

                icon:"success",

                title:"¡Registro exitoso!",

                html:`

                    <p>Tu cuenta fue creada correctamente.</p>

                    <p>
                        <strong>Tu usuario para iniciar sesión es:</strong>
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

                    <button
                        id="copiarUsuario"
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

                confirmButtonText:"Ir a iniciar sesión",

                confirmButtonColor:"#022875",

                allowOutsideClick:false,

                didOpen:()=>{

                    document
                    .getElementById("copiarUsuario")
                    .addEventListener("click",function(){

                        navigator.clipboard.writeText(usuario);

                        Swal.showValidationMessage(
                            "Usuario copiado correctamente"
                        );

                    });

                }

            }).then(()=>{

                window.location.href="iniciodesesion.html";

            });

        }else{

            Swal.fire({

                icon:"error",

                title:"Error",

                text:datos.mensaje,

                confirmButtonColor:"#022875"

            });

        }

    })

    .catch(error=>{

        console.log("Error de conexión:",error);

        Swal.fire({

            icon:"error",

            title:"Error de conexión",

            text:"No se pudo conectar con el servidor. Inténtalo más tarde.",

            confirmButtonColor:"#022875"

        });

    });

});