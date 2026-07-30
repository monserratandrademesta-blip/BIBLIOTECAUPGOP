// Espera a que la estructura del documento HTML se cargue por completo antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {

    // Lee el valor asignado al atributo data-categoria en la etiqueta <body> de la página
    let categoria = document.body.dataset.categoria;

    // Selecciona la etiqueta div por su ID donde se inyectarán los libros dinámicamente
    let lista = document.getElementById("listaLibros");

    // Realiza una petición HTTP GET a la API/backend enviando la categoría seleccionada
    fetch("http://localhost:3000/libros/" + categoria)

    // Convierte la respuesta recibida del servidor a formato JSON legible por JavaScript
    .then(res => res.json())

    // Procesa el arreglo de libros devuelto por la base de datos MySQL
    .then(libros => {

        // Limpia el contenido previo del contenedor para evitar duplicados
        lista.innerHTML = "";

        // Condicional: verifica si la categoría no contiene registros en la base de datos
        if(libros.length === 0){

            // Muestra un mensaje informativo si el arreglo devuelto está vacío
            lista.innerHTML = `
                <p class="sin-libros">
                    No hay libros disponibles en esta categoría
                </p>
            `;

            return; // Corta la ejecución para no recorrer el arreglo
        }

        // Iterador: recorre cada libro devuelto y genera su tarjeta HTML
        libros.forEach(libro => {

            // Acumula e inyecta la tarjeta HTML del libro con sus datos correspondientes
            lista.innerHTML += `

                <div class="libro">

                    <!-- Muestra el título del libro recuperado de la BD -->
                    <div class="titulo-libro">
                        ${libro.titulo}
                    </div>

                    <!-- Muestra el autor del libro -->
                    <p>
                        <b>Autor:</b> ${libro.autor}
                    </p>

                    <!-- Muestra el stock o cantidad disponible de ejemplares -->
                    <p>
                        <b>Cantidad:</b> ${libro.cantidad}
                    </p>

                    <!-- Botón que redirige al módulo de préstamos pasando el ID del libro en la URL -->
                    <button
                        class="prestamo"
                        onclick="window.location.href='prestamos.html?id_libro=${libro.id_libro}'">

                        Solicitar préstamo

                    </button>

                </div>

            `;

        });

    })

    // Captura cualquier error de conexión con el servidor o la base de datos
    .catch(error => {

        // Imprime el error en la consola del navegador para depuración
        console.log("Error:", error);

        // Muestra un mensaje de error visual para el usuario dentro del contenedor
        lista.innerHTML = `
            <p class="sin-libros">
                Error al cargar los libros
            </p>
        `;

    });

});