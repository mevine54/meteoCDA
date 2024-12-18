//On attend que le DOM soit prêt. Ce n’est pas forcément obligatoire si le script est en bas du body, mais c’est une bonne pratique.
document.addEventListener('DOMContentLoaded', () => {
    //On sélectionne les éléments du DOM dont on va avoir besoin.
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const cityNameElem = document.getElementById('city-name');
    const descriptionElem = document.getElementById('description');
    const temperatureElem = document.getElementById('temperature');
    const weatherIconElem = document.getElementById('weather-icon');
    const cityImageElem = document.getElementById('city-image');

    // Insérez ici votre propre clé API OpenWeatherMap
    const apiKey = '76d943e957006b68b13dad3c5b61dfa8'; 

    // URL de base de l’API OpenWeatherMap
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // Clé API Unsplash
    const unsplashAccessKey = '8IlOqvLsLPLaHg38eC6cp4X0H5dBKbyZ2lVDL7dlQ-8';
    const unsplashBaseUrl = 'https://api.unsplash.com/search/photos';

    // Gestion de l’événement de soumission du formulaire
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        const city = cityInput.value.trim(); // Récupère la valeur de l’input, sans espaces inutiles
        if (city !== '') {
            // Appel de la fonction pour récupérer la météo de la ville saisie
            fetchWeather(city);
        }
    });

    // Fonction pour récupérer la météo d’une ville
    async function fetchWeather(city) {
        try {
            // Construction de l’URL complète avec la ville, la clé API, l’unité et la langue
            const url = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`;
            console.log(url);
            // Envoi de la requête via fetch
            const response = await fetch(url);

            // Vérification du statut de la réponse
            if (!response.ok) {
                //Si problème, on lève une erreur
                throw new Error('Ville non trouvée ou problème réseau');
            }

            // On parse la réponse en JSON
            const data = await response.json();
            console.log(data);
            // On récupère les informations nécessaires de l’objet data
            const cityName = data.name;
            const country = data.sys.country;
            const description = data.weather[0].description; 
            const temperature = Math.round(data.main.temp);
            const iconCode = data.weather[0].icon; // ex: "01d", "04n", etc.

            // On met à jour l’interface
            cityNameElem.textContent = `${cityName}, ${data.sys.country}`;
            descriptionElem.textContent = `Conditions : ${description}`;
            temperatureElem.textContent = `Température : ${temperature}°C`;
            weatherIconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIconElem.style.display = 'inline';

            

            // Après avoir récupéré la météo, on obtient une image depuis Unsplash
            // On peut utiliser le nom de la ville + la description météo comme termes de recherche
            const query = `${cityName} ${description}`;
            fetchCityImage(query);

        } catch (error) {
            // En cas d’erreur, on affiche un message
            cityNameElem.textContent = 'Erreur';
            descriptionElem.textContent = '';
            temperatureElem.textContent = 'Veuillez réessayer avec une autre ville.';
            weatherIconElem.style.display = 'none';
            cityImageElem.style.display = 'none';
        }
    }


    async function fetchCityImage(query) {
        try {
            const url = `${unsplashBaseUrl}?query=${encodeURIComponent(query)}&client_id=${unsplashAccessKey}&per_page=1`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Problème avec l\'API Unsplash');
            }

            const imageData = await response.json();
            console.log(imageData);

            if (imageData.results && imageData.results.length > 0) {
                const imageUrl = imageData.results[0].urls.regular;
                cityImageElem.src = imageUrl;
                cityImageElem.style.display = 'block';
            } else {
                // Aucune image trouvée, on peut afficher une image par défaut ou masquer l'élément
                cityImageElem.style.display = 'none';
            }
        } catch (error) {
            console.error(error);
            // En cas d'erreur, on peut afficher une image par défaut ou rien
            cityImageElem.style.display = 'none';
        }
    }

    // Comment adapter ce code à d'autres APIs ?
    // 1. Changer la variable 'baseUrl' et les paramètres de requête.
    // 2. Adapter le parsing de 'data' en fonction de la structure de la nouvelle API.
    // 3. Mettre à jour le DOM avec les infos spécifiques fournies par l'API.
});
