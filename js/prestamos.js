// =========================================================
// 1. CARGA DINÁMICA DE LIBROS AL CAMBIAR CATEGORÍA
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const selectCategoria = document.getElementById("categoria");
    const selectLibro = document.getElementById("libro");

    if (selectCategoria) {
        selectCategoria.addEventListener("change", function () {
            const categoriaSeleccionada = selectCategoria.value.trim();

            selectLibro.innerHTML = '<option value="">-- Selecciona un libro --</option>';

            if (categoriaSeleccionada === "") return;

            fetch(`http://localhost:3000/libros/${encodeURIComponent(categoriaSeleccionada)}`)
                .then(respuesta => {
                    if (!respuesta.ok) throw new Error("Error en la respuesta del servidor");
                    return respuesta.json();
                })
                .then(libros => {
                    if (libros.length === 0) {
                        const opcionVacia = document.createElement("option");
                        opcionVacia.textContent = "No hay libros disponibles en esta categoría";
                        selectLibro.appendChild(opcionVacia);
                        return;
                    }

                    libros.forEach(libro => {
                        const option = document.createElement("option");
                        option.value = libro.id || libro.id_libro; 
                        option.textContent = libro.titulo;
                        selectLibro.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Error al cargar los libros:", error);
                    alert("Hubo un problema al consultar los libros de esta categoría.");
                });
        });
    }
});

// =========================================================
// 2. FUNCIÓN PARA GUARDAR EL PRÉSTAMO
// =========================================================
function guardarPrestamo(){

    const usuario = document.getElementById("usuario").value;
    const libro = document.getElementById("libro").value;
    const entrega = document.getElementById("entrega").value;
    const tramite = document.getElementById("tramite").value;
    const prestatario = document.getElementById("prestatario").value;
    const aceptarTerminos = document.getElementById("aceptarTerminos").checked;

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

    if(!aceptarTerminos){
        alert("Debes aceptar los términos y condiciones para registrar el préstamo.");
        return;
    }

    const datos = {
        usuario: usuario,
        libro: libro,
        fecha_entrega: entrega,
        fecha_tramite: tramite,
        nombre_prestatario: prestatario
    };

    console.log("Datos enviados:", datos);

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

        if(data.codigo){
            const folioCompleto = "PR-2026-" + data.codigo;

            // Alerta moderna con SweetAlert2
            Swal.fire({
                icon: 'success',
                title: '¡Préstamo registrado correctamente!',
                html: `Tu folio es: <b>${folioCompleto}</b>`,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#1d3557'
            }).then(() => {
                // Limpia el formulario después de aceptar
                document.getElementById("formPrestamo").reset();
                document.getElementById("libro").innerHTML = '<option value="">Primero selecciona una categoría</option>';
            });

        }else{
            alert(data.mensaje);
        }
    })
    .catch(error=>{
        console.log("Error:", error);
        alert("No se pudo conectar con el servidor");
    });
}