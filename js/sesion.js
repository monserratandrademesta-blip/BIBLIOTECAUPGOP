// Recupera la información guardada del usuario desde el almacenamiento local del navegador (localStorage)
let usuario = localStorage.getItem("usuario");


// Estructura condicional: verifica si no hay ninguna sesión registrada (retorna null)
if(usuario === null){

    // Muestra un mensaje de advertencia notificando que la página está protegida
    alert("Debes iniciar sesión para entrar");

    // Redirige automáticamente al usuario no autenticado a la pantalla de inicio de sesión
    window.location.href = "iniciodesesion.html";

}