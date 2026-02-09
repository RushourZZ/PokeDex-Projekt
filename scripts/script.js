//#region Initialization
function init() {
    loadPokemon();
    setupKeyboardNavigation();
}
//#endregion

//#region Keyboard Navigation
function setupKeyboardNavigation() {
    document.addEventListener("keydown", handleKeyPress);
}

function handleKeyPress(event) {
    const modal = document.getElementById("pokemonModal");
    if (!modal.classList.contains("active")) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") showPreviousPokemon();
    if (event.key === "ArrowRight") showNextPokemon();
}
//#endregion

//#region Helpers - Formatting
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatPokemonId(id) {
    return id.toString().padStart(3, "0");
}

function getPokemonImageUrl(pokemon) {
    return pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
}
//#endregion

//#region Helpers - Type Colors
function getTypeGradient(types, isCard) {
    const colors1 = TYPE_COLORS[types[0].type.name] || TYPE_COLORS.normal;
    if (types.length === 1) {
        return isCard
            ? `linear-gradient(145deg, ${colors1[0]}ee, ${colors1[1]}e6)`
            : `linear-gradient(135deg, ${colors1[0]}, ${colors1[1]})`;
    }
    const colors2 = TYPE_COLORS[types[1].type.name] || TYPE_COLORS.normal;
    return `linear-gradient(135deg, ${colors1[1]} 0%, ${colors1[0]} 35%, ${colors2[0]} 65%, ${colors2[1]} 100%)`;
}

function buildTypesBadgesHtml(types) {
    return types.map(t => renderTypeBadgeTemplate(t.type.name, capitalizeFirst(t.type.name))).join("");
}
//#endregion

//#region Data Preparation - Pokemon Card
function buildCardData(pokemon) {
    return {
        id: pokemon.id,
        formattedId: formatPokemonId(pokemon.id),
        imageUrl: getPokemonImageUrl(pokemon),
        name: capitalizeFirst(pokemon.name),
        gradient: getTypeGradient(pokemon.types, true),
        typesBadgesHtml: buildTypesBadgesHtml(pokemon.types),
        height: (pokemon.height / 10).toFixed(1),
        weight: (pokemon.weight / 10).toFixed(1),
    };
}
//#endregion

//#region Data Preparation - Detail View
function buildDetailData(pokemon) {
    return {
        formattedId: formatPokemonId(pokemon.id),
        name: capitalizeFirst(pokemon.name),
        gradient: getTypeGradient(pokemon.types, false),
        typesBadgesHtml: buildTypesBadgesHtml(pokemon.types),
        imageUrl: getPokemonImageUrl(pokemon),
        basicInfoHtml: buildBasicInfoHtml(pokemon),
        abilitiesHtml: buildAbilitiesHtml(pokemon),
        statsHtml: buildStatsHtml(pokemon.stats),
    };
}

function buildBasicInfoHtml(pokemon) {
    const data = {
        height: (pokemon.height / 10).toFixed(1),
        weight: (pokemon.weight / 10).toFixed(1),
        baseExperience: pokemon.base_experience || "—",
    };
    return renderBasicInfoTemplate(data);
}

function buildAbilitiesHtml(pokemon) {
    const text = pokemon.abilities.map(a => capitalizeFirst(a.ability.name)).join(", ");
    return renderAbilitiesTemplate(text);
}

function buildStatsHtml(stats) {
    const rowsHtml = stats.map(s => buildStatBarHtml(s)).join("");
    return renderBaseStatsTemplate(rowsHtml);
}

function buildStatBarHtml(stat) {
    const data = {
        name: STAT_NAMES[stat.stat.name] || stat.stat.name,
        value: stat.base_stat,
        percentage: Math.min((stat.base_stat / 255) * 100, 100),
    };
    return renderStatBarTemplate(data);
}
//#endregion

//#region Data Preparation - Evolution Chain
function buildEvolutionStagesHtml(evolutions) {
    return evolutions.map((evo, i) => buildEvolutionStageHtml(evo, i, evolutions.length)).join("");
}

