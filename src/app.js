//archivo app.js
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();

const config = require('./json/credenciales.json');
const doc = new GoogleSpreadsheet('1Vx0dv2h8HfiYmvcvyPf71_iOY-TuoYrshd24Xb-gfTQ');

app.set('views', './src/views');
app.set('view engine', 'pug');

app.get('/', async (req, res) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: config.client_email,
      private_key: config.private_key,
    });

    await doc.loadInfo(); // carga información de la hoja de cálculo
    const sheetNames = doc.sheetsByIndex.map(sheet => sheet.title); // Obtiene los nombres de las hojas

    res.render('index', { sheetNames }); // renderiza la vista Pug con los nombres de las hojas
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar los nombres de las hojas de cálculo.');
  }
});

app.get('/:sheetName', async (req, res) => {
  const { sheetName } = req.params;
  try {
    await doc.useServiceAccountAuth({
      client_email: config.client_email,
      private_key: config.private_key,
    });

    await doc.loadInfo(); // carga información de la hoja de cálculo
    const sheet = doc.sheetsByTitle[sheetName]; // obtiene la hoja de la hoja de cálculo con el nombre proporcionado
    const rows = await sheet.getRows(); // obtiene todas las filas de la hoja de cálculo

    function getFileIdFromUrl(url) {
  const match = url.match(/\/d\/(.+?)\//);
  return match ? match[1] : null;
}

    rows.forEach(row => {
        const fileId = getFileIdFromUrl(row.ENLACES);
        row.ENLACES = `https://drive.google.com/uc?export=view&id=${fileId}`;
      });
      

    res.render('sheet', { rows, sheetName }); // renderiza la vista Pug con los datos de la hoja de cálculo
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al cargar los datos de la hoja de cálculo "${sheetName}".`);
  }
});


module.exports = app;
