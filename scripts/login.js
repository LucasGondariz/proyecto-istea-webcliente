const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables


const botonIngresar = document.getElementById('botonIngresar');
botonIngresar.addEventListener('click', (event) => {
    console.log('Botón ingresar presionado');
    login();
});


function login(){
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (email === 'admin' && password === 'admin') {
        console.log('Login exitoso');
        event.preventDefault(); // Evita el comportamiento por default del navegador / boton formulario que seria recargar
        window.location.href = './crud.html';
    }
    else {
        console.log('Login fallido');
        alert('Usuario o contraseña incorrectos');
        return;
    }
}