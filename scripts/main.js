// Declaración de constantes
const API = 'https://api.thedogapi.com/v1';
const QPAR = '?api_key=';
const API_KEY = 'live_5TXTNFZOUjeEht7wfDXoyX7IZm3TWvmFNGHZGOo5WaxGjMkiFxZiqV1zcRFLTZ6L';
const RANDOM = '/images/search';
const FAVORITES = '/favourites';
const mainImage = document.querySelector('main picture > img');
const badButton = document.querySelector('main button:nth-child(1)');
const goodButton = document.querySelector('main button:nth-child(3)');

//Declaración de variables
let imageData;

//Función fetch para obtener imagen aleatoria
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
async function fetchFavorites(_body){
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
function saveImage(){
    console.log('image data: ',imageData);
    fetchFavorites(generateBody(imageData[0].id))
        .then((result) => {
            console.log(result);
        })
        .catch((error) => console.log('Error: ', error))
}

//Botones y otras funcionalidades
generateImage()
badButton.addEventListener('click', generateImage);
goodButton.addEventListener('click', saveImage);