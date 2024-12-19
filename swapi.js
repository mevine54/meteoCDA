const weatherForm = document.getElementById('weather-form');
    const resultsContainer = document.getElementById('results');
    const weatherContainer = document.getElementById('weather-container');

    weatherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const characterName = document.getElementById('character-name').value.toLowerCase();

        try {
            const proxyUrl = `https://www.swapi.tech/api/people/?name=${characterName}`;
            const response = await fetch(proxyUrl);
            const data = await response.json();

            if (!data.result || data.result.length === 0) {
                resultsContainer.innerHTML = '<p>Aucun personnage trouvé.</p>';
                return;
            }

            const character = data.result[0].properties;
            const characterUid = data.result[0].uid; // Récupération de l'UID du personnage
            const characterImage = `https://starwars-visualguide.com/assets/img/characters/${characterUid}.jpg`;

            const characterHTML = `
                <div class="weather-info">
                    <h2>${character.name}</h2>
                    <p>Genre : ${character.gender}</p>
                    <p>Date de naissance : ${character.birth_year}</p>
                    <p>Couleur des yeux : ${character.eye_color}</p>
                    <p>Couleur des cheveux : ${character.hair_color}</p>
                    <p>Taille : ${character.height} cm</p>
                    <p>Poids : ${character.mass} kg</p>
                    <p>Couleur de peau : ${character.skin_color}</p>
                </div>
            `;

            resultsContainer.innerHTML = characterHTML;

            // Ajouter l'image comme fond du conteneur
            weatherContainer.style.backgroundImage = `url(${characterImage})`;
            weatherContainer.style.backgroundSize = 'cover';
            weatherContainer.style.backgroundPosition = 'center';

        } catch (error) {
            console.error(error);
            resultsContainer.innerHTML = `<p>Une erreur est survenue : ${error.message}</p>`;
        }
    });