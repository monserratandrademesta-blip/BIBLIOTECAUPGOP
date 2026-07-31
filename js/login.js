// Función principal del inicio de sesión
function login(){

// Obtener datos escritos por el usuario
const usuario=document.getElementById("usuario").value.trim();
const contraseña=document.getElementById("password").value.trim();

// Validar campos vacíos
if(usuario===""||contraseña===""){
alert("Por favor, completa todos los campos.");
return;
}

// Enviar datos al servidor
fetch("http://localhost:3000/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
usuario:usuario,
contraseña:contraseña
})
})

// Convertir respuesta a JSON
.then(res=>res.json())

// Procesar respuesta del servidor
.then(data=>{

// Verificar si el login fue correcto
if(data.mensaje==="Login correcto"){

// Guardar información del usuario y su rol
localStorage.setItem(
"usuario",
JSON.stringify(data.usuario)
);

// Mensaje de bienvenida
alert("Bienvenido "+data.usuario.nombre);

// Redireccionar según el rol
if(data.usuario.rol==="Bibliotecario"||data.usuario.rol==="Administrador"){

window.location.href="admin.html";

}else{

window.location.href="catalogo.html";

}

}else{

// Usuario o contraseña incorrectos
alert("Usuario o contraseña incorrectos");

}

})

// Capturar errores de conexión
.catch(error=>{

console.log("Error login:",error);

alert("Error al conectar con el servidor");

});

}