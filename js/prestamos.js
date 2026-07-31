// Función para guardar el préstamo
function guardarPrestamo(){

    // Obtener datos del formulario
    const usuario = document.getElementById("usuario").value;
    const libro = document.getElementById("libro").value;
    const entrega = document.getElementById("entrega").value;
    const tramite = document.getElementById("tramite").value;
    const prestatario = document.getElementById("prestatario").value;

    // Revisar si aceptó los términos
    const aceptarTerminos = document.getElementById("aceptarTerminos").checked;


    // Validar que todos los campos tengan información
    if(
        usuario === "" ||
        libro === "" ||
        entrega === "" ||
        tramite === "" ||
        prestatario === ""
    ){

        alert("Debes llenar todos los campos.");
        return;

    }


    // Validar aceptación del reglamento
    if(!aceptarTerminos){

        alert("Debes aceptar los términos y condiciones para registrar el préstamo.");
        return;

    }



    // Datos que se enviarán al servidor
    const datos = {

        usuario: usuario,

        libro: libro,

        fecha_entrega: entrega,

        fecha_tramite: tramite,

        nombre_prestatario: prestatario

    };



    console.log("Datos enviados:", datos);



    // Enviar datos a Node.js
    fetch("http://localhost:3000/prestamos",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(datos)

    })


    .then(res => res.json())


    .then(data => {


        console.log("Respuesta servidor:", data);



        // Si el préstamo fue creado correctamente
        if(data.codigo){


            document.getElementById("clavePrestamo").innerHTML =
            "PR-2026-" + data.codigo;


            document.getElementById("modal").style.display = "flex";


        }else{


            alert(data.mensaje);


        }


    })



    .catch(error=>{


        console.log("Error:", error);

        alert("No se pudo conectar con el servidor");


    });


}



// Cerrar ventana de confirmación
function cerrarModal(){

    document.getElementById("modal").style.display="none";

}