const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables
import * as app from './app.js';

const grid = document.querySelector('.catalogo'); // Elemento padre con todos los productos
let listaCarrito = JSON.parse(localStorage.getItem('carrito')) || []; 
let totalValorCarrito=0;

const renderizarCarrito = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json(); // El método json() convierte la respuesta en un objeto JS
    //return data.records;
    data.records.forEach((producto) => {
        const productoEncontradoCarrito = listaCarrito.find(item => item.id === producto.id);
        if (productoEncontradoCarrito) {
            console.log('Producto encontrado en el carrito:', producto);
            totalValorCarrito = totalValorCarrito + (producto.fields.price * (listaCarrito.find(item => item.id === producto.id).cantidad));
            grid.appendChild(createProductCard(producto));
        }
    })
    document.getElementById('total').textContent = totalValorCarrito;
}

// forma clasica de crear la funcion, otra forma, forma de funcion lambda (product) => {}
function createProductCard(product){ 
    const card = document.createElement('article');
    card.classList.add('producto');

    const img = document.createElement('img');
    img.src = product.fields.img;
    img.alt = product.fields.name;


    const botonEliminar = document.createElement('button');
    botonEliminar.classList.add('botonEliminar');
    botonEliminar.textContent = 'X';
    botonEliminar.addEventListener('click', () => {
        const productoId = product.id;  // Obtengo el ID del producto
        console.log('Producto a eliminar:', productoId);
        listaCarrito = listaCarrito.filter(item => item.id !== productoId); // Filter crea un array que cumplen TAL condicion, como aca que sea diferente al prod que quiero eliminar
        localStorage.setItem('carrito', JSON.stringify(listaCarrito)); // Actualizo el carrito en localStorage
        grid.innerHTML = ''; // Limpio el grid
        totalValorCarrito = 0; // LINEA AGREGADA A ULTIMO MOMENTO <----
        renderizarCarrito(); // Vuelvo a renderizar el carrito
        app.actualizarNumeroCarrito(); // Actualizo el contador del carrito
        console.log('Carrito actualizado:', listaCarrito);
    });

    const div = document.createElement('div');
    div.classList.add('infoProducto');

    const divSeparador = document.createElement('div');
    divSeparador.classList.add('divSeparador');

    const title = document.createElement('h2');
    title.textContent = product.fields.name;

    const description = document.createElement('p');
    description.textContent = product.fields.description;

    const price = document.createElement('p');
    price.textContent = `Precio:$${product.fields.price}`; //probar si funciona

    const unidades = document.createElement('p');
    unidades.textContent = `Unidades: ${listaCarrito.find(item => item.id === product.id).cantidad}`; // Busca que producto del carrito tiene la misma ID que el producto que se recibe y devuelve .cantidad"
    

    const form = document.createElement('form');
    form.classList.add('contenedorMenu');
    form.action = "";

    const totalProducto = document.createElement('p');
    totalProducto.textContent = `Total: $${product.fields.price * listaCarrito.find(item => item.id === product.id).cantidad}`;
    totalProducto.classList.add('valorImportante');

    card.appendChild(img);
    card.appendChild(div);
    div.appendChild(title);
    div.appendChild(description);
    div.appendChild(price);
    div.appendChild(unidades);
    div.appendChild(totalProducto);
    div.appendChild(form);
    card.appendChild(divSeparador);
    divSeparador.appendChild(botonEliminar);
    return card;
}

renderizarCarrito();

const botonComprarTotal = document.getElementById('comprarTotal');
botonComprarTotal.addEventListener('click', () => {
    if (listaCarrito.length === 0) {
        alert('El carrito está vacío. Agrega productos antes de comprar.');
        return;
    }
    procesarCompra(listaCarrito);
});
const procesarCompra = async (listaCarrito) => {
    for (const item of listaCarrito) { // Uso for of y no forEach porque necesito usar await dentro del bucle
        const stockActual = await app.getStock(item.id);
        const response = await fetch(`${API_URL}/${item.id}`, {
            method: 'PATCH', // metodo patch es similar al put pero mas PUNTUAL, solo actualiza los campos que le paso
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    stock:stockActual - item.cantidad // Llamo a la funcion getStock para obtener el stock actual y le resto la cantidad del carrito
                }
            })
        });
    };
    listaCarrito = [];
    localStorage.setItem('carrito', JSON.stringify(listaCarrito));
    app.actualizarNumeroCarrito();
    grid.innerHTML = '';
    console.log(listaCarrito);
    console.log(localStorage.getItem('carrito'));
    //renderizarCarrito(); Ver despues, renderiza como si hubiera productos en el carrito
    document.getElementById('total').textContent = '0'; // Reseteo el total a 0
    alert('Compra realizada con éxito.');
}