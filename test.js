const weatherForm = document.getElementById('weather-form');
        const resultsContainer = document.getElementById('results');

        const openWeatherApiKey = '76d943e957006b68b13dad3c5b61dfa8';

        weatherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const address = document.getElementById('address').value;

            // Obtenir les coordonnées via Nominatim
            try {
                const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`);
                const geoData = await geoResponse.json();

                if (geoData.length === 0) {
                    resultsContainer.innerHTML = '<p>Aucune coordonnée trouvée.</p>';
                    return;
                }

                const { lat, lon, display_name } = geoData[0];

                // Obtenir la météo via OpenWeatherMap
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`);
                const weatherData = await weatherResponse.json();

                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`);
                const forecastData = await forecastResponse.json();

                const weatherHTML = `
                    <div class="weather-info">
                        <h2>${display_name}</h2>
                        <p>Température : ${weatherData.main.temp}°C</p>
                        <p>Pression : ${weatherData.main.pressure} hPa</p>
                        <p>Conditions : ${weatherData.weather[0].description}</p>
                        <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}">
                    </div>
                    <div class="forecast">
                        ${forecastData.list.slice(0, 5).map(item => `
                            <div class="forecast-item">
                                <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
                                <p>${item.main.temp}°C</p>
                            </div>
                        `).join('')}
                    </div>
                `;

                resultsContainer.innerHTML = weatherHTML;
            } catch (error) {
                console.error(error);
                resultsContainer.innerHTML = '<p>Une erreur est survenue.</p>';
            }
        });