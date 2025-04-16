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
  unknown: "#FFFFFF",
};

/**
 * Initialization function
 *
 */
async function init() {
  showLoadingScreen();
  await renderOverview(startPokemon, endPokemon);
  loadSearchPool();
}

/**
 * Fetches data for a Pokémon
 *
 * @param {number} id - This is the id of the pokemon that we want to fetch data for
 * @returns {Promise<object>} A JSON object of the current Pokémon
 */
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

/**
 * Renders the MissingNo. fallback view when a Pokémon or its data could not be found.
 *
 * This function replaces the overview content with a MissingNo. template
 * and adjusts the UI by hiding or showing relevant elements.
 */
function renderMissingNo() {
  let container = getElementHelper("overview-container");
  container.innerHTML = renderMissingNoTemplate();
  hideLoadBtn();
  showBackBtn();
  hideLoadingScreen();
  emptySearchInput();
  disableSearchBtn();
}

/**
 * Renders an overview of multiple Pokémon by ID range.
 *
 * This function fetches and renders individual Pokémon cards from start to end ID.
 * It also includes a condition to hide the load button when the 151st Pokémon is rendered.
 *
 * @param {number} startPokemon - The starting Pokémon ID.
 * @param {number} endPokemon - The ending Pokémon ID.
 */
async function renderOverview(startPokemon, endPokemon) {
  let container = getElementHelper("overview-container");

  for (let id = startPokemon; id <= endPokemon; id++) {
    await renderOverviewSingleCard(id, container);
  }
  hideLoadingScreen();
}

/**
 * Renders a single Pokémon overview card into the given container element.
 *
 * @param {number} id - The ID of the Pokémon to render.
 * @param {HTMLElement} container - The HTML element where the card will be appended.
 * @returns {Promise<void>}
 */
async function renderOverviewSingleCard(id, container) {
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

/**
 * Renders one or two type icons of the current Pokémon into the given container.
 *
 * Works for both overview cards and detail views.
 *
 * @param {string} containerId - The ID of the HTML container element to render the types into.
 */
function renderTypes(containerId) {
  let container = getElementHelper(containerId);
  container.innerHTML = "";

  for (let i = 0; i < currentPokemon.types.length; i++) {
    container.innerHTML += renderTypesTemplate(i);
  }
}

/**
 * Starts the rendering process to load more Pokémon into the overview.
 *
 * Increases the current start and end range, while ensuring it stays within the bounds
 * of the 1st generation (max ID 151). Also prevents loading if the start point
 * exceeds the available Pokémon.
 *
 * @returns {void}
 */
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

/**
 * Loads the search pool containing the first 151 Pokémon and prepends MissingNo at index 0.
 *
 * This ensures that the Pokémon array index matches the Pokémon ID,
 * simplifying ID-based access in the search functionality.
 *
 * @returns {Promise<void>}
 */
async function loadSearchPool() {
  let Url = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
  let response = await fetch(Url);
  let unfinishedSearchPool = await response.json();
  searchPool = [missingno, ...unfinishedSearchPool.results];
}

/**
 * Searches the pool of 152 Pokémon (including MissingNo) for name matches based on the user input.
 *
 * Prevents searching if the input has fewer than 3 characters.
 * Updates the UI by enabling/disabling the search button and rendering or closing suggestions.
 */
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

/**
 * Renders the overview for all Pokémon found by the search function.
 *
 * Uses the index from the `matches` array to determine the ID of each Pokémon,
 * and displays their overview cards in the main container.
 * Also updates UI elements like the load and back buttons.
 *
 * @returns {Promise<void>}
 */
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

/**
 * Renders a single Pokémon card from the matches array into the given container.
 *
 * Retrieves the Pokémon by its index in the `matches` array, fetches its data,
 * and appends the rendered card including its type badges.
 *
 * @param {number} iMatches - The index in the `matches` array to render.
 * @param {HTMLElement} container - The HTML element where the card will be appended.
 * @returns {Promise<void>}
 */
async function renderOverviewSingleMatch(iMatches, container) {
  iMatchesToCurrentPokemonId = matches[iMatches].index;
  currentPokemon = await getPokemonData(iMatchesToCurrentPokemonId);
  const backgroundColor = typeColors[currentPokemon.types[0].type.name] || "#66aed7";
  container.innerHTML += renderOverviewTemplate(currentPokemon, backgroundColor);
  renderTypes(`types-container-${currentPokemon.id}`);
}

/**
 * Pushes all Pokémon from the search pool whose name includes the input string into the `matches` array.
 *
 * Performs a case-sensitive substring match and stores both the index and the Pokémon data
 * for later use in the search result rendering.
 *
 * @param {string} inputRef - The input string to match against Pokémon names.
 */
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
