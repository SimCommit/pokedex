let matches = [];
let currentPokemon;
let startPokemon = 1;
let endPokemon = 1;
let searchPool;

const missingno = {
  name: "missingNo.",
  url: "https://en.wikipedia.org/wiki/MissingNo.",
};

const typeColors = {
  normal: "#919AA2",
  fighting: "#CE416B",
  flying: "#8FA9DE",
  poison: "#AA6BC8",
  ground: "#D97845",
  rock: "#C5B78C",
  bug: "#91C12F",
  ghost: "#5269AD",
  steel: "#5A8EA2",
  fire: "#FF9D54",
  water: "#5090D6",
  grass: "#63BC5A",
  electric: "#F4D23C",
  psychic: "#FA7179",
  ice: "#73CEC0",
  dragon: "#0B6DC3",
  dark: "#5A5465",
  fairy: "#EC8FE6",
  unknown: "#FFFFFF"
};

// Initialization
async function init() {
  showLoadingScreen();
  await renderOverview(startPokemon, endPokemon);
  loadSearchPool();
}

/* Main functions
Data Pool for Pokemon */
async function getPokemonData(id) {
  let url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  try {
    let response = await fetch(url);
    currentPokemon = await response.json();
    return currentPokemon;
  } catch (error) {
    console.error(error);
  }
}

// Rendering missingNo. in case a Pokemon and its data couldnt be found
function renderMissingNo() {
  let container = getElementHelper("overview-container");
  container.innerHTML = renderMissingNoTemplate();
  hideLoadBtn();
  showBackBtn();
  hideLoadingScreen();
  emptySearchInput();
  disableSearchBtn();
}

// Rendering overview of Pokemon, including if condition for hiding the load-btn as soon as the 151st Pokemon got rendered.
async function renderOverview(startPokemon, endPokemon) {
  let container = getElementHelper("overview-container");

  for (let id = startPokemon; id <= endPokemon; id++) {
    await renderOverviewSingleCard(id, container);
  }
  hideLoadingScreen();
}

// Rendering a single overview Pokemon card
async function renderOverviewSingleCard(id, container){
  currentPokemon = await getPokemonData(id);
  const backgroundColor = typeColors[currentPokemon.types[0].type.name] || "#66aed7";

  try {
    container.innerHTML += renderOverviewTemplate(currentPokemon, backgroundColor);
  } catch (error) {
    console.error(error);
    renderMissingNo();
    return;
  }
  
  renderTypes(`types-container-${currentPokemon.id}`);

  if (currentPokemon.id >= 151) {
    hideLoadBtn();
  }
}

// Rendering one or two types in the container provided (overview card/detail card)
function renderTypes(containerId) {
  let container = getElementHelper(containerId);
  container.innerHTML = "";

  for (let i = 0; i < currentPokemon.types.length; i++) {
    container.innerHTML += renderTypesTemplate(i);
  }
}

/* Starts the rendering process with a new start and end point to add more Pokemon,
prevents an endpoint outside the 1st Gen 
prevents rendering from starting if the start point is equal to or higher than the end point */
function loadMorePokemon() {
  showLoadingScreen();
  startPokemon = endPokemon + 1;
  endPokemon = endPokemon + 21;

  if (endPokemon > 151) {
    endPokemon = 151;
  }

  if (startPokemon >= 151) {
    hideLoadBtn();
    hideLoadingScreen();
    return;
  }

  renderOverview(startPokemon, endPokemon);
}

// Creates an array with the 151 Pokemon and missingno at index 0 so that index = id for the search function
async function loadSearchPool() {
  let Url = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
  let response = await fetch(Url);
  let unfinishedSearchPool = await response.json();
  searchPool = [missingno, ...unfinishedSearchPool.results];
}

/* Searches the pool of "152" Pokemon for matches with the value of the input fieldasync 
also prevents searching with input length under 3 characters */
function searchInPool() {
  let inputField = getElementHelper("search-input");
  let inputValue = inputField.value;
  emptyMatches();

  if (inputValue.length >= 3) {
    enableSearchBtn();
    let inputRef = inputValue.toLowerCase();
    pushMatchesIntoArray(inputRef);
    renderSuggestions();
  } else {
    disableSearchBtn();
    closeSuggestions();
  }
}

