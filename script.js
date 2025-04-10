let amountPerLoad = 21;
let startPointLoad = 0;
let poolOf151 = [];
let matches = [];
let loadCount = 1;
let renderCount = 0;

function init() {
  renderOverview(startPointLoad);
}

async function getPoolOfPokemon() {
  let nameUrl = `https://pokeapi.co/api/v2/pokemon?limit=${151}&offset=${0}`;
  let response = await fetch(nameUrl);
  let currentRequest = await response.json();
  let namesOf151 = currentRequest.results;
  poolOf151 = namesOf151.map((pokemon, index) => ({ index, pokemon }));
  return poolOf151;
}

// fetch pokemon picture from github with blob() and createObjectURL()
async function getImageData(pokeIndex) {
  try {
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokeIndex}.gif`;
    let response = await fetch(imageUrl);
    let imageBlob = await response.blob();
    let imageSrc = URL.createObjectURL(imageBlob);
    return imageSrc;
  } catch (error) {
    console.error(error);
  }
}

// fetch pokemon picture from
// async function getImageDataAlternative(pokeIndex) {
//     let url = `https://pokeapi.co/api/v2/pokemon/${pokeIndex}/`;
//     let response = await fetch(url);
//     let currentData = await response.json();
// let imageUrl =c:\Users\fuchs\Downloads\left-poke-ball.png currentData.sprites.versions['generation-v']['black-white'].animated.front_default;
//     console.log(imageUrl);
//     return imageUrl;
// }

// fetch type icon from github with blob() and createObjectURL()
async function getTypeIcon(typeIndex) {
  let typeIconUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/lets-go-pikachu-lets-go-eevee/${typeIndex}.png`;
  let response = await fetch(typeIconUrl);
  let currentTypeIconBlob = await response.blob();
  let typeIconImageSrc = URL.createObjectURL(currentTypeIconBlob);
  return typeIconImageSrc;
}

// fetch type data from pokeapi for certain pokemon
async function getTypeData(pokeIndex) {
  let detailsUrl = `https://pokeapi.co/api/v2/pokemon/${pokeIndex}/`;
  let response = await fetch(detailsUrl);
  let currentDetails = await response.json();
  let types = [];

  for (let indexTypes = 0; indexTypes < currentDetails.types.length; indexTypes++) {
    types.push(currentDetails.types[indexTypes].type.name);
  }

  return types;
}

// loading type data from db.js for certain pokemon
function getTypeDataAlternative(pokeIndex) {
  let currentPokemon = gen1Pokemon[pokeIndex];
  let firstType = currentPokemon.types;
  return firstType;
}

// type background colors
function cardBackgroundColor(firstType) {
  switch (firstType) {
    case "normal":
      return "#A8A77A";
    case "fighting":
      return "#C22E28";
    case "flying":
      return "#A98FF3";
    case "poison":
      return "#A33EA1";
    case "ground":
      return "#E2BF65";
    case "rock":
      return "#B6A136";
    case "bug":
      return "#A6B91A";
    case "ghost":
      return "#735797";
    case "steel":
      return "#B7B7CE";
    case "fire":
      return "#EE8130";
    case "water":
      return "#6390F0";
    case "grass":
      return "#7AC74C";
    case "electric":
      return "#F7D02C";
    case "psychic":
      return "#F95587";
    case "ice":
      return "#96D9D6";
    case "dragon":
      return "#6F35FC";
    case "dark":
      return "#705746";
    case "fairy":
      return "#D685AD";
    default:
      return "#777"; // fallback-color
  }
}

// Determine type ID to assign icons
function getTypeId(type) {
  switch (type) {
    case "normal":
      return 1;
    case "fighting":
      return 2;
    case "flying":
      return 3;
    case "poison":
      return 4;
    case "ground":
      return 5;
    case "rock":
      return 6;
    case "bug":
      return 7;
    case "ghost":
      return 8;
    case "steel":
      return 9;
    case "fire":
      return 10;
    case "water":
      return 11;
    case "grass":
      return 12;
    case "electric":
      return 13;
    case "psychic":
      return 14;
    case "ice":
      return 15;
    case "dragon":
      return 16;
    case "dark":
      return 17;
    case "fairy":
      return 18;
    default:
      return 19; // unknown type
  }
}

// pokemon grid cards getting rendert
async function renderOverview(startPointLoad) {
  let container = document.getElementById("overview-container");
  poolOf151 = await getPoolOfPokemon();

  for (let i = 0 + startPointLoad; i < amountPerLoad + startPointLoad; i++) {
    if (renderCount >= 151) {
      document.getElementById("load-btn").classList.add("d-none");
      return;
    }
    const pokemonRef = poolOf151[i].pokemon;
    const pokemonId = poolOf151[i].index + 1;
    const pokemonName = capitalizeFirstLetter(pokemonRef.name);
    const pokemonImage = await getImageData(pokemonId);
    const pokemonTypes = await getTypeData(pokemonId); // Alternative aktiviert
    const pokemonFirstType = pokemonTypes[0];
    const typeColor = cardBackgroundColor(pokemonFirstType);
    container.innerHTML += renderOverviewTemplate(pokemonId, pokemonName, pokemonImage, typeColor);
    await renderOverviewTypes(pokemonId, pokemonTypes);
    renderCount++;
  }
  hideLoadingScreen();
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
    const pokemonTypes = await getTypeData(pokemonId); // hier
    const pokemonFirstType = pokemonTypes[0];
    const typeColor = cardBackgroundColor(pokemonFirstType);
    container.innerHTML += renderOverviewTemplate(pokemonId, pokemonName, pokemonImage, typeColor);
    await renderOverviewTypes(pokemonId, pokemonTypes);
  }
}

