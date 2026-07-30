// Escucha el evento 'DOMContentLoaded' para ejecutar el código una vez que el HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

    // Selecciona el botón de agregar mediante su ID
    let boton = document.getElementById("btnAdd");

    // Si el botón no existe en la página actual (por ejemplo, en otra vista), corta la ejecución de la función
    if (!boton) {
        return;
    }

    // Por seguridad, oculta el botón por defecto al cargar la vista
    boton.style.display = "none";

    // Recupera la información del usuario guardada en el almacenamiento local (localStorage) y la convierte a objeto JS
    let usuario = JSON.parse(localStorage.getItem("usuario"));

    // Condicional: verifica si hay una sesión activa y si el rol registrado es "Administrador"
    if (usuario && usuario.rol === "Administrador") {
        // Muestra el botón únicamente a los usuarios con permisos de administrador
        boton.style.display = "inline-block";
    }

});