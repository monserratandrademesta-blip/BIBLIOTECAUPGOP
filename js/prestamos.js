// =========================================================
// 0. CARGAR AUTOMÁTICAMENTE LOS DATOS DEL USUARIO
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    // Obtener todos los datos guardados de la sesión
    const datosGuardados = localStorage.getItem("usuario");

    const campoUsuario = document.getElementById("usuario");
    const campoPrestatario = document.getElementById("prestatario");


    // Si no hay datos de sesión
    if (!datosGuardados) {

        alert("No hay una sesión iniciada. Inicia sesión primero.");

        window.location.href = "login.html";

        return;
    }


    try {

        // Convertir el JSON guardado en un objeto
        const datosUsuario = JSON.parse(datosGuardados);


        // =====================================================
        // MOSTRAR SOLAMENTE EL USUARIO
        // =====================================================

        if (campoUsuario) {

            campoUsuario.value = datosUsuario.usuario || "";

        }


        // =====================================================
        // MOSTRAR NOMBRE Y APELLIDO
        // =====================================================

        if (campoPrestatario) {

            const nombre = datosUsuario.nombre || "";
            const apellido = datosUsuario.apellido || "";

            campoPrestatario.value =
                (nombre + " " + apellido).trim();

        }

    } catch (error) {

        console.error(
            "Error al leer los datos del usuario:",
            error
        );

        alert(
            "No se pudieron cargar correctamente los datos del usuario."
        );

    }

});


// =========================================================
// 1. CARGA DINÁMICA DE LIBROS AL CAMBIAR CATEGORÍA
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const selectCategoria =
        document.getElementById("categoria");

    const selectLibro =
        document.getElementById("libro");


    if (selectCategoria && selectLibro) {

        selectCategoria.addEventListener("change", function () {

            const categoriaSeleccionada =
                selectCategoria.value.trim();


            // Limpiar lista de libros

            selectLibro.innerHTML =
                '<option value="">-- Selecciona un libro --</option>';


            if (categoriaSeleccionada === "") {

                return;

            }


            // =================================================
            // CONSULTAR LIBROS AL SERVIDOR
            // =================================================

            fetch(
                `http://localhost:3000/libros/${encodeURIComponent(categoriaSeleccionada)}`
            )

            .then(respuesta => {

                if (!respuesta.ok) {

                    throw new Error(
                        "Error en la respuesta del servidor"
                    );

                }

                return respuesta.json();

            })


            .then(libros => {


                // =================================================
                // SI NO HAY LIBROS
                // =================================================

                if (libros.length === 0) {

                    const opcionVacia =
                        document.createElement("option");


                    opcionVacia.value = "";


                    opcionVacia.textContent =
                        "No hay libros disponibles en esta categoría";


                    selectLibro.appendChild(
                        opcionVacia
                    );


                    return;

                }


                // =================================================
                // MOSTRAR LIBROS
                // =================================================

                libros.forEach(libro => {

                    const option =
                        document.createElement("option");


                    // ID del libro

                    option.value =
                        libro.id_libro || libro.id;


                    // Título del libro

                    option.textContent =
                        libro.titulo;


                    selectLibro.appendChild(
                        option
                    );

                });

            })


            .catch(error => {

                console.error(
                    "Error al cargar los libros:",
                    error
                );


                alert(
                    "Hubo un problema al consultar los libros de esta categoría."
                );

            });

        });

    }

});


// =========================================================
// 2. FUNCIÓN PARA GUARDAR EL PRÉSTAMO
// =========================================================

function guardarPrestamo() {


    // Obtener datos del formulario

    const usuario =
        document.getElementById("usuario").value.trim();


    const libro =
        document.getElementById("libro").value;


    const entrega =
        document.getElementById("entrega").value;


    const tramite =
        document.getElementById("tramite").value;


    const prestatario =
        document.getElementById("prestatario").value.trim();


    const aceptarTerminos =
        document.getElementById("aceptarTerminos").checked;



    // =====================================================
    // VALIDAR CAMPOS
    // =====================================================

    if (
        usuario === "" ||
        libro === "" ||
        entrega === "" ||
        tramite === "" ||
        prestatario === ""
    ) {

        alert(
            "Debes llenar todos los campos."
        );

        return;

    }



    // =====================================================
    // VALIDAR TÉRMINOS
    // =====================================================

    if (!aceptarTerminos) {

        alert(
            "Debes aceptar los términos y condiciones para registrar el préstamo."
        );

        return;

    }



    // =====================================================
    // DATOS QUE SE ENVIARÁN AL SERVIDOR
    // =====================================================

    const datos = {

        usuario: usuario,

        libro: libro,

        fecha_entrega: entrega,

        fecha_tramite: tramite,

        nombre_prestatario: prestatario

    };


    console.log(
        "Datos enviados:",
        datos
    );



    // =====================================================
    // ENVIAR PRÉSTAMO AL SERVIDOR
    // =====================================================

    fetch(
        "http://localhost:3000/prestamos",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(datos)

        }
    )


    .then(res => {

        if (!res.ok) {

            throw new Error(
                "Error en la respuesta del servidor"
            );

        }

        return res.json();

    })


    .then(data => {

        console.log(
            "Respuesta servidor:",
            data
        );


        // =================================================
        // SI SE REGISTRÓ CORRECTAMENTE
        // =================================================

        if (data.codigo) {


            const folioCompleto =
                "PR-2026-" + data.codigo;


            Swal.fire({

                icon: "success",

                title:
                    "¡Préstamo registrado correctamente!",

                html:
                    "Tu folio es: <b>" +
                    folioCompleto +
                    "</b>",

                confirmButtonText:
                    "Aceptar",

                confirmButtonColor:
                    "#1d3557"

            })


            .then(() => {


                // =================================================
                // LIMPIAR FORMULARIO
                // =================================================

                document
                    .getElementById("formPrestamo")
                    .reset();


                // =================================================
                // RECUPERAR DATOS DEL USUARIO
                // =================================================

                const datosGuardados =
                    localStorage.getItem("usuario");


                if (datosGuardados) {

                    try {

                        const datosUsuario =
                            JSON.parse(datosGuardados);


                        // Mostrar solamente usuario

                        document
                            .getElementById("usuario")
                            .value =
                                datosUsuario.usuario || "";


                        // Mostrar nombre + apellido

                        const nombre =
                            datosUsuario.nombre || "";


                        const apellido =
                            datosUsuario.apellido || "";


                        document
                            .getElementById("prestatario")
                            .value =
                                (nombre + " " + apellido).trim();


                    } catch (error) {

                        console.error(
                            "Error al recuperar los datos del usuario:",
                            error
                        );

                    }

                }



                // =================================================
                // REINICIAR LIBROS
                // =================================================

                document
                    .getElementById("libro")
                    .innerHTML =
                        '<option value="">Primero selecciona una categoría</option>';


                // =================================================
                // REINICIAR CATEGORÍA
                // =================================================

                const categoria =
                    document.getElementById("categoria");


                if (categoria) {

                    categoria.value = "";

                }

            });

        } else {

            alert(
                data.mensaje ||
                "No se pudo registrar el préstamo."
            );

        }

    })


    .catch(error => {

        console.error(
            "Error:",
            error
        );

        alert(
            "No se pudo conectar con el servidor."
        );

    });

}



// =========================================================
// 3. CERRAR VENTANA DE CONFIRMACIÓN
// =========================================================

function cerrarModal() {

    const modal =
        document.getElementById("modal");


    if (modal) {

        modal.style.display = "none";

    }

}