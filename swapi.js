const weatherForm = document.getElementById('weather-form');
        const resultsContainer = document.getElementById('results');
        const weatherContainer = document.getElementById('weather-container');

        // API Endpoints et images
        const endpoints = {
            people: "https://www.swapi.tech/api/people",
            planets: "https://www.swapi.tech/api/planets",
            starships: "https://www.swapi.tech/api/starships",
            vehicles: "https://www.swapi.tech/api/vehicles",
            species: "https://www.swapi.tech/api/species",
            films: "https://www.swapi.tech/api/films",
        };

        const imageBaseUrls = {
            people: "https://starwars-visualguide.com/assets/img/characters",
            planets: "https://starwars-visualguide.com/assets/img/planets",
            starships: "https://starwars-visualguide.com/assets/img/starships",
            vehicles: "https://starwars-visualguide.com/assets/img/vehicles",
            species: "https://starwars-visualguide.com/assets/img/species",
            films: "https://starwars-visualguide.com/assets/img/films",
        };

        weatherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = document.getElementById('search-input').value.toLowerCase();
            resultsContainer.innerHTML = "<p>Recherche en cours...</p>";

            let found = false;

            for (const [category, endpoint] of Object.entries(endpoints)) {
                try {
                    const response = await fetch(`${endpoint}/?name=${query}`);
                    const data = await response.json();

                    if (data.result && data.result.length > 0) {
                        const item = data.result[0];
                        const imageUrl = `${imageBaseUrls[category]}/${item.uid}.jpg`;

                        const resultHTML = `
                            <div class="weather-info">
                                <h2>${item.properties.name || item.properties.title}</h2>
                                <p>Catégorie : ${category}</p>
                                <img src="${imageUrl}" alt="Image de ${item.properties.name || item.properties.title}">
                                <div class="details">
                                    <p><strong>Taille :</strong> ${item.properties.height || 'N/A'} cm</p>
                                    <p><strong>Poids :</strong> ${item.properties.mass || 'N/A'} kg</p>
                                    <p><strong>Couleur de peau :</strong> ${item.properties.skin_color || 'N/A'}</p>
                                    <p><strong>Couleur des yeux :</strong> ${item.properties.eye_color || 'N/A'}</p>
                                    <p><strong>Date de naissance :</strong> ${item.properties.birth_year || 'N/A'}</p>
                                    <p><strong>Genre :</strong> ${item.properties.gender || 'N/A'}</p>
                                </div>
                            </div>
                        `;

                        resultsContainer.innerHTML = resultHTML;
                        found = true;
                        break;
                    }
                } catch (error) {
                    console.error(`Erreur lors de la recherche dans ${category}:`, error);
                }
            }

            if (!found) {
                resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
            }
        });