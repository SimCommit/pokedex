let pokemonAmountPerLoad = 6;

function init(){
    getPokemonData();
}

async function getPokemonData(params) {
    let pokemonUrl = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonAmountPerLoad}&offset=0`;
    let response = await fetch(pokemonUrl);
    let currentRequest = await response.json();
    renderOverviewRequest(currentRequest);
    console.log(currentRequest);        
}

function renderOverviewRequest(currentRequest){
    let container = document.getElementById('overview-container');

    for (let i = 0; i < pokemonAmountPerLoad; i++) {
        const pokemon = currentRequest.results[i];
        console.log(pokemon);
        
        container.innerHTML += renderOverviewRequestTemplate(i, pokemon);
    }
}

function renderOverviewRequestTemplate(i, pokemon){
    return /*html*/`
        <p>${pokemon.name}</p>
    `
}