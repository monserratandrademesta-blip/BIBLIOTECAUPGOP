// Recupera la información del usuario guardada en localStorage
let usuario = localStorage.getItem("usuario");


// Verifica si existe una sesión iniciada
if(usuario === null){

    // Muestra aviso si alguien intenta entrar sin iniciar sesión
    alert("Debes iniciar sesión para entrar");


    // Envía al usuario al formulario de inicio de sesión
    window.location.href = "iniciodesesion.html";


}else{


    // Convierte la información guardada en formato JSON a objeto JavaScript
    usuario = JSON.parse(usuario);


    // Muestra en consola los datos del usuario actual para comprobar la sesión
    console.log("Usuario activo:",usuario);


}