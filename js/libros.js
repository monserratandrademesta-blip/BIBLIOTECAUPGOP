document.addEventListener("DOMContentLoaded", () => {

    let categoria = document.body.dataset.categoria;

    let lista = document.getElementById("listaLibros");


    fetch("http://localhost:3000/libros/" + categoria)

    .then(res => res.json())

    .then(libros => {


        lista.innerHTML = "";


        if(libros.length === 0){

            lista.innerHTML = `

                <p class="sin-libros">

                    No hay libros disponibles en esta categoría

                </p>

            `;

            return;

        }



        libros.forEach(libro => {


            lista.innerHTML += `

            <div class="libro">


                <div class="titulo-libro">

                    ${libro.titulo}

                </div>



                <p>

                    <b>Autor:</b> ${libro.autor}

                </p>



                <p>

                    <b>Disponibilidad:</b>

                    ${
                        libro.cantidad > 0
                        ? "Disponible: " + libro.cantidad
                        : "❌ Agotado"
                    }

                </p>



                ${
                    libro.cantidad > 0

                    ?

                    `

                    <button

                    class="prestamo"

                    onclick="window.location.href='prestamos.html?id_libro=${libro.id_libro}'">

                    Solicitar préstamo

                    </button>

                    `

                    :

                    `

                    <button

                    class="prestamo"

                    disabled>

                    Libro agotado

                    </button>

                    `

                }



            </div>

            `;


        });


    })


    .catch(error => {


        console.log("Error:", error);


        lista.innerHTML = `

            <p class="sin-libros">

                Error al cargar los libros

            </p>

        `;


    });


});