function buildEvolutionStageHtml(evo, index, total) {
    const showArrow = !evo.isBranch && index < total - 1;
    const data = {
        imgUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`,
        name: capitalizeFirst(evo.name),
        arrowHtml: showArrow ? '<span class="evo-arrow">→</span>' : "",
    };
    return renderEvolutionStageTemplate(data);
}
//#endregion

//#region API - Load Pokemon
async function loadPokemon() {
    if (isLoading) return;
    isLoading = true;
    toggleLoadButton(true);
    showLoadingSpinner(true);
    try {
        await fetchPokemonBatch();
    } catch (error) {
        showError("Failed to load Pokémon. Please try again.");
    }
    showLoadingSpinner(false);
    isLoading = false;
    toggleLoadButton(false);
}

async function fetchPokemonBatch() {
    const url = `${API_BASE_URL}?limit=${POKEMON_PER_LOAD}&offset=${currentOffset}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    await processPokemonList(data.results);
    currentOffset += POKEMON_PER_LOAD;
}

async function processPokemonList(pokemonList) {
    for (const pokemon of pokemonList) {
        const details = await fetchPokemonDetails(pokemon.url);
        allPokemon.push(details);
        renderSinglePokemon(details);
    }
}

async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Pokemon not found");
    return await response.json();
}
//#endregion

//#region API - Evolution Chain
async function loadEvolutionChain(pokemonId) {
    try {
        const speciesData = await fetchSpeciesData(pokemonId);
        const evoData = await fetchEvolutionData(speciesData.evolution_chain.url);
        renderEvolutionChain(evoData.chain, pokemonId);
    } catch (error) {
        document.getElementById("tab-evolution").innerHTML = '<p class="tab-placeholder">Not available</p>';
    }
}

async function fetchSpeciesData(pokemonId) {
    const response = await fetch(`${API_SPECIES_URL}/${pokemonId}`);
    if (!response.ok) throw new Error("Species not found");
    return await response.json();
}

async function fetchEvolutionData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Evolution not found");
    return await response.json();
}
//#endregion

//#region UI - Loading Indicator
function showLoadingSpinner(show) {
    const dialog = document.getElementById("loadingDialog");
    if (show) {
        dialog.showModal();
    } else {
        dialog.close();
    }
}

function showError(message) {
    alert(message);
}

function toggleLoadButton(loading) {
    const btn = document.getElementById("loadMoreBtn");
    btn.disabled = loading;
    btn.textContent = loading ? "Loading..." : "Load 20 more Pokémon";
}
//#endregion

//#region Rendering - Pokemon Cards
function renderSinglePokemon(pokemon) {
    const container = document.getElementById("pokemonContainer");
    container.innerHTML += renderPokemonCardTemplate(buildCardData(pokemon));
}

function renderFilteredPokemon() {
    const container = document.getElementById("pokemonContainer");
    container.innerHTML = filteredPokemon.map(p => renderPokemonCardTemplate(buildCardData(p))).join("");
}
//#endregion

//#region Search
function handleSearchKeydown(event) {
    if (event.key === "Enter") executeSearch();
}

function executeSearch() {
    const input = document.getElementById("searchInput");
    const searchTerm = input.value.trim().toLowerCase();
    if (searchTerm.length === 0) return resetSearch();
    if (searchTerm.length < 3) return showSearchError();
    filterPokemon(searchTerm);
}

function showSearchError() {
    alert("Please enter at least 3 characters.");
}

function resetSearch() {
    currentSearchTerm = "";
    renderAllPokemon();
    updateSearchUI();
}

function renderAllPokemon() {
    const container = document.getElementById("pokemonContainer");
    container.innerHTML = allPokemon.map(p => renderPokemonCardTemplate(buildCardData(p))).join("");
}

function filterPokemon(searchTerm) {
    currentSearchTerm = searchTerm;
    filteredPokemon = allPokemon.filter(p => p.name.includes(currentSearchTerm));
    renderFilteredPokemon();
    updateSearchUI();
}

