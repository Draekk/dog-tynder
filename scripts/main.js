// Declaración de constantes API
const API = 'https://api.thedogapi.com/v1';
const QPAR = '?api_key=';
const API_KEY = 'live_5TXTNFZOUjeEht7wfDXoyX7IZm3TWvmFNGHZGOo5WaxGjMkiFxZiqV1zcRFLTZ6L';
const RANDOM = '/images/search';
const FAVORITES = '/favourites';
const UPLOADIMAGE = '/images/upload';

//Declaración de constantes del DOM
const mainImage = document.querySelector('main picture > img');
const badButton = document.querySelector('main button:nth-child(1)');
const goodButton = document.querySelector('main button:nth-child(3)');
const favButton = document.querySelector('footer .fav');
const favoritePanel = document.getElementById('favorites');
const cardContainer = document.querySelector('#favorites > .container');
const btnUpload = document.querySelector('footer .upload');
const uploadSection = document.querySelector('#uploadImg');
const form = document.querySelector('#uploadForm');
const btnUploadImg = document.querySelector('#uploadForm button');

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
        if (response.status !== 200) {
            alert(`Hubo un error: ${response.statusText} - ${data.message}`);
        }
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
        const data = await response.json();
        if (response.status !== 200) {
            alert(`Hubo un error: ${response.statusText} - ${data.message}`);
        }
        return data;
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
        if (response.status !== 200) {
            alert(`Hubo un error: ${response.statusText} - ${data.message}`);
        }
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

//Funcion que muestra imagen en etiqueta imagen
async function applyImage(imageUrl) {
    mainImage.src = await imageUrl;
}

//Funcion que elimina imagen de favoritos
async function fetchDeleteFav(url, id) {
    console.log(url + id);
    try {
        const response = await fetch(url + id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'x-api-key': API_KEY
            }
        });
        const data = await response.json();
        if (response.status !== 200) {
            alert(`Hubo un error: ${response.statusText} - ${data.message}`);
        } else {
            alert(`Se ha eliminado ${id} satisfactoriamente`);
        }
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

//Funcion fetch para subir imagenes
async function fetchUploadImages(url, form){
    try {
        console.log(form);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-API-KEY': API_KEY
            },
            body: form
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        if (response.status !== 201) {
            alert(`Hubo un error: ${response.statusText} - ${data.message}`);
        } else {
            alert(`Imagen subida exitosamente`);
        }
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

//Funcion para crear el body y enviarlo al fetch
function generateBody(id) {
    try {
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

//Funcion que llama al upload Fetch
function uploadImage() {
    const formData = new FormData(form);
    fetchUploadImages(API + UPLOADIMAGE, formData)
    .then((result) => {
        applyImage(result.url);
        togglePanels(uploadSection);
    })
    .catch((error) => console.log(error))
}

//Funcion para generar cards de favoritos
function generateFavCard(arr) {
    if (favLength !== arr.length) {
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

            //Creacion de p
            const p = document.createElement('p');
            p.innerHTML = '<b>Dog ID: </b>' + element.image_id;

            //Creacion de deleteButton
            const delBtn = document.createElement('button');
            delBtn.innerText = 'x';
            delBtn.classList.add('deleteBtn')

            //Event de boton de eliminar
            delBtn.addEventListener('click', () => {
                fetchDeleteFav(API + FAVORITES + '/', element.id)
                    .then(() => {
                        fetchFavorites(API + FAVORITES)
                            .then((result) => {
                                card.classList.add('inactive');
                                favLength = result.length;
                            })
                            .catch((error) => console.log('Error: ', error))
                    })
                    .catch((error) => console.log('Error: ', error))
            });

            //Union de elementos a el padre Card
            card.appendChild(picture);
            card.appendChild(p);
            card.appendChild(delBtn);
            cardContainer.appendChild(card);

        }
    }
}

//Abrir panel de favoritos
function toggleFavorites() {
    togglePanels(favoritePanel);
    if (!favoritePanel.classList.contains('inactive')) {
        fetchFavorites(API + FAVORITES)
            .then((result) => {
                generateFavCard(result);
            })
            .catch((error) => console.log('Error: ', error))
    }
}

//Abrir panel de subir imagenes
function toggleUploadPanel() {
    togglePanels(uploadSection);
}

//Comprobar y cerrar paneles abiertos
function togglePanels(element) {
    let elements = [favoritePanel, uploadSection];
    for (const i of elements) {
        if(i.classList.contains('inactive') && i !== element){
            i.classList.add('inactive');
        } else {
            i.classList.toggle('inactive');
        }
    }
    document.querySelector('#uploadForm input').value = '';
}

//Botones y otras funcionalidades
generateImage()
badButton.addEventListener('click', generateImage);
goodButton.addEventListener('click', saveImage);
favButton.addEventListener('click', toggleFavorites);
btnUpload.addEventListener('click', toggleUploadPanel);
btnUploadImg.addEventListener('click', uploadImage);
