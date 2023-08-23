// Declaración de constantes
const API = 'https://api.thedogapi.com/v1';
const QPAR = '?api_key=';
const API_KEY = 'live_5TXTNFZOUjeEht7wfDXoyX7IZm3TWvmFNGHZGOo5WaxGjMkiFxZiqV1zcRFLTZ6L';
const RANDOM = '/images/search';
const FAVORITES = '/favourites';
const mainImage = document.querySelector('main picture > img');
const badButton = document.querySelector('main button:nth-child(1)');
const goodButton = document.querySelector('main button:nth-child(3)');
const favButton = document.querySelector('footer button');
const favoritePanel = document.getElementById('favorites');
const cardContainer = document.querySelector('#favorites > .container');

//Declaración de variables
let imageData;
let favLength = 0;

//Función fetch para obtener imagen aleatoria
//por defecto, retornará un ARRAY‼️
async function fetchData(url) {
    try {
        const response = await fetch(url + QPAR + API_KEY);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

//Funcion fetch para guardar imagen en favoritos
async function fetchSaveFavorites(_body) {
    try {
        const response = await fetch(API + FAVORITES, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-api-key': API_KEY,
            },
            body: _body
        });
        return response;
    } catch (error) {
        console.log('Error: ', error);
    }
}

//Funcion fetch para obtener los favoritos
async function fetchFavorites(url) {
    try {
        const response = await fetch(url + QPAR + API_KEY);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

//Funcion que muestra imagen en etiqueta imagen
async function applyImage(imageUrl) {
    mainImage.src = await imageUrl;
}

//Funcion para crear el body y enviarlo al fetch
function generateBody(id) {
    try {
        console.log('Generando id: ', id);
        let body = JSON.stringify({
            'image_id': id,
            'sub_id': 'user-123'
        });
        return body;
    } catch (error) {
        console.log('Error: ', error);
    }
}

//Funcion que llama al fetch random
function generateImage() {
    fetchData(API + RANDOM)
        .then((result) => {
            imageData = result;
            applyImage(imageData[0].url)
        })
        .catch((error) => console.error(error))
}

//Funcion que llama al fetch favorites
function saveImage() {
    console.log('image data: ', imageData);
    fetchSaveFavorites(generateBody(imageData[0].id))
        .then((result) => {
            console.log(result);
            generateImage();
        })
        .catch((error) => console.log('Error: ', error))
}

//Funcion para generar cards de favoritos
function generateFavCard(arr) {
    if(favLength < arr.length){
        const newArr = arr.slice(favLength);
        favLength = arr.length;
        for (const element of newArr) {
            //creacion de card container
            const card = document.createElement('div');
            card.classList.add('container');
            card.classList.add('card');
    
            //Creacion de picture
            const picture = document.createElement('picture');
            const img = document.createElement('img');
            img.setAttribute('src', element.image.url)
            picture.classList.add('favImgContainer');
            picture.appendChild(img);
    
            //Creaccion de p
            const p = document.createElement('p');
            p.innerHTML = '<b>Dog ID: </b>' + element.image_id;
    
            //Union de elementos a el padre Card
            card.appendChild(picture);
            card.appendChild(p);
            cardContainer.appendChild(card);
        }
    }
}

//Abrir panel de favoritos
function toggleFavorites() {
    favoritePanel.classList.toggle('inactive');
    if (!favoritePanel.classList.contains('inactive')) {
        fetchFavorites(API + FAVORITES)
            .then((result) => {
                console.log(result);
                generateFavCard(result);
            })
            .catch((error) => console.log('Error: ', error))
    }
}

//Botones y otras funcionalidades
generateImage()
badButton.addEventListener('click', generateImage);
goodButton.addEventListener('click', saveImage);
favButton.addEventListener('click', toggleFavorites)

// const perros = [
//     {
//         id: 'qwe',
//         url: 'sfwwe'
//     },
//     {
//         id: 'qwe',
//         url: 'sfwwe'
//     },
//     {
//         id: 'qwe',
//         url: 'sfwwe'
//     },
//     {
//         id: 'qwe',
//         url: 'sfwwe'
//     },
//     {
//         id: 'qwe',
//         url: 'sfwwe'
//     },
//     {
//         id: 'qwe',
//         url: 'sfwwe'
//     }
// ]

// generateFavCard(perros);