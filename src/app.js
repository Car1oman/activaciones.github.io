//archivo app.js
const express = require('express');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const app = express();

const config = require('./json/credenciales.json');
const doc = new GoogleSpreadsheet('1Vx0dv2h8HfiYmvcvyPf71_iOY-TuoYrshd24Xb-gfTQ');

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUJ6aPL1aqBKyYbocSBT8uXWe-xP3iaF0",
  authDomain: "prueba-374223.firebaseapp.com",
  projectId: "prueba-374223",
  storageBucket: "prueba-374223.appspot.com",
  messagingSenderId: "1061885319982",
  appId: "1:1061885319982:web:df021943c4e8c2afed38bf",
  measurementId: "G-WM86187S6Q"
};

// Initialize Firebase
const fireBaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(fireBaseApp);

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
    if(sheet){//Para evitar un error que no comprendo, validamos si la hoja existe en primer lugar
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
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error al cargar los datos de la hoja de cálculo "${sheetName}".`);
  }
});


module.exports = app;