/* Rendering the overview of Pokemon found by search function
using the index from array of matches to determine the ID of currentPokemon */
async function renderOverviewMatches() {
  showLoadingScreen();
  let container = getElementHelper("overview-container");
  container.innerHTML = "";

  for (let iMatches = 0; iMatches < matches.length; iMatches++) {
    renderOverviewSingleMatch(iMatches, container);
  }

  hideLoadingScreen();
  hideLoadBtn();
  showBackBtn();
}

// Process of rendering a single Pokemon
async function renderOverviewSingleMatch(iMatches, container) {
  iMatchesToCurrentPokemonId = matches[iMatches].index;
  currentPokemon = await getPokemonData(iMatchesToCurrentPokemonId);
  container.innerHTML += renderOverviewTemplate(currentPokemon);
  renderTypes(`types-container-${currentPokemon.id}`);
}

// pushing every match with inputRef into the array "matches"
function pushMatchesIntoArray(inputRef) {
  for (let i = 0; i < searchPool.length; i++) {
    if (searchPool[i].name.includes(inputRef)) {
      matches.push({ index: i, pokemon: searchPool[i] });
    }
  }
}

// Rendering suggestions into dropdown list container
function renderSuggestions() {
  let container = document.getElementById("dropdown-suggestions");
  container.innerHTML = "";

  for (let i = 0; i < matches.length; i++) {
    container.innerHTML += /*html*/ `
      <p onclick="handleClickOnSuggestion(${matches[i].index})">${capitalizeFirstLetter(matches[i].pokemon.name)}</p>
      `;
  }
}

// Handling the logic when clicking on a search suggestion
function handleClickOnSuggestion(matchId) {
  openOverlay(matchId);
  emptySearchInput();
  closeSuggestions();
  disableSearchBtn();
}

// Handling the logic when clicking on the search button
function handleClickOnSearchBtn() {
  if (matches.length === 0) {
    renderMissingNo();
    return;
  }

  renderOverviewMatches();
  emptySearchInput();
  closeSuggestions();
  disableSearchBtn();
}

/* closes the dropdown list of search suggestions when the input field loses focus slightly delayed,
 so that onclick on a suggestion can work */
window.addEventListener("DOMContentLoaded", () => {
  getElementHelper("search-input").addEventListener("blur", () => {
    setTimeout(function () {
      closeSuggestions();
    }, 200);
  });
});

// Function that can render from the start of the Pokedex, to get from the rendered search result back to default.
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

// Utility Functions
// Getting element by id a bit easier
function getElementHelper(id) {
  let element = document.getElementById(id);
  return element;
}

// Function to capitalize the first letter of a string. (Most of the data of the api is written completely in lower case)
function capitalizeFirstLetter(stringToChange) {
  return String(stringToChange).charAt(0).toUpperCase() + String(stringToChange).slice(1);
}

// Stopping propagation for the element on which it's placed
function prevent(event) {
  event.stopPropagation();
}

// Functions for handling the search button usability
function disableSearchBtn() {
  getElementHelper("search-btn").disabled = true;
}

function enableSearchBtn() {
  getElementHelper("search-btn").disabled = false;
}

// Functions for handling the load button visibility
function hideLoadBtn() {
  getElementHelper("load-btn").classList.add("d-none");
}

function showLoadButton() {
  getElementHelper("load-btn").classList.remove("d-none");
}

// Functions for handling the back button visibility
function showBackBtn() {
  getElementHelper("back-btn").classList.remove("d-none");
}

function hideBackBtn() {
  getElementHelper("back-btn").classList.add("d-none");
}

// Functions for handling the back button visibility and scroll behavior
function showLoadingScreen() {
  getElementHelper("loading-container").classList.remove("d-none");
  disableScrollingBody();
}

function hideLoadingScreen() {
  getElementHelper("loading-container").classList.add("d-none");
  enableScrollingBody();
}

// closes the dropdown list of search suggestions
function closeSuggestions() {
  getElementHelper("dropdown-suggestions").innerHTML = "";
}

// Emptying the value of the input field
function emptySearchInput() {
  getElementHelper("search-input").value = "";
}

// Emptying the array of matches
function emptyMatches() {
  matches = [];
}