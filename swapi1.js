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
                                    ${generateDetails(category, item.properties)}
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

        function generateDetails(category, properties) {
            switch (category) {
                case 'people':
                    return `
                        <p><strong>Taille :</strong> ${properties.height || 'N/A'} cm</p>
                        <p><strong>Poids :</strong> ${properties.mass || 'N/A'} kg</p>
                        <p><strong>Couleur de peau :</strong> ${properties.skin_color || 'N/A'}</p>
                        <p><strong>Couleur des yeux :</strong> ${properties.eye_color || 'N/A'}</p>
                        <p><strong>Date de naissance :</strong> ${properties.birth_year || 'N/A'}</p>
                        <p><strong>Genre :</strong> ${properties.gender || 'N/A'}</p>
                    `;
                case 'planets':
                    return `
                        <p><strong>Climat :</strong> ${properties.climate || 'N/A'}</p>
                        <p><strong>Diamètre :</strong> ${properties.diameter || 'N/A'} km</p>
                        <p><strong>Population :</strong> ${properties.population || 'N/A'}</p>
                        <p><strong>Gravité :</strong> ${properties.gravity || 'N/A'}</p>
                        <p><strong>Terrain :</strong> ${properties.terrain || 'N/A'}</p>
                    `;
                case 'starships':
                case 'vehicles':
                    return `
                        <p><strong>Modèle :</strong> ${properties.model || 'N/A'}</p>
                        <p><strong>Fabricant :</strong> ${properties.manufacturer || 'N/A'}</p>
                        <p><strong>Coût :</strong> ${properties.cost_in_credits || 'N/A'} crédits</p>
                        <p><strong>Vitesse maximale :</strong> ${properties.max_atmosphering_speed || 'N/A'}</p>
                        <p><strong>Capacité :</strong> ${properties.cargo_capacity || 'N/A'}</p>
                    `;
                case 'species':
                    return `
                        <p><strong>Classification :</strong> ${properties.classification || 'N/A'}</p>
                        <p><strong>Désignation :</strong> ${properties.designation || 'N/A'}</p>
                        <p><strong>Espérance de vie moyenne :</strong> ${properties.average_lifespan || 'N/A'} ans</p>
                        <p><strong>Langue :</strong> ${properties.language || 'N/A'}</p>
                        <p><strong>Couleur moyenne de peau :</strong> ${properties.skin_colors || 'N/A'}</p>
                    `;
                case 'films':
                    return `
                        <p><strong>Titre :</strong> ${properties.title || 'N/A'}</p>
                        <p><strong>Date de sortie :</strong> ${properties.release_date || 'N/A'}</p>
                        <p><strong>Réalisateur :</strong> ${properties.director || 'N/A'}</p>
                        <p><strong>Producteur :</strong> ${properties.producer || 'N/A'}</p>
                        <p><strong>Résumé :</strong> ${properties.opening_crawl || 'N/A'}</p>
                    `;
                default:
                    return '<p>Aucune information disponible.</p>';
            }
        }