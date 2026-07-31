// Ejecuta el código cuando el HTML ya terminó de cargar
document.addEventListener("DOMContentLoaded",()=>{


// Busca el botón de agregar libros por su ID
let botonAgregar=document.getElementById("btnAdd");


// Busca el botón de devoluciones
let botonDevolucion=document.getElementById("devoluciones");


// Recupera la información del usuario guardada en localStorage
let usuario=JSON.parse(localStorage.getItem("usuario"));


// Oculta botones por seguridad al iniciar
if(botonAgregar){

botonAgregar.style.display="none";

}


if(botonDevolucion){

botonDevolucion.style.display="none";

}


// Verifica si existe usuario y tiene permisos administrativos
if(
usuario &&
(usuario.rol==="Administrador" || usuario.rol==="Bibliotecario")
){


// Mostrar botón agregar libros
if(botonAgregar){

botonAgregar.style.display="inline-block";

}


// Mostrar botón registrar devolución
if(botonDevolucion){

botonDevolucion.style.display="inline-block";

}


}


});