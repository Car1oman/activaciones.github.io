function showImage(url) {
    let canvas = document.querySelector("canvas"); // obtener el canvas existente (si existe)
    if (!canvas) { // si no existe un canvas, crear uno nuevo
      canvas = document.createElement("canvas"); // crear un elemento canvas
      document.body.appendChild(canvas); // agregar el canvas al cuerpo de la página
    } else { // si ya existe un canvas, limpiarlo
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    const ctx = canvas.getContext("2d"); // obtener el contexto del canvas
    const img = new Image(); // crear un objeto Image
    img.onload = function() { // cuando la imagen cargue
      canvas.width = img.width; // establecer el ancho del canvas al ancho de la imagen
      canvas.height = img.height; // establecer la altura del canvas a la altura de la imagen
      ctx.drawImage(img, 0, 0); // dibujar la imagen en el canvas
    }
    img.src = url; // establecer la fuente de la imagen como el enlace de exportación de vista previa
  } 

//Creamos la función para cerrar la página al hacer click en volver
var enlace = document.getElementById("enlace");
if(enlace){
  enlace.addEventListener("click", function(event) {
    event.preventDefault();
    window.close(); // Cierra la página actual
    window.location.href = "https://car1oman.github.io/activaciones.github.io/"; // Abre la página inicial
  });
}

  