function updateSearchUI() {
    const noResults = document.getElementById("noResults");
    const loadBtn = document.getElementById("loadMoreBtn");
    noResults.classList.toggle("active", filteredPokemon.length === 0 && currentSearchTerm);
    loadBtn.style.display = currentSearchTerm ? "none" : "block";
}
//#endregion

//#region Modal - Open and Close
function openPokemonDetail(pokemonId) {
    const list = currentSearchTerm ? filteredPokemon : allPokemon;
    currentPokemonIndex = list.findIndex(p => p.id === pokemonId);
    renderPokemonDetail();
    document.getElementById("pokemonModal").classList.add("active");
    lockBodyScroll();
}

function closeModal() {
    document.getElementById("pokemonModal").classList.remove("active");
    unlockBodyScroll();
}

function lockBodyScroll() {
    savedScrollY = window.scrollY;
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add("modal-open");
}

function unlockBodyScroll() {
    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    window.scrollTo(0, savedScrollY);
}

function closeModalOnBackdrop(event) {
    if (event.target.id === "pokemonModal") closeModal();
}

function switchTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("active", p.id === `tab-${tabName}`));
}
//#endregion

//#region Modal - Detail View
async function renderPokemonDetail() {
    const list = currentSearchTerm ? filteredPokemon : allPokemon;
    const pokemon = list[currentPokemonIndex];
    document.getElementById("modalBody").innerHTML = renderPokemonDetailTemplate(buildDetailData(pokemon));
    updateNavigationButtons();
    await loadEvolutionChain(pokemon.id);
}
//#endregion

//#region Modal - Navigation
function showPreviousPokemon() {
    if (currentPokemonIndex > 0) {
        currentPokemonIndex--;
        renderPokemonDetail();
    }
}

function showNextPokemon() {
    const list = currentSearchTerm ? filteredPokemon : allPokemon;
    if (currentPokemonIndex < list.length - 1) {
        currentPokemonIndex++;
        renderPokemonDetail();
    }
}

function updateNavigationButtons() {
    const list = currentSearchTerm ? filteredPokemon : allPokemon;
    document.getElementById("prevBtn").disabled = currentPokemonIndex === 0;
    document.getElementById("nextBtn").disabled = currentPokemonIndex === list.length - 1;
}
//#endregion

//#region Evolution Chain - Processing
function renderEvolutionChain(chain, pokemonId) {
    const evolutions = findEvolutionPath(chain, pokemonId) || extractDefaultPath(chain);
    const container = document.getElementById("tab-evolution");
    if (evolutions.length <= 1) {
        container.innerHTML = '<p class="tab-placeholder">No evolution chain</p>';
        return;
    }
    container.innerHTML = renderEvolutionTemplate(buildEvolutionStagesHtml(evolutions));
}

function findEvolutionPath(chain, targetId) {
    const id = extractIdFromUrl(chain.species.url);
    const current = { name: chain.species.name, id };
    if (String(id) === String(targetId)) {
        return [current, ...getLinearContinuation(chain)];
    }
    for (const branch of chain.evolves_to) {
        const path = findEvolutionPath(branch, targetId);
        if (path) return [current, ...path];
    }
    return null;
}

function getLinearContinuation(chain) {
    const result = [];
    let current = chain;
    while (current.evolves_to.length === 1) {
        current = current.evolves_to[0];
        result.push({ name: current.species.name, id: extractIdFromUrl(current.species.url) });
    }
    if (current.evolves_to.length > 1) {
        for (const branch of current.evolves_to) {
            result.push({ name: branch.species.name, id: extractIdFromUrl(branch.species.url), isBranch: true });
        }
    }
    return result;
}

function extractDefaultPath(chain) {
    const result = [];
    let current = chain;
    while (current) {
        result.push({ name: current.species.name, id: extractIdFromUrl(current.species.url) });
        current = current.evolves_to[0] || null;
    }
    return result;
}

function extractIdFromUrl(url) {
    const parts = url.split("/").filter(p => p);
    return parts[parts.length - 1];
}
//#endregion
