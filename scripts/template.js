//#region Template - Pokemon Card (Overview)
function renderPokemonCardTemplate(data) {
    return /*html*/ `
        <article class="pokemon-card" style="background: ${data.gradient}" onclick="openPokemonDetail(${data.id})">
            <span class="pokemon-id">#${data.formattedId}</span>
            <img src="${data.imageUrl}" alt="${data.name}" class="pokemon-image" />
            <h2 class="pokemon-name">${data.name}</h2>
            <div class="pokemon-types">${data.typesBadgesHtml}</div>
            <div class="pokemon-stats">
                <span>Height: ${data.height}m</span>
                <span>Weight: ${data.weight}kg</span>
            </div>
        </article>
    `;
}
//#endregion

//#region Template - Detail View (Modal)
function renderPokemonDetailTemplate(data) {
    return /*html*/ `
        <div class="detail-header" style="background: ${data.gradient}">
            <span class="detail-id">#${data.formattedId}</span>
            <h2 class="detail-name">${data.name}</h2>
            <div class="pokemon-types">${data.typesBadgesHtml}</div>
        </div>
        <div class="detail-body">
            <img src="${data.imageUrl}" alt="${data.name}" class="detail-image" />
            <div class="detail-info">
                ${data.basicInfoHtml}
                ${data.abilitiesHtml}
                ${data.statsHtml}
            </div>
        </div>
    `;
}

function renderBasicInfoTemplate(data) {
    return /*html*/ `
        <div class="info-section">
            <h3>Basic Info</h3>
            <div class="info-grid">
                <div class="info-item"><span class="label">Height</span><span class="value">${data.height} m</span></div>
                <div class="info-item"><span class="label">Weight</span><span class="value">${data.weight} kg</span></div>
                <div class="info-item"><span class="label">Base Experience</span><span class="value">${data.baseExperience}</span></div>
            </div>
        </div>
    `;
}

function renderAbilitiesTemplate(abilitiesText) {
    return /*html*/ `
        <div class="info-section">
            <h3>Abilities</h3>
            <p class="abilities-list">${abilitiesText}</p>
        </div>
    `;
}
//#endregion

//#region Template - Base Stats
function renderBaseStatsTemplate(statsRowsHtml) {
    return /*html*/ `
        <div class="info-section">
            <h3>Base Stats</h3>
            <div class="stats-container">
                ${statsRowsHtml}
            </div>
        </div>
    `;
}

function renderStatBarTemplate(data) {
    return /*html*/ `
        <div class="stat-row">
            <span class="stat-name">${data.name}</span>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${data.percentage}%"></div>
            </div>
            <span class="stat-value">${data.value}</span>
        </div>
    `;
}
//#endregion

//#region Template - Evolution Chain
function renderEvolutionTemplate(stagesHtml) {
    return /*html*/ `
        <div class="info-section">
            <h3>Evolution</h3>
            <div class="evolution-chain">
                ${stagesHtml}
            </div>
        </div>
    `;
}

function renderEvolutionStageTemplate(data) {
    return /*html*/ `
        <div class="evo-stage">
            <img src="${data.imgUrl}" alt="${data.name}" class="evo-image" />
            <span class="evo-name">${data.name}</span>
        </div>
        ${data.arrowHtml}
    `;
}
//#endregion

//#region Template - Type Badge
function renderTypeBadgeTemplate(className, displayName) {
    return `<span class="type-badge ${className}">${displayName}</span>`;
}
//#endregion
