const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables

import * as app from './app.js';

app.renderProductsCatalogo();

function limpiarGrid(){
    grid.innerHTML = '';
}

const grid = document.querySelector('.catalogo');
// Filtro la lista de productos por envio gratis
const filtroEnvioGratis = document.getElementById('enDescuento');
filtroEnvioGratis.addEventListener('change', async () => {
    const productos = await app.getProducts();
    if(filtroEnvioGratis.checked) {
        console.log('Check?', filtroEnvioGratis.checked );
        limpiarGrid();
        app.renderizarProductosGenerico(productos.filter(producto => producto.fields.freeShipping === 'true'));
    }else{
        console.log('Check?', filtroEnvioGratis.checked );
        limpiarGrid();
        app.renderizarProductosGenerico(productos);
    }
});

// Funcion para filtrar un array por coleccion
const opcionColeccionEl = document.getElementById('opcionColeccion');
opcionColeccionEl.addEventListener('change', async () => {
    const productos = await app.getProducts();
    const coleccionSeleccionada = opcionColeccionEl.value;
    console.log('Colección seleccionada:', coleccionSeleccionada);
    if(opcionColeccionEl.value != 'Todas') {
        limpiarGrid();
    app.renderizarProductosGenerico(productos.filter(producto => producto.fields.collection === opcionColeccionEl.value));
    }
    else {
        limpiarGrid();
        app.renderizarProductosGenerico(productos);
    }
});

// Funcion para llenar <select id="opcionColeccion"> de acuerdo a los productos que tengo y traigo de gerProducts()
const llenarSelectColeccion = async () => {
    const productos = await app.getProducts();
    const colecciones = new Set(productos.map(producto => producto.fields.collection)); // Map crea un array con solo los fields de collection y set elimina los duplicados
    const opcionColeccionEl = document.getElementById('opcionColeccion');
    opcionColeccionEl.innerHTML = '<option value="Todas" selected>Todas</option>';
    colecciones.forEach(coleccion => {
        const option = document.createElement('option');
        option.value = coleccion;
        option.textContent = coleccion; 
        opcionColeccionEl.appendChild(option);
    });
}
// Inicializo colecciones al cargar la pagina
llenarSelectColeccion();

// Funcion para ordenar dependiendo de la opcion seleccionada
const opcionOrdenarEl = document.getElementById('opcionOrdenar');
opcionOrdenarEl.addEventListener('change', async () => {
    const productos = await app.getProducts();
    const ordenarSeleccionado = opcionOrdenarEl.value;
    console.log('Orden seleccionado:', ordenarSeleccionado);
    limpiarGrid();
    switch (ordenarSeleccionado) {
        case 'masNuevo':
            app.renderizarProductosGenerico(productos.sort((a, b) => new Date(b.fields.releaseDate) - new Date(a.fields.releaseDate)));
            break;
        case 'masAntiguo':
            app.renderizarProductosGenerico(productos.sort((a, b) => new Date(a.fields.releaseDate) - new Date(b.fields.releaseDate)));
            break;
        case 'mayorPrecio':
            app.renderizarProductosGenerico(productos.sort((a, b) => b.fields.price - a.fields.price));
            break;
        case 'menorPrecio':
            app.renderizarProductosGenerico(productos.sort((a, b) => a.fields.price - b.fields.price));
            break;
    }
});



