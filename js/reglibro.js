// Escucha el evento de envío (submit) del formulario con ID 'formLibro'
document.getElementById("formLibro").addEventListener("submit",function(e){

    // Evita el comportamiento por defecto del navegador de recargar la página al enviar un formulario
    e.preventDefault();


    // Captura los valores ingresados en los inputs y la lista desplegable mediante sus IDs
    let titulo=document.getElementById("titulo").value;
    let autor=document.getElementById("autor").value;
    let categoria=document.getElementById("categoria").value;
    let cantidad=document.getElementById("cantidad").value;


    // Agrupa las variables recolectadas dentro de un objeto JavaScript de libro
    let libro={

        titulo:titulo,
        autor:autor,
        categoria:categoria,
        cantidad:cantidad

    };


    // Realiza una petición HTTP POST a la API para guardar el nuevo libro en MySQL
    fetch("http://localhost:3000/libros",{

        // Especifica el método HTTP para la inserción de datos
        method:"POST",

        // Indica que los datos enviados en el cuerpo del mensaje tienen formato JSON
        headers:{
            "Content-Type":"application/json"
        },

        // Convierte el objeto JavaScript a una cadena de texto JSON
        body:JSON.stringify(libro)

    })


    // Parsea la respuesta obtenida del servidor Node.js a formato JSON
    .then(res=>res.json())


    // Recibe la respuesta del backend tras procesar la consulta
    .then(data=>{

        // Muestra en pantalla el mensaje de confirmación devuelto por la API (ej. "Libro registrado exitosamente")
        alert(data.mensaje);

        // Limpia todos los campos del formulario para permitir el registro de otro libro
        document.getElementById("formLibro").reset();

    })


    // Captura fallas de red o errores de conexión con el servidor local
    .catch(error=>{

        // Imprime el detalle del error en la consola del navegador
        console.log("Error:",error);

        // Notifica al usuario la falla del proceso
        alert("Error al guardar libro");

    });


});