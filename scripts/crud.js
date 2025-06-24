const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables

import * as app from './app.js';

// me baso en el pdf de la clase.
const products =[];
function addProduct(){
    const newProduct = {
        name: document.getElementById('name').value,
        collection: document.getElementById('collection').value,
        description: document.getElementById('description').value,
        stock: parseInt(document.getElementById('stock').value),
        price: parseInt(document.getElementById('price').value),
        releaseDate: document.getElementById('releaseDate').value,
        img: document.getElementById('img').value,
        freeShipping: String(document.getElementById('freeShipping').checked)
    };
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
    })
    const responseData = await respuesta.json();
    console.log(responseData);
}

const updateAirtable = async (product) => {
    const productId = cajaSelectorProducto.value;
    const itemAirtable = {
        records:[{
        id: productId,
        fields: product // Product se lo envio de fuera
        }]
    };
    console.log('itemAirtable?', itemAirtable);
    console.log("Intento de envio", JSON.stringify(itemAirtable, null, 2));
    const respuesta = await fetch(API_URL, {
        method: 'PATCH', // Cambiamos a PATCH para actualizar
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemAirtable)
    })
    const responseData = await respuesta.json();
    console.log(responseData);
}

const deleteAirtable = async (product) => {
    const productId = cajaSelectorProducto.value;
    const respuesta = await fetch(`${API_URL}/${productId}`, { // Solo se le agrega el id para borrar a la URL
        method: 'DELETE', // Cambiamos a DELETE para eliminar
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
    })
    const responseData = await respuesta.json();
    console.log(responseData);
}



const cajaSelectorProducto = document.getElementById('cajaSelectorProducto');

//Funcion para actualizar el selector de productos
const updateSelector = async () => {
    cajaSelectorProducto.innerHTML = "";
    const list = await app.getProducts();
    console.log('Lista de productos:', list);
    list.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id; // interno de airtable, no se si se podra usar
        option.textContent = product.fields.name; // lo que se ve en el select
        //console.log('EstadoDeOption', option);
        cajaSelectorProducto.appendChild(option);
    })
    await updateDatosFormulario();
}

//Funcion para escuchar el selector de productos
const cajaSelectorAccion = document.getElementById('cajaSelectorAccion');
const selectorProducto = document.getElementById('selectorProducto');
selectorProducto.style.display = 'none'; // Oculto POR DEFECTO a la opcion de elegir producto.
cajaSelectorAccion.addEventListener('change', (event) => {
    const opcionSeleccionada = event.target.value;
    console.log('Opción seleccionada:', opcionSeleccionada);
    switch (opcionSeleccionada) {
        case 'create':
            cajaSelectorProducto.innerHTML = "";
            selectorProducto.style.display = 'none';
            break;
        case 'update':
        case 'delete':
            updateSelector();
            selectorProducto.style.display = 'block';
            break;
    }
});

const updateDatosFormulario = async () => {
    const productoId = cajaSelectorProducto.value; //aca tengo  el id UNICO del producto
    const listaDeProductos = await app.getProducts();
    const productoEncontrado = listaDeProductos.find(producto => producto.id === productoId);
    console.log('Producto encontrado:', productoEncontrado);
    document.getElementById('name').value = productoEncontrado.fields.name;
    document.getElementById('collection').value = productoEncontrado.fields.collection;
    document.getElementById('description').value = productoEncontrado.fields.description;
    document.getElementById('stock').value = productoEncontrado.fields.stock;
    document.getElementById('price').value = productoEncontrado.fields.price;
    document.getElementById('releaseDate').value = productoEncontrado.fields.releaseDate;
    document.getElementById('img').value = productoEncontrado.fields.img;
    document.getElementById('freeShipping').checked = productoEncontrado.fields.freeShipping === 'true'; // Verifico si es true o false
}


cajaSelectorProducto.addEventListener('change', (event) => {
    updateDatosFormulario();
});

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
            updateAirtable(addProduct());
            break;
        case 'delete':
            deleteAirtable(addProduct());
            break;
    }
});
