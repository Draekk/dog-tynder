const API = 'https://api.thedogapi.com/v1/images/search';
const mainImage = document.querySelector('main picture > img');
const badButton = document.querySelector('main button:nth-child(1)');
const goodButton = document.querySelector('main button:nth-child(3)');

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log('Error: ', error);
    }
}

function loadImage(){
    fetchData(API)
        .then((result) => {
            mainImage.alt = 'Esto es un perro!!!'
            mainImage.src = result[0].url;
        })
        .catch((error) => console.error(error))
}

loadImage()
badButton.addEventListener('click', loadImage)
goodButton.addEventListener('click', loadImage)