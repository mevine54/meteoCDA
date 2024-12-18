// Explication : On attend que le DOM soit prêt. Ce n’est pas forcément obligatoire si le script est en bas du body, mais c’est une bonne pratique.
document.addEventListener('DOMContentLoaded', () => {
    // Explication : On sélectionne les éléments du DOM dont on va avoir besoin.
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const cityNameElem = document.getElementById('city-name');
    const descriptionElem = document.getElementById('description');
    const temperatureElem = document.getElementById('temperature');
    const weatherIconElem = document.getElementById('weather-icon');

    // Explication : Insérez ici votre propre clé API OpenWeatherMap
    const apiKey = '76d943e957006b68b13dad3c5b61dfa8'; 
    // Par exemple : const apiKey = '123456789abcdef...';

    // Explication : URL de base de l’API OpenWeatherMap
    // Le paramètre "units=metric" permet d’avoir la température en degrés Celsius.
    // Le paramètre "lang=fr" permet d’avoir la description en français.
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    // Explication : Gestion de l’événement de soumission du formulaire
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        const city = cityInput.value.trim(); // Récupère la valeur de l’input, sans espaces inutiles
        if (city !== '') {
            // Explication : Appel de la fonction pour récupérer la météo de la ville saisie
            fetchWeather(city);
        }
    });

    // Explication : Fonction pour récupérer la météo d’une ville
    async function fetchWeather(city) {
        try {
            // Explication : Construction de l’URL complète avec la ville, la clé API, l’unité et la langue
            const url = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=fr`;
            console.log(url);
            // Explication : Envoi de la requête via fetch
            const response = await fetch(url);

            // Explication : Vérification du statut de la réponse
            if (!response.ok) {
                // Explication : Si problème, on lève une erreur
                throw new Error('Ville non trouvée ou problème réseau');
            }

            // Explication : On parse la réponse en JSON
            const data = await response.json();

            // Explication : On récupère les informations nécessaires de l’objet data
            const cityName = data.name;
            const description = data.weather[0].description; 
            const temperature = Math.round(data.main.temp);
            const iconCode = data.weather[0].icon; // ex: "01d", "04n", etc.

            // Explication : On met à jour l’interface
            cityNameElem.textContent = cityName;
            descriptionElem.textContent = `Conditions : ${description}`;
            temperatureElem.textContent = `Température : ${temperature}°C`;
            weatherIconElem.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            weatherIconElem.style.display = 'inline';

        } catch (error) {
            // Explication : En cas d’erreur, on affiche un message
            cityNameElem.textContent = 'Erreur';
            descriptionElem.textContent = '';
            temperatureElem.textContent = 'Veuillez réessayer avec une autre ville.';
            weatherIconElem.style.display = 'none';
        }
    }

    // Explication : Comment adapter ce code à d'autres APIs ?
    // 1. Changer la variable 'baseUrl' et les paramètres de requête.
    // 2. Adapter le parsing de 'data' en fonction de la structure de la nouvelle API.
    // 3. Mettre à jour le DOM avec les infos spécifiques fournies par l'API.
});
