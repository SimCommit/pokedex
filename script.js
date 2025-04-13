let matches = [];
let currentPokemon;
let startPokemon = 1;
let endPokemon = 4;
let searchPool;
let missingno = {
  name: "missingno.",
  url: "https://en.wikipedia.org/wiki/MissingNo.",
};

async function init() {
  showLoadingScreen();
  await renderOverview(startPokemon, endPokemon);
  loadSearchPool();
}

// Hilfsfunktionen
// stop propagation
function prevent(event) {
  event.stopPropagation();
}

// get element by id
function getElementHelper(id) {
  let element = document.getElementById(id);
  return element;
}

// capitalizeFirstLetter
function capitalizeFirstLetter(stringToChange) {
  return String(stringToChange).charAt(0).toUpperCase() + String(stringToChange).slice(1);
}

// Hauptfunktionen
// Daten-Pool for Pokemon
async function getPokemonData(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  let response = await fetch(url);
  currentPokemon = await response.json();
  // console.log(currentPokemon['sprites']['other']['official-artwork']['front_default']);
  return currentPokemon;
}

// Rendert die Übersicht der Pokemon
async function renderOverview(startPokemon, endPokemon) {
  let container = getElementHelper("overview-container");

  for (let id = startPokemon; id <= endPokemon; id++) {
    currentPokemon = await getPokemonData(id);
    container.innerHTML += renderOverviewTemplate(currentPokemon);
    renderTypes(`types-container-${currentPokemon.id}`);

    if (currentPokemon.id >= 151) {
      // Verbirgt den load-btn sobald das 151ste Pokemon gerendert wurde
      hideLoadBtn();
    }
  }
  hideLoadingScreen();
}

// Rendert die Übersicht der Pokemon, die über die Suchfunktion gefunden wurden
async function renderOverviewMatches() {
  showLoadingScreen();
  let container = getElementHelper("overview-container");
  let startMatchesI = 0;
  let endMatchesI = matches.length;
  container.innerHTML = "";

  for (let iMatches = startMatchesI; iMatches < endMatchesI; iMatches++) {
    // über den Index des Matches array, die ID des currentPokemons ermitteln
    iMatchesToCurrentPokemonId = matches[iMatches].index;
    currentPokemon = await getPokemonData(iMatchesToCurrentPokemonId);
    container.innerHTML += renderOverviewTemplate(currentPokemon);
    renderTypes(`types-container-${currentPokemon.id}`);
  }
  hideLoadingScreen();
  hideLoadBtn();
  showBackBtn();
}

// HTML template der Übersichtskarten
function renderOverviewTemplate(currentPokemon) {
  return /*html*/ `
    <div class="card type-color-${currentPokemon.types[0].type.name}" onclick="openOverlay(${currentPokemon.id})">
        <div class="card-header">
          <span>${capitalizeFirstLetter(currentPokemon.name)}</span>
            <span>${currentPokemon.id}</span>
        </div>
        <div class="card-main">
            <img src="${currentPokemon["sprites"]["other"]["official-artwork"]["front_default"]}" alt="picture of ${
    currentPokemon.types[0].type.name
  }">
        </div>
        <div class="card-footer">
            <div id="types-container-${currentPokemon.id}" class="types">
            </div>
        </div>
    </div>
    `;
}

// rendert einen oder zwei Typen in den mitgegebenen Container (Übersichtskarte/Detailkarte)
function renderTypes(containerId) {
  let container = getElementHelper(containerId);
  container.innerHTML = "";

  for (let i = 0; i < currentPokemon.types.length; i++) {
    container.innerHTML += /*html*/ `
      <div class="type-${currentPokemon.types[i].type.name}"></div>
    `;
  }
}

// Startet den Rendervorgang mit neuem Start- und Endpunkt, um weitere Pokemon hinzuzufügen
function loadMorePokemon() {
  showLoadingScreen();
  startPokemon = endPokemon + 1;
  endPokemon = endPokemon + 21;

  // verhindert einen Endpunkt außerhalb der 1st Gen
  if (endPokemon > 151) {
    endPokemon = 151;
  }

  // verhindert dass das rendern begonnen wird, sollte der Startpunkt gleich dem Endpunkt oder höher sein
  if (startPokemon >= 151) {
    hideLoadBtn();
    hideLoadingScreen();
    return;
  }

  renderOverview(startPokemon, endPokemon);
}

