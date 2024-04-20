import API_KEY from '../prueba.js';
async function init() {
  try {
    await gapi.client.init({
      apiKey: API_KEY,
    });

    const response = await gapi.client.request({
      'path': 'https://sheets.googleapis.com/v4/spreadsheets/1Vx0dv2h8HfiYmvcvyPf71_iOY-TuoYrshd24Xb-gfTQ?fields=sheets.properties',
    });

    const sheets = response.result.sheets;
    const ul = document.getElementById("hojas");
    async function ordenarFechas() {
      const fechas = await obtenerFechas();
      const fechasObjeto = fechas.map((fecha) => {
        const [dia, mes, anio] = fecha.split(".");
        const fechaObjeto = new Date(Date.UTC(2000 + Number(anio), Number(mes) - 1, Number(dia)));
        fechaObjeto.setUTCHours(0, 0, 0, 0); // Establecer hora en UTC
        return fechaObjeto;
      });

      function compareDates(a, b) {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      }

      const fechasOrdenadas = fechasObjeto.sort(compareDates);
      const fechasOrdenadasCadena = fechasOrdenadas.map(fecha => {
        fecha.setDate(fecha.getDate() + 1); // Restar un día
        const year = fecha.getFullYear().toString().slice(-2);
        const month = (fecha.getMonth() + 1).toString().padStart(2, "0");
        const day = fecha.getDate().toString().padStart(2, "0");
        fecha.setDate(fecha.getDate()); // Agregar un día
        return `${day}.${month}.${year}`;
      });

      const sheetNames = fechasOrdenadasCadena;
      const ul = document.querySelector("ul");

      for (let i = 0; i < sheetNames.length; i++) {
        const li = document.createElement("li");
        const enlace = document.createElement("a");
        const sheetName = sheetNames[i];
        enlace.href = "#";
        enlace.setAttribute("data-sheet-name", sheetName);
        enlace.textContent = sheetName;
        li.appendChild(enlace);
        ul.appendChild(li);

        // Agrega el evento click a cada enlace
        enlace.addEventListener("click", (event) => {
          event.preventDefault(); // Previene la acción por defecto del enlace
          const sheetName = event.target.getAttribute("data-sheet-name");
          cargarHoja(sheetName); // Llama a la función para cargar la hoja
        });
      }
    }


    function obtenerFechas() {
      const fechas = [];
      for (let i = 0; i < sheets.length; i++) {
        const date = sheets[i].properties.title;
        fechas.push(date);
      }
      return fechas;
    }

    ordenarFechas(); // Llamar a la función para ordenar las fechas

    function cargarHoja(sheetName) {
      // Genera la URL de la hoja de cálculo con el ID y el rango
      const url = `https://sheets.googleapis.com/v4/spreadsheets/1Vx0dv2h8HfiYmvcvyPf71_iOY-TuoYrshd24Xb-gfTQ/values/${sheetName}?key=${API_KEY}`;

      // Usa fetch para obtener los datos de la hoja de cálculo
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // Genera el HTML para mostrar los datos en la nueva página
          const html = `
            <html>
            <head>
              <title>${sheetName}</title>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <link rel="stylesheet" type="text/css" href="./style-sheet.css">
              <link rel="icon" href="https://is4-ssl.mzstatic.com/image/thumb/Purple118/v4/da/57/1e/da571e7e-ebe3-0c8f-0a94-3b11e3d1ae1a/AppIcon-0-1x_U007emarketing-0-0-85-220-0-5.png/400x400bb.jpg">
              
            </head>
            <body>
              <header>
                <div class="header-container">
                  <h1>Activaciones del día: ${sheetName}</h1>
                  <img id="sis-logo" alt="tienda-logo" src="https://images.falabella.com/v3/assets/bltb5a8befb95ca5f20/bltb812a50a0ffcae37/63a3e4f8cbf72835bf8b57f1/logo-falabella.svg">
                </div>
                <nav>
                  <a href="https://car1oman.github.io/activaciones.github.io/" id="enlace">Volver</a>
                </nav>
                <script src="./sheet.js"></script>
              </header>
              <main>
                <canvas id="mi-boleta"></canvas>
                <table>
                ${data.values.map((row, rowIndex) => {
            return `<tr>${row.map((cell, index) => {
              // verificar si es la segunda o tercera columna y no es la primera fila ni el encabezado
              if ((index === 1 || index === 2) && rowIndex !== 0 && row[0] !== "Photo") {
                // si el valor de la celda no está vacío, mostrarlo
                if (cell !== "") {
                  // si es la segunda columna, mostrar el enlace de vista previa de exportación
                  if (index === 1) {
                    const previewLink = cell; // guardar el enlace de vista previa original
                    const match = previewLink.match(/\/d\/(.+?)\//);
                    const id = match ? match[1] : '';
                    // generar el enlace de exportación de vista previa
                    const link = `https://lh3.google.com/u/0/d/${id}=k`;
                    console.log(link);
                    // generar una celda con un enlace a la vista previa de exportación
                    return `<td><a href="#" onclick="showImage('${link}'); return false;">Ver boleta</a></td>`;
                  } else {
                    // si es la tercera columna, mostrar el valor de la celda
                    return `<td>${cell}</td>`;
                  }
                } else {
                  // si el valor de la celda está vacío, no mostrar nada
                  return "";
                }
              } else {
                // si no es la segunda o tercera columna, o es la primera fila o el encabezado, mostrar el valor original de la celda
                return `<td>${cell}</td>`;
              }
            }).join("")}</tr>`
          }).join("")}
              </table>
              
              </main>
            </body>
          </html>
          `;

          // Abre una nueva página con el HTML generado
          const nuevaPagina = window.open("", "_blank", "width=800,height=600");
          nuevaPagina.document.write(html);
        })
        .catch((error) => console.error(error));
    }
  } catch (reason) {
    console.log('Error: ' + reason.result.error.message);
  }
}

gapi.load('client', init);
