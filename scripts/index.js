const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables

import * as app from './app.js';


app.inicializarTop3Products();



const botonIzquierda = document.getElementById('botonIzquierda');
const botonDerecha = document.getElementById('botonDerecha');
const contenedorPrincipal = document.querySelector('.contenedorPrincipal');

botonDerecha.addEventListener('click', () => {
    console.log('Botón derecho presionado');
    contenedorPrincipal.innerHTML = "";
    app.moverDerecha();
});

botonIzquierda.addEventListener('click', () => {
    console.log('Botón izquierdo presionado');
    contenedorPrincipal.innerHTML = "";
    app.moverIzquierda();
});
