// Función principal que se ejecuta al intentar guardar un préstamo
function guardarPrestamo(){

    // Obtenemos lo que sea que el usuario haya escrito en el input (mayúsculas, minúsculas, etc.)
    const campoUsuario = document.getElementById("usuario");
    const usuario = campoUsuario ? campoUsuario.value.trim() : "";

    const libro = document.getElementById("libro").value.trim();
    const entrega = document.getElementById("entrega").value.trim();
    const tramite = document.getElementById("tramite").value.trim();
    const prestatario = document.getElementById("prestatario").value.trim();

    // Validamos campos obligatorios
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

    // Datos que serán enviados al servidor
    const datos = {
        usuario: usuario,
        libro: libro,
        fecha_entrega: entrega,
        fecha_tramite: tramite,
        nombre_prestatario: prestatario
    };

    console.log("Datos enviados:", datos);

    // Enviar información al servidor Node.js
    fetch("http://localhost:3000/prestamos",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(res => res.json())
    .then(data => {
        console.log("Respuesta servidor:", data);

        if(data.codigo){
            document.getElementById("clavePrestamo").textContent =
            "PR-2026-" + data.codigo;
            document.getElementById("modal").style.display = "flex";
        }
        else{
            alert(data.mensaje);
        }
    })
    .catch(error => {
        console.log("Error:", error);
        alert("No se pudo conectar con el servidor");
    });
}

// Función para cerrar ventana de confirmación
function cerrarModal(){
    document.getElementById("modal").style.display = "none";}
