const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables

// Funcion TEST que trae la tabla por consola
const getProductsTEST = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json(); // El método json() convierte la respuesta en un objeto JS
    console.log('data', data);
}

getProductsTEST();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const getProducts = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json(); // El método json() convierte la respuesta en un objeto JS
    return data.records;
} 


// Debo crear las tarjetas e insertarlas en el DOM
const grid = document.querySelector('.catalogo'); // Elemento padre con todos los productos

// forma clasica de crear la funcion, otra forma, forma de funcion lambda (product) => {}
function createProductCard(product){ 
    const card = document.createElement('article');
    card.classList.add('producto');

    const img = document.createElement('img');
    img.src = product.fields.img;
    img.alt = product.fields.name;

    const div = document.createElement('div');
    div.classList.add('infoProducto');

    const title = document.createElement('h2');
    title.textContent = product.fields.name;

    const description = document.createElement('p');
    description.textContent = product.fields.description;

    const price = document.createElement('p');
    price.textContent = `Precio:$${product.fields.price}`; //probar si funciona

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
    btnDisminuir.textContent = '▼';

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
    div.appendChild(form);
    form.appendChild(btnAumentar);
    form.appendChild(btnDisminuir);
    form.appendChild(input);
    form.appendChild(btnComprar);

    return card;
} 

const renderProducts = async () =>{
    const list = await getProducts();
    list.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    })
}

renderProducts();

//Pruebo ordenar por fecha
const sortReleaseDate = async () =>{
    const list = await getProducts();
    const sortedByReleaseDate = list.sort((a, b) => {
        return new Date(b.fields.releaseDate) - new Date(a.fields.releaseDate); // convierte las fechas en objeto date y resta, de acuerdo a esta comparacion, va ordenando (Como funciona se saca de: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
    });
    console.log('Funcion sortReleaseDate', sortedByReleaseDate);
    return sortedByReleaseDate;
}

// recorto la lista a los 3 mas nuevos
const getTop3Products = async () => {
    const sortedList = await sortReleaseDate();
    console.log('Funcion getTop3Products', sortedList.slice(0, 3));
    return sortedList.slice(0, 3); // Devuelvo los primeros 3 elementos del array
}

getTop3Products();

// Funcion para ordenar por precio (menor a mayor)
const sortByPrice = async () => {
    const list = await getProducts();
    const sortedByPrice = list.sort((a, b) => {
        return a.fields.price - b.fields.price; // Ordena de menor a mayor precio
    });
    console.log('Funcion sortedByPrice (menos a mas)', sortedByPrice);
    return sortedByPrice;
}
sortByPrice();

// Funcion para traer los productos con envio gratis
const getFreeShippingProducts = async () => {
    const list = await getProducts();
    const freeShippingProducts = list.filter(product => product.fields.freeShipping == "TRUE"); // Filtra los productos que tienen freeShipping como true
    console.log('Funcion getFreeShippingProducts', freeShippingProducts);
    return freeShippingProducts;
}

getFreeShippingProducts();
