const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables

import * as app from './app.js';

// me baso en el pdf de la clase.
const products =[];
function addProduct(){
    const newProduct = {
        name: 'Nuevo Producto',
        collection: 'Nueva Colección',
        description: 'Descripción del nuevo producto',
        stock: 100,
        price: 29.99,
        releaseDate: '2023-10-01',
        img: 'https://example.com/nuevo-producto.jpg',
        freeShipping: "TRUE"}
    return newProduct;
};

const addToAirtable = async (product) => {
    console.log('Que llego de product?', product);
    const itemAirtable = {
        records:[{
        fields: product
        }]
    };
    console.log('itemAirtable?', itemAirtable);
    console.log("Intento de envio", JSON.stringify(itemAirtable, null, 2));
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemAirtable)
    })//.then(data => console.log(data));
    const responseData = await respuesta.json();
    console.log(responseData);
}

const botonRealizarAccion = document.getElementById('submit-button');
botonRealizarAccion.addEventListener('click', (event) => {
    event.preventDefault();
    const opcionSeleccionada = document.getElementById('cajaSelectorAccion').value;
    console.log('Opción seleccionada:', opcionSeleccionada);
    switch (opcionSeleccionada) {
        case 'create':
            addToAirtable(addProduct());
            break;
        case 'update':
            break;
        case 'delete':
            break;
    }
});


/*
async function crearProducto(name, collection, description, stock, price, releaseDate, img, freeShipping) {
    const nuevoProducto = {
        fields: {
            name,
            collection,
            description,
            stock,
            price,
            releaseDate,
            img,
            freeShipping
        }
};
*/

/*
async function crearProducto(name,collection,description,stock,price,releaseDate,img,freeShipping){
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ // Convierto el objeto a JSON, que es lo que la API entiende
            fields: {
                name,
                collection,
                description,
                stock,
                price,
                releaseDate,
                img,
                freeShipping
            }
        })
    });

    if (!response.ok) {
        throw new Error('Error al crear el producto');
    }

    const data = await response.json();
    return data;
}
    */