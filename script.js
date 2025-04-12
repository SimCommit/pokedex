let matches = [];
let loadCount = 1;
let currentPokemon;
let startPokemon = 1;
let endPokemon = 3;
let searchPool;
let missingno = {
  name: "missingno.",
  url: "https://pokeapi.co/api/v2/pokemon/1/",
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
// Name Pool for Pokemon
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
  enableLoadBtn();
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

// rendert einen oder zwei Typen in die Übersichtskarte
function renderTypes(containerId) {
  let container = getElementHelper(containerId);
  container.innerHTML = "";

  for (let i = 0; i < currentPokemon.types.length; i++) {
    container.innerHTML += /*html*/ `
      <div class="type-${currentPokemon.types[i].type.name}"></div>
    `;
  }
}

// Startet den Rendervorgang mit neuem Start- und Endpunkt
function loadMorePokemon() {
  showLoadingScreen();
  startPokemon = endPokemon + 1;
  endPokemon = endPokemon + 21;

  if (endPokemon > 151) {
    // verhindert einen Endpunkt außerhalb der 1st Gen
    endPokemon = 151;
  }

  if (startPokemon > 150) {
    hideLoadBtn();
    hideLoadingScreen();
    return; // verhindert dass das rendern begonnen wird, sollte der Startpunkt bereits dem Endpunkt oder höher entsprechen
  }

  renderOverview(startPokemon, endPokemon);
}

// erzeugt ein array mit den 151 Pokemon sowie missingno auf index 0 damit index = id
async function loadSearchPool() {
  let Url = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";
  let response = await fetch(Url);
  let unfinishedSearchPool = await response.json();

  searchPool = [missingno, ...unfinishedSearchPool.results];

  console.log(searchPool);
}

// durchsucht den Pool der "152" Pokemon nach Übereinstimmungen mit der Eingabe im Inputfeld    matches = searchPool.filter((element) => element.name.includes(inputRef));

async function searchInPool() {
  let inputField = document.getElementById("search-input");
  let inputValue = inputField.value;
  let searchBtn = document.getElementById("search-btn");

  if (inputValue.length >= 3) {
    searchBtn.disabled = false;
    let inputRef = inputValue.toLowerCase();
    for (let i = 0; i < searchPool.length; i++) {
      if (searchPool[i].name.includes(inputRef)) {
        matches.push({ index: i, pokemon: searchPool[i] });
      }
    }
    renderSuggestions();
  } else {
    searchBtn.disabled = true;
    closeSuggestions();
  }
}

// render dropdown suggestions
function renderSuggestions() {
  let container = document.getElementById("dropdown-suggestions");
  container.innerHTML = "";

  for (let i = 0; i < matches.length; i++) {
    container.innerHTML += /*html*/ `
      <p onclick="openOverlay(${matches[i].index}), closeSuggestions(), emptySearchInput()">${capitalizeFirstLetter(matches[i].pokemon.name)}</p>
    `;
  }

  emptyMatches()
}

async function renderOverviewMatches() {
  document.getElementById("load-btn").classList.add("d-none");
  document.getElementById("back-btn").classList.remove("d-none");
  let container = document.getElementById("overview-container");
  container.innerHTML = "";

  for (let i = 0; i < matches.length; i++) {
    const pokemonRef = matches[i].pokemon;
    const pokemonId = matches[i].index + 1;
    const pokemonName = capitalizeFirstLetter(pokemonRef.name);
    const pokemonImage = await getImageData(pokemonId);
    const pokemonTypes = await getTypeDataForms(pokemonId); // hier
    const pokemonFirstType = pokemonTypes[0].type.name;
    const typeColor = cardBackgroundColor(pokemonFirstType);
    container.innerHTML += renderOverviewTemplate(pokemonId, pokemonName, pokemonImage, typeColor);
    await renderOverviewTypes(pokemonId, pokemonTypes);
  }
}

function enableLoadBtn() {
  getElementHelper("load-btn").disabled = false;
}

function hideLoadBtn() {
  getElementHelper("load-btn").classList.add("d-none");
}

// 1 or 2 type icons getting rendert
// async function renderOverviewTypes(pokeIndex, pokemonTypes) {
//   let container = document.getElementById(`types-container-${pokeIndex}`);

//   for (let indexTypes = 0; indexTypes < pokemonTypes.length; indexTypes++) {
//     let typeIcon = getTypeId(pokemonTypes[indexTypes].type.name);
//     let typeIconUrl = await getTypeIcon(typeIcon);
//     container.innerHTML += `
//     <img src="${typeIconUrl}" alt="icon ${pokemonTypes[indexTypes]}">
//   `;
//   }
// }

// monitor input field
// async function handleInputEvent() {
//   let inputField = document.getElementById("search-input");
//   let inputValue = inputField.value;
//   let searchBtn = document.getElementById("search-btn");

//   if (inputValue.length >= 3) {
//     searchBtn.disabled = false;
//     let inputRef = inputValue.toLowerCase();
//     matches = poolOf151.filter((element) => element.pokemon.name.toLowerCase().includes(inputRef));
//     renderSuggestions();
//   } else {
//     searchBtn.disabled = true;
//     closeSuggestions();
//   }
// }

// to return from rendered search grid to default grid
function backToStart() {
  showLoadingScreen();
  let container = document.getElementById("overview-container");
  container.innerHTML = "";
  startPointLoad = 0;
  document.getElementById("back-btn").classList.add("d-none");
  document.getElementById("load-btn").classList.remove("d-none");
  renderOverview(startPointLoad);
}

function showLoadingScreen() {
  document.getElementById("loading-container").classList.remove("d-none");
}

function hideLoadingScreen() {
  document.getElementById("loading-container").classList.add("d-none");
}

function closeSuggestions() {
  document.getElementById("dropdown-suggestions").innerHTML = "";
}

function emptySearchInput() {
  getElementHelper("search-input").value = "";
}

function emptyMatches() {
  matches = [];
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-input").addEventListener("blur", () => {
    setTimeout(function () {
      closeSuggestions();
    }, 500);
  });
});