// erzeugt ein array mit den 151 Pokemon sowie missingno auf index 0 damit index = id
async function loadSearchPool() {
  let Url = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
  let response = await fetch(Url);
  let unfinishedSearchPool = await response.json();
  searchPool = [missingno, ...unfinishedSearchPool.results];
}

// durchsucht den Pool der "152" Pokemon nach Übereinstimmungen mit der Eingabe im Inputfeld
async function searchInPool() {
  let inputField = getElementHelper("search-input");
  let inputValue = inputField.value;
  //leert das array matches vor dem neuen Suchvorgang
  emptyMatches();

  if (inputValue.length >= 3) {
    enableSearchBtn();
    let inputRef = inputValue.toLowerCase();
    for (let i = 0; i < searchPool.length; i++) {
      if (searchPool[i].name.includes(inputRef)) {
        matches.push({ index: i, pokemon: searchPool[i] });
      }
    }
    renderSuggestions();
  } else {
    disableSearchBtn();
    closeSuggestions();
  }
}

// Funktionen zum steuern des Search Buttons
function disableSearchBtn() {
  getElementHelper("search-btn").disabled = true;
}

function enableSearchBtn() {
  getElementHelper("search-btn").disabled = false;
}

// rendert die Vorschläge in den Dropdownmenü-Container
function renderSuggestions() {
  let container = document.getElementById("dropdown-suggestions");
  container.innerHTML = "";

  for (let i = 0; i < matches.length; i++) {
    container.innerHTML += /*html*/ `
      <p onclick="handleClickOnSuggestion(${matches[i].index})">${capitalizeFirstLetter(matches[i].pokemon.name)}</p>
    `;
  }
}

// steuert die Logik bei Klick auf einen Suchvorschlag
function handleClickOnSuggestion(matchId) {
  openOverlay(matchId);
  emptySearchInput();
  closeSuggestions();
  disableSearchBtn();
}

// steuert die Logik bei Klick auf den Suchbutton
function handleClickOnSearchBtn() {
  renderOverviewMatches();
  emptySearchInput();
  closeSuggestions();
  disableSearchBtn();
}

// Funktionen zum steuern des Load Buttons
function hideLoadBtn() {
  getElementHelper("load-btn").classList.add("d-none");
}

function showLoadButton() {
  getElementHelper("load-btn").classList.remove("d-none");
}

// Funktionen zum steuern des Back Buttons
function showBackBtn() {
  getElementHelper("back-btn").classList.remove("d-none");
}

function hideBackBtn() {
  getElementHelper("back-btn").classList.add("d-none");
}

// um nach dem gerenderten Suchergebnis wieder vom Start des Pokedex rendern zu lassen
function backToStart() {
  let container = document.getElementById("overview-container");
  showLoadingScreen();
  container.innerHTML = "";
  startPokemon = 1;
  endPokemon = 21;
  hideBackBtn();
  showLoadButton();
  renderOverview(startPokemon, endPokemon);
}

function closeSuggestions() {
  getElementHelper("dropdown-suggestions").innerHTML = "";
}

function emptySearchInput() {
  getElementHelper("search-input").value = "";
}

function emptyMatches() {
  matches = [];
}

// Funktionen um den Loading Screen zu steuern
function showLoadingScreen() {
  getElementHelper("loading-container").classList.remove("d-none");
  disableScrollingBody();
}

function hideLoadingScreen() {
  getElementHelper("loading-container").classList.add("d-none");
  enableScrollingBody();
}

// schließt die Dropdown Liste der Suchvorschläge, wenn das Inputfeld den Fokus verliert leicht verzögert, damit onclick auf die Vorschläge weiter funktioniert
window.addEventListener("DOMContentLoaded", () => {
  getElementHelper("search-input").addEventListener("blur", () => {
    setTimeout(function () {
      closeSuggestions();
    }, 200);
  });
});
