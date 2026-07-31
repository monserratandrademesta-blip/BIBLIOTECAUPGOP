let prestamosEncontrados=[];


// BUSCAR PRESTAMOS POR NOMBRE

function buscarPrestamosNombre(){


const nombre=document.getElementById("nombre").value.trim();



if(nombre===""){

alert("Escribe un nombre");

return;

}



fetch("http://localhost:3000/prestamos/nombre/"+nombre)


.then(res=>res.json())


.then(data=>{


console.log(data);



if(data.length===0){

alert("No tiene préstamos activos");

return;

}



prestamosEncontrados=data;



const select=document.getElementById("prestamos");

select.innerHTML="";



data.forEach(prestamo=>{


let opcion=document.createElement("option");


opcion.value=prestamo.id_prestamo;


opcion.textContent=
prestamo.titulo+
" - Entrega: "+
prestamo.fecha_entrega;


select.appendChild(opcion);


});



mostrarPrestamo();


})


.catch(error=>{


console.log(error);

alert("Error al conectar con el servidor");


});


}





// CAMBIAR PRESTAMO SELECCIONADO

document.getElementById("prestamos")
.addEventListener("change",mostrarPrestamo);





function mostrarPrestamo(){


const id=document.getElementById("prestamos").value;



const prestamo=prestamosEncontrados.find(

p=>p.id_prestamo==id

);



if(prestamo){


document.getElementById("datosPrestamo").innerHTML=`

<p><b>Nombre:</b> ${prestamo.nombre} ${prestamo.apellido}</p>

<p><b>Libro:</b> ${prestamo.titulo}</p>

<p><b>Fecha de entrega:</b> ${prestamo.fecha_entrega}</p>

`;



document.getElementById("estado").value=prestamo.estado;


}


}





// REGISTRAR DEVOLUCIÓN

function devolverLibro(){


const id=document.getElementById("prestamos").value;



if(id===""){


alert("Selecciona un préstamo");

return;


}



fetch("http://localhost:3000/prestamos/"+id,{

method:"PUT"

})


.then(res=>res.json())


.then(data=>{


alert(data.mensaje);


document.getElementById("estado").value="Devuelto";


})


.catch(error=>{


console.log(error);


alert("Error registrando devolución");


});


}





// CERRAR MODAL

function cerrarModal(){


document.getElementById("modal").style.display="none";


}