// HTML template of the cards
function renderOverviewTemplate(pokeIndex, pokemonName, pokemonImage, typeColor) {
  return /*html*/ `
    <div class="card" style="background-color: ${typeColor};" onclick="openOverlay(${pokeIndex})">
        <div class="card-header">
          <span>${pokemonName}</span>
            <span>${pokeIndex}</span>
        </div>
        <div class="card-main">
            <img src="${pokemonImage}" alt="picture of ${pokemonName}">
        </div>
        <div class="card-footer">
            <div id="types-container-${pokeIndex}" class="types">
            </div>
        </div>
    </div>
    `;
}

// 1 or 2 type icons getting rendert
async function renderOverviewTypes(pokeIndex, pokemonTypes) {
  let container = document.getElementById(`types-container-${pokeIndex}`);

  for (let indexTypes = 0; indexTypes < pokemonTypes.length; indexTypes++) {
    let typeIcon = getTypeId(pokemonTypes[indexTypes]);
    let typeIconUrl = await getTypeIcon(typeIcon);
    container.innerHTML += `
    <img src="${typeIconUrl}" alt="icon ${pokemonTypes[indexTypes]}">
  `;
  }
}

// capitalizeFirstLetter
function capitalizeFirstLetter(pokemonName) {
  return String(pokemonName).charAt(0).toUpperCase() + String(pokemonName).slice(1);
}

// monitor input field
async function handleInputEvent() {
  let inputField = document.getElementById("search-input");
  let inputValue = inputField.value;
  let searchBtn = document.getElementById("search-btn");

  if (inputValue.length >= 3) {
    searchBtn.disabled = false;
    let inputRef = inputValue.toLowerCase();
    matches = poolOf151.filter((element) => element.pokemon.name.toLowerCase().includes(inputRef));
    renderSuggestions();
    // console.log(matches[1].index);
  } else {
    searchBtn.disabled = true;
  }
}

function backToStart() {
  showLoadingScreen();
  let container = document.getElementById("overview-container");
  container.innerHTML = "";
  startPointLoad = 0;
  document.getElementById("back-btn").classList.add("d-none");
  document.getElementById("load-btn").classList.remove("d-none");
  renderOverview(startPointLoad);
}

//load more pokemon
function loadMorePokemon() {
  showLoadingScreen();
  pointToLoadFrom = amountPerLoad * loadCount;
  renderOverview(pointToLoadFrom);
  loadCount++;
}

function showLoadingScreen() {
  document.getElementById("loading-container").classList.remove("d-none");
}

function hideLoadingScreen() {
  document.getElementById("loading-container").classList.add("d-none");
}


// render dropdown suggestions
function renderSuggestions(){
  let container = document.getElementById('dropdown-suggestions');
  container.innerHTML = "";

  for (let i = 0; i < matches.length; i++) {
    container.innerHTML += /*html*/`
      <p onclick="openOverlay(${matches[i].index}), suggestionToInput(${i}), closeSuggestions()">${capitalizeFirstLetter(matches[i].pokemon.name)}</p>
    `;
  }
}

function suggestionToInput(i){
  let container = document.getElementById('search-input');
  container.value = `${capitalizeFirstLetter(matches[i].pokemon.name)}`
}

function closeSuggestions(){
  document.getElementById('dropdown-suggestions').innerHTML = "";
}