// Variables de base
const baseURL = "https://v2.jokeapi.dev/";
var categories = ["Programming", "Misc", "Pun", "Spooky", "Christmas"];
var params = [
    "blacklistFlags=nsfw,religious,racist", // Filtrer certaines blagues
    "idRange=0-200" // Limiter l'ID des blagues
];

// Récupérer les éléments du DOM
const jokeText = document.getElementById('jokeText');
const btnFav = document.getElementById('btn_fav');
const listFav = document.getElementById('list_fav');
const btnListFav = document.getElementById('btn_list-fav');
const btnRefresh = document.getElementById('btn_refresh');


let currentJoke = ""; // Variable pour stocker la blague 

function fetchJoke() {
  fetch(baseURL + "/joke/" + categories.join(",") + "?" + params.join("&"))
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erreur de réseau: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Afficher la blague
      if (data.type === "single") {
        currentJoke = data.joke; // Stocker la blague actuelle
        jokeText.innerHTML = `<h1>${data.joke}</h1>`;
      } else {
        currentJoke = `${data.setup} ... ${data.delivery}`; // Stocker la blague actuelle
        jokeText.innerHTML = `<h1>${data.setup}</h1> ... <h2>${data.delivery}</h2>`;
      }
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de la blague:", error);
      jokeText.textContent = "Erreur lors de la récupération de la blague!";
    });
}

// Charge une nouvelle blague au loading de la page
document.addEventListener('DOMContentLoaded', fetchJoke);

// Ajouter une blague aux favs
btnFav.addEventListener('click', () => {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || []; 
  if (!favorites.includes(currentJoke)) {
    favorites.push(currentJoke); // Ajouter la blague si elle n'est pas dans les favoris
    localStorage.setItem('favorites', JSON.stringify(favorites)); // Mettre à jour le localStorage
    alert('Blague ajoutée aux favoris!');
  } else {
    alert('Cette blague est déjà dans les favoris!');
  }
});

// Afficher ou masquer les blagues favorites et créer des boutons pour les supprimer
btnListFav.addEventListener('click', () => {
  if (listFav.style.display === 'none' || listFav.style.display === '') {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    listFav.innerHTML = favorites.map((joke, index) => `
      <li>${joke} <br>
        <button class="btn_removeJoke" data-index="${index}"><img src="./images/remove.svg" alt="Remove joke" class="removeIcon"></button>
      </li>
    `).join('');
    listFav.style.display = 'flex'; 

    // Ajouter des événements aux boutons remove
    document.querySelectorAll('.btn_removeJoke').forEach(button => {
      button.addEventListener('click', (event) => {
        const jokeIndex = event.target.getAttribute('data-index'); // Récupérer l'index de la blague
        removeJoke(jokeIndex); 
      });
    });
  } else {
    listFav.style.display = 'none'; // Masquer la liste si elle est déjà visible
  }
});

// Fonction pour supprimer une blague des favoris
function removeJoke(index) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  favorites.splice(index, 1); // Supprimer la blague de la liste
  localStorage.setItem('favorites', JSON.stringify(favorites)); // update le localStorage
  alert('Blague supprimée des favoris!');
  btnListFav.click(); // Rafraîchir la liste des fav
}

// Appel de la fonction fetchJoke pour rafraîchir la blague présentée
btnRefresh.onclick = () => {
  fetchJoke();
}