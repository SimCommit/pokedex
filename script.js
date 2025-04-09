let amountPerLoad = 18;
let startPointLoad = 0;

function init() {
  getABunchOfPokemon();
}

// fetch a bunch of pokemon (names)
async function getABunchOfPokemon() {
  let nameUrl = `https://pokeapi.co/api/v2/pokemon?limit=${amountPerLoad}&offset=${startPointLoad}`;
  let response = await fetch(nameUrl);
  let currentRequest = await response.json();
  renderOverview(currentRequest);
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
async function renderOverview(currentRequest) {
  let container = document.getElementById("overview-container");

  for (let i = 0; i < amountPerLoad; i++) {
    const pokemon = currentRequest.results[i];
    const pokemonName = capitalizeFirstLetter(pokemon.name);
    const pokemonImage = await getImageData(i + 1);
    const pokemonTypes = await getTypeDataAlternative(i + 1); // Alternative aktiviert
    const pokemonFirstType = pokemonTypes[0];
    const typeColor = cardBackgroundColor(pokemonFirstType);
    container.innerHTML += renderOverviewTemplate(i + 1, pokemonName, pokemonImage, typeColor);
    await renderOverviewTypes(i + 1, pokemonTypes);
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

async function getNamesOf151() {
  let nameUrl = `https://pokeapi.co/api/v2/pokemon?limit=${151}&offset=${0}`;
  let response = await fetch(nameUrl);
  let currentRequest = await response.json();
  let namesOf151 = currentRequest.results;
  return namesOf151;
}

// monitor input field
async function handleInputEvent() {
  console.log('BLING');
  let inputField = document.getElementById("search-input");
  let inputValue = inputField.value;
  let namesOf151 = await getNamesOf151();

  if (inputValue.length >= 3) {
    let inputRef = inputValue.toLowerCase();
    console.log(inputRef);
    let matches = namesOf151.filter(pokemon => pokemon.name.toLowerCase().includes(inputRef));
    console.log(matches);
    
  }
}


// async function handleInputEvent() {
//   console.log('BLING');
  
//   let inputField = document.getElementById("search-input");
//   let matches = await getNamesOf151();
//   inputField.addEventListener("input", () => {
    // let input = inputField.value.toLowerCase();
//   });
// }
