// open overlay
function openOverlay(id) {
    renderDialogCard(id);
    document.getElementById("overlay").classList.remove("d-none");
    disableScrollingBody();
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("d-none");
  enableScrollingBody();
}

async function getPokemonData(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    let currentPokemon = await response.json();
    // console.log(currentPokemon['sprites']['other']['official-artwork']['front_default']);
    return currentPokemon;
}

// render dialog for detail view of one pokemon
async function renderDialogCard(id) {
  let currentPokemon = await getPokemonData(id);
  let container = document.getElementById("dialog-container");
//   console.log(currentPokemon['sprites']['other']['official-artwork']['front_default']);
  container.innerHTML = renderDialogCardTemplate(currentPokemon);
}

function renderDialogCardTemplate(currentPokemon) {
  return /*html*/ `
   <div class="dialog" style="background-color: ;">
        <nav class="nav-pokemons" aria-label="Navigation through Pokemons">
            <button>previous</button>
            <button>next</button>
        </nav>
        <div class="dialog-main">
            <div>
                <span>${currentPokemon.name}</span>
                <span>${currentPokemon.id}</span>
                <div id="dialog-types-container" class="types"></div>
                <img class="dialog-pic" src="${currentPokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default']}" alt="picture of name">
            </div>
            <div class="details">
                <nav class="nav-details" aria-label="Navigation through detail info">
                    <a href="#">about</a>
                    <a href="#">stats</a>
                    <a href="#">evolution</a>
                    <a href="#">moves</a>
                </nav>
                <div class="about"></div>
                <div class="stats"></div>
                <div class="evolution"></div>
                <div class="moves"></div>
            </div>
        </div>
    </div>
    `;
}

function disableScrollingBody() {
  document.body.classList.add("overflow-hidden");
}

function enableScrollingBody() {
  document.body.classList.remove("overflow-hidden");
}
