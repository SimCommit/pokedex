let amountPerLoad = 21;
let startPointLoad = 0;

function init() {
  getNameData();
}

async function getNameData() {
  let nameUrl = `https://pokeapi.co/api/v2/pokemon?limit=${amountPerLoad}&offset=${startPointLoad}`;
  let response = await fetch(nameUrl);
  let currentRequest = await response.json();
  renderOverview(currentRequest);
}

async function getImageData(pokeIndex) {
  try {
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeIndex}.png`;
    let response = await fetch(imageUrl);
    let imageBlob = await response.blob();
    let imageSrc = URL.createObjectURL(imageBlob);
    return imageSrc;
  } catch (error) {
    console.error(error);
  }
}

async function getTypeData(pokeIndex) {
    let detailsUrl = `https://pokeapi.co/api/v2/pokemon/${pokeIndex}/`;
    let response = await fetch(detailsUrl);
    let currentDetails = await response.json();
    let firstType = currentDetails.types[0].type.name;
    console.log(firstType);
    return firstType;
    // let secondType = currentDetails.types[1].type.name;
    // console.log(secondType);
    
}

async function renderOverview(currentRequest) {
  let container = document.getElementById("overview-container");

  for (let i = 0; i < amountPerLoad; i++) {
    const pokemon = currentRequest.results[i];
    const pokemonImage = await getImageData(i + 1);
    const pokemonType = await getTypeData(i + 1);
    container.innerHTML += renderOverviewTemplate(i, pokemon, pokemonImage, pokemonType);
  }
}

function renderOverviewTemplate(i, pokemon, pokemonImage) {
  return /*html*/ `
    <div class="card">
        <div class="card-header">
            <h3>${pokemon.name}</h3>
        </div>
        <div class="card-main">
            <img src="${pokemonImage}" alt="picture of ${pokemon.name}">
        </div>
        <div class="card-footer">
            <div class="types">
                <img src="" alt="main type">
            </div>
        </div>
    </div>
    `;
}
