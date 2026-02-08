//#region API Configuration
const API_BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const API_SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species";
const POKEMON_PER_LOAD = 20;
//#endregion

//#region Global Variables - Data Store
let allPokemon = [];
let filteredPokemon = [];
//#endregion

//#region Global Variables - State Management
let currentOffset = 0;
let isLoading = false;
let currentPokemonIndex = 0;
let currentSearchTerm = "";
//#endregion

//#region Constants - Type Colors
const TYPE_COLORS = {
    normal: ["#c8c8a8", "#a8a878"],
    fire: ["#ffb870", "#f08030"],
    water: ["#98c8f8", "#6890f0"],
    electric: ["#ffe850", "#f8d030"],
    grass: ["#a8e0a8", "#78c850"],
    ice: ["#b8e8e8", "#98d8d8"],
    fighting: ["#e05040", "#c03028"],
    poison: ["#c060c0", "#a040a0"],
    ground: ["#f0d888", "#e0c068"],
    flying: ["#c8b8f8", "#a890f0"],
    psychic: ["#ff88a8", "#f85888"],
    bug: ["#c8d038", "#a8b820"],
    rock: ["#d0c058", "#b8a038"],
    ghost: ["#9070b8", "#705898"],
    dragon: ["#9058ff", "#7038f8"],
    dark: ["#907868", "#705848"],
    steel: ["#d0d0e8", "#b8b8d0"],
    fairy: ["#ffb0c0", "#ee99ac"],
};
//#endregion

//#region Constants - Stat Labels
const STAT_NAMES = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
};
//#endregion
