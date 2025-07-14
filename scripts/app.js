const API_TOKEN = 'patzBjehHGfd2FzO9.9aabe9349892c530f40039288659ea2b64218bb11680cc51c7fa0efb7517f7a4';
const BASE_ID = 'appSPKO7TLX1jBPct';
const TABLE_NAME = 'products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`; // Se usa $ y no concat para que sea más legible - Tambien los backticks `` son como las comillas pero permiten interpolación de variables

export let top3Products = []; // Uso let para poder reasignar luego, POR ESO NO ES CONST

// Funcion TEST que trae la tabla por consola
const getProductsTEST = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json(); // El método json() convierte la respuesta en un objeto JS (hay un parse dentro)
    console.log('data', data);
}

//Funciones automaticas al inicio
getProductsTEST();
actualizarNumeroCarrito();

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export const getStock = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        // puedo ignorar aclarar el metodo, ya que el por defecto es GET (asi lo interpretan los navegadores)
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json(); // El método json() convierte la respuesta en un objeto JS
    console.log('getStock data', data.fields.stock);
    return data.fields.stock; // Devuelve el stock del producto
}


export const getProducts = async () => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json(); // El método json() convierte la respuesta en un objeto JS
    return data.records;
} 

export function actualizarNumeroCarrito(){ // Esta funcion esta siendo invocada en todos los html, ver que pasa
    console.log(JSON.parse(localStorage.getItem('carrito')).length);
    let contadorAux = 0;
    JSON.parse(localStorage.getItem('carrito')).forEach((item) => {
        contadorAux = contadorAux + item.cantidad; // Recorro y sumo la cantidad de productos
    });
    const elementoContador = document.querySelector('.carritoTexto');
    if (elementoContador) { // Solo lo hace SI EXISTE, lo hago para que no me de error
    elementoContador.innerHTML = contadorAux;
    }
}

// Agregar al carrito
export function agregarCarrito(id, unidades) {
        console.log(`Producto ID: ${id}, Cantidad: ${unidades}`);
        let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Me aseguro que carrito sea un array, si no hay nada en localStorage, inicializo como array vacio
        console.log('Carrito inicio:', carrito);
        const productoExistente = carrito.find(item => item.id === id); // Busco si hay otro producto igual
        if (productoExistente) {
            productoExistente.cantidad = parseInt(unidades) + parseInt(productoExistente.cantidad); // PUede ser NO necesario el parseInt
        } else {
            carrito.push({ id: id, cantidad: parseInt(unidades) }); // Agrego el producto al ARRAY que cree para luego guardarlo en localStorage
        }
        console.log('Carrito actualizado:', carrito);
        localStorage.setItem('carrito', JSON.stringify(carrito)); // lo convierto en string y lo guardo en ese item del localstorage
        console.log('Carrito guardado en localStorage:', JSON.parse(localStorage.getItem('carrito')));
        actualizarNumeroCarrito();
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
    btnAumentar.addEventListener('click', () => {
            input.value = parseInt(input.value) + 1;
    });

    const btnDisminuir = document.createElement('button');
    btnDisminuir.type = 'button';
    btnDisminuir.id = 'contenedorSecundario1Disminuir'; // PUEDE SER QUE NECESITE COMILLAS O ESTE MAL
    btnDisminuir.textContent = '▼';
    btnDisminuir.addEventListener('click', () => {
        if (input.value > 0) {
            input.value = parseInt(input.value) - 1;
        }
    });


    const input = document.createElement('input');
    input.type = 'number';
    input.value = '0';
    input.min = '0';

    const btnComprar = document.createElement('button');
    btnComprar.type = 'button';
    btnComprar.id = product.id; // Le paso el ID unico del producto.
    btnComprar.textContent = 'Comprar';

    btnComprar.addEventListener('click', () => {
        if (input.value <= 0) {
            console.log('Debe ingresar una cantidad mayor a 0');
            return;
        }
        agregarCarrito(product.id, input.value);
    });


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

export const renderProductsCatalogo = async () =>{
    const list = await getProducts();
    list.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    })
}

//renderProducts();

//Pruebo ordenar por fecha
export const sortReleaseDate = async () =>{
    const list = await getProducts();
    const sortedByReleaseDate = list.sort((a, b) => {
        return new Date(b.fields.releaseDate) - new Date(a.fields.releaseDate); // convierte las fechas en objeto date y resta, de acuerdo a esta comparacion, va ordenando (Como funciona se saca de: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
    });
    console.log('Funcion sortReleaseDate', sortedByReleaseDate);
    return sortedByReleaseDate;
}


// Funcion para ordenar por precio (menor a mayor)
export const sortByPrice = async () => {
    const list = await getProducts();
    const sortedByPrice = list.sort((a, b) => {
        return a.fields.price - b.fields.price; // Ordena de menor a mayor precio
    });
    console.log('Funcion sortedByPrice (menos a mas)', sortedByPrice);
    return sortedByPrice;
}
//sortByPrice();

// Funcion para traer los productos con envio gratis
export const getFreeShippingProducts = async () => {
    const list = await getProducts();
    const freeShippingProducts = list.filter(product => product.fields.freeShipping == "TRUE"); // Filtra los productos que tienen freeShipping como true
    console.log('Funcion getFreeShippingProducts', freeShippingProducts);
    return freeShippingProducts; // devuelve lista filtrada
}

//getFreeShippingProducts();


const gridIndex = document.querySelector('.contenedorPrincipal');


function createProductCardIndex(product, index){ 
    const lugarMaquina = ['maquinaIzquierda', 'maquinaCentral', 'MaquinaDerecha'];
    
    const card = document.createElement('div');
    card.classList.add('contenedorSecundario');
    card.id = lugarMaquina[index];

    const img = document.createElement('img');
    img.src = product.fields.img;
    img.classList.add('maquinaPrincipal');
    img.alt = product.fields.name;

    const div = document.createElement('div');
    div.classList.add('infoProducto');

    const title = document.createElement('h2');
    title.textContent = product.fields.name;

    const price = document.createElement('p');
    price.textContent = `Precio:$${product.fields.price}`;

    card.appendChild(img);
    card.appendChild(div);
    div.appendChild(title);
    div.appendChild(price);

    return card;
} 

// recorto la lista a los 3 mas nuevos
export const getTop3Products = async () => {
    const sortedList = await sortReleaseDate();
    console.log('Funcion getTop3Products', sortedList.slice(0, 3));
    return sortedList.slice(0, 3); // Devuelvo los primeros 3 elementos del array
}

//getTop3Products();

export const inicializarTop3Products = async () => {
    top3Products = await getTop3Products();
    console.log('Funcion inicializarTop3Products', top3Products);
    renderProductsIndex(); // Lo debo llamar desde aca para que se haga luego del await
}

export function renderProductsIndex (){
    top3Products.forEach((product,index) => {
        const card = createProductCardIndex(product,index);
        gridIndex.appendChild(card);
    })
    console.log('renderizado');
}

export function moverIzquierda() {
    top3Products.push(top3Products.shift()); // Push agrega al final del array y shift saca el primero y lo devuelve
    renderProductsIndex();
    console.log('boton izq --> renderizado');
}

export function moverDerecha() {
    top3Products.unshift(top3Products.pop()); // Unshift agrega al principio del array y pop saca el ultimo y lo devuelve
    renderProductsIndex();
    console.log('boton der --> renderizado');
}

