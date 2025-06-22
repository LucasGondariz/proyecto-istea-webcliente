const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const proxy = 'https://cors-anywhere.herokuapp.com/';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables

/*
fetch(API_URL, { 
    headers: {'Authorization': `Bearer ${API_TOKEN}`} 
})
.then(res => console.log(res.ok 
    ? 'Autorizado. El token y la URL son correctos.' 
    : `NO Autorizado. Revisa tus datos. (Error: ${res.status})`
));*/

const getProducts = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json(); // El método json() convierte la respuesta en un objeto JS
    console.log('data', data);
} 
getProducts();

/* 
// Debo crear las tarjetas e insertarlas en el DOM
const grid = document.querySelector('.catalogo'); // Elemento padre con todos los productos

// forma clasita de crear la funcion
function createProductCard(product){ 
    const card = document.createElement('article');
    card.classList.add('producto');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;

    const div = document.createElement('div');
    div.classList.add('infoProducto');

    const title = document.createElement('h2');
    title.textContent = product.name;

    const description = document.createElement('p');
    description.textContent = product.description;

    const price = document.createElement('p');
    price.textContent = `Precio:$${product.price}`; //probar si funciona

    const form = document.createElement('form');
    form.classList.add('contenedorMenu');
    form.action = "";

    const btnAumentar = document.createElement('button');
    btnAumentar.type = 'button';
    btnAumentar.id = 'contenedorSecundario1Aumentar'; // PUEDE SER QUE NECESITE COMILLAS O ESTE MAL
    btnAumentar.textContent = '▲';

    const btnDisminuir = document.createElement('button');
    btnDisminuir.type = 'button';
    btnDisminuir.id = 'contenedorSecundario1Disminuir'; // PUEDE SER QUE NECESITE COMILLAS O ESTE MAL
    btnDisminuir.textContent = '▲';

    const input = document.createElement('input');
    input.type = 'number';
    input.value = '0';
    input.min = '0';

    const btnComprar = document.createElement('button');
    btnComprar.type = 'button';
    btnComprar.id = 'comprarCapsula';
    btnComprar.textContent = 'Comprar';

    card.appendChild(img);
    card.appendChild(div);
    div.appendChild(title);
    div.appendChild(description);
    div.appendChild(price);
    card.appendChild(form);
    form.appendChild(btnAumentar);
    form.appendChild(btnDisminuir);
    form.appendChild(input);
    form.appendChild(btnComprar);

    return card;
} 

//otra forma, forma de funcion lambda (product) => {}


products.forEach(product => {
    const card = createProductCard(product);
    grid.appendChild(card);
}); 
*/