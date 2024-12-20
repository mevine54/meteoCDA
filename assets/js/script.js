// Explication : On attend que le DOM soit prêt.
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const cityNameElem = document.getElementById('city-name');
    const descriptionElem = document.getElementById('description');
    const temperatureElem = document.getElementById('temperature');
    const weatherIconElem = document.getElementById('weather-icon');
    const cityImageElem = document.getElementById('city-image');

    // Clé API OpenWeatherMap
    const apiKey = '76d943e957006b68b13dad3c5b61dfa8'; // Remplacez par votre clé OWM
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // Clé API Unsplash
    const unsplashAccessKey = '8IlOqvLsLPLaHg38eC6cp4X0H5dBKbyZ2lVDL7dlQ-8'; // Remplacez par votre clé Unsplash
    const unsplashBaseUrl = 'https://api.unsplash.com/search/photos';

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city !== '') {
            fetchWeather(city);
        }
    });

    async function fetchWeather(city) {
        try {
            const url = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Ville non trouvée ou problème réseau');
            }

            const data = await response.json();
            console.log('Données météo:', data);

            const cityName = data.name;
            const description = data.weather[0].description; 
            const temperature = Math.round(data.main.temp);
            const iconCode = data.weather[0].icon;

            // Mise à jour de l’interface météo
            cityNameElem.textContent = `${cityName}, ${data.sys.country}`;
            descriptionElem.textContent = `Conditions : ${description}`;
            temperatureElem.textContent = `Température : ${temperature}°C`;
            weatherIconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIconElem.style.display = 'inline';

            // Déterminer la requête pour Unsplash en fonction de la météo
            let query;
            const weatherMain = data.weather[0].main.toLowerCase();

            if (weatherMain.includes('clear')) {
                // Temps clair → images ensoleillées
                query = `${cityName} sunny day`;
            } else if (weatherMain.includes('cloud')) {
                // Nuageux → images de ciel couvert
                query = `${cityName} cloudy weather`;
            } else if (weatherMain.includes('rain')) {
                // Pluvieux → images de pluie
                query = `${cityName} rainy street`;
            } else if (weatherMain.includes('snow')) {
                // Neige → images enneigées
                query = `${cityName} snowy landscape`;
            } else {
                // Par défaut, juste le nom de la ville
                query = cityName; 
            }

            // Appel de la fonction pour récupérer l'image d'Unsplash
            fetchCityImage(query);

        } catch (error) {
            console.error(error);
            cityNameElem.textContent = 'Erreur';
            descriptionElem.textContent = '';
            temperatureElem.textContent = 'Veuillez réessayer avec une autre ville.';
            weatherIconElem.style.display = 'none';
            cityImageElem.style.display = 'none';
        }
    }

    async function fetchCityImage(query) {
        try {
            // On peut ajuster per_page ou orientation
            const url = `${unsplashBaseUrl}?query=${encodeURIComponent(query)}&client_id=${unsplashAccessKey}&per_page=1&orientation=landscape`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Problème avec l\'API Unsplash');
            }

            const imageData = await response.json();
            console.log('Données Unsplash:', imageData);

            if (imageData.results && imageData.results.length > 0) {
                const imageUrl = imageData.results[0].urls.regular;
                cityImageElem.src = imageUrl;
                cityImageElem.style.display = 'block';
            } else {
                // Aucune image trouvée, on peut masquer l'image ou en mettre une par défaut
                cityImageElem.style.display = 'none';
            }
        } catch (error) {
            console.error(error);
            // En cas d'erreur, on masque l'image
            cityImageElem.style.display = 'none';
        }
    }
});
