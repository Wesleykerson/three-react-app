import React, { useEffect, useReducer, useCallback } from "react";
import "./App.css";
import Pokedex from "./components/Pokedex";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Home from "./components/Home";

const initialState = {
  pokemons: [],
  loading: false,
  error: null,
  selected: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, pokemons: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SELECT":
      return { ...state, selected: action.payload };
    default:
      return state;
  }
}


async function fetchPokemonDetailByUrl(urlOrId) {

  const pokeRes = await fetch(
    typeof urlOrId === "string" && urlOrId.startsWith("http")
      ? urlOrId
      : `https://pokeapi.co/api/v2/pokemon/${urlOrId}`
  );
  if (!pokeRes.ok) {
    throw new Error(`Pokémon no encontrado (${pokeRes.status})`);
  }
  const pokeJson = await pokeRes.json();

  
  let description = "";
  try {
    if (pokeJson.species?.url) {
      const spRes = await fetch(pokeJson.species.url);
      if (spRes.ok) {
        const spJson = await spRes.json();
        const entry =
          spJson.flavor_text_entries.find((e) => e.language.name === "es") ||
          spJson.flavor_text_entries.find((e) => e.language.name === "en");
        if (entry) description = entry.flavor_text.replace(/\f|\n|\r/g, " ");
      }
    }
  } catch (e) {
    console.warn("Species request failed:", e);
  }

  return { ...pokeJson, description };
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

 
  useEffect(() => {
    let cancelled = false;
    async function loadInitial() {
      dispatch({ type: "FETCH_START" });
      try {
        const listRes = await fetch("https://pokeapi.co/api/v2/pokemon?limit=12");
        if (!listRes.ok) throw new Error("Error al obtener lista: " + listRes.statusText);
        const listJson = await listRes.json();

        
        const details = await Promise.all(
          listJson.results.map(async (r) => {
            try {
              return await fetchPokemonDetailByUrl(r.url);
            } catch (e) {
              
              console.warn("Fallo detalle:", r.url, e);
              const res = await fetch(r.url);
              return res.ok ? await res.json() : null;
            }
          })
        );

        const filtered = details.filter(Boolean);
        if (!cancelled) {
          dispatch({ type: "FETCH_SUCCESS", payload: filtered });
          if (filtered.length > 0) dispatch({ type: "SELECT", payload: filtered[0] });
        }
      } catch (err) {
        if (!cancelled) dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectPokemon = useCallback((pokemon) => {
    dispatch({ type: "SELECT", payload: pokemon });
  }, []);

  
  const searchPokemon = useCallback(
    async (query) => {
      if (!query) return;
      dispatch({ type: "FETCH_START" });
      try {
        const detail = await fetchPokemonDetailByUrl(query.toString().toLowerCase());
    
        const exists = state.pokemons.find((p) => p.id === detail.id);
        const newList = exists ? state.pokemons : [detail, ...state.pokemons];
        dispatch({ type: "FETCH_SUCCESS", payload: newList });
        dispatch({ type: "SELECT", payload: detail });
      } catch (err) {
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    },
    [state.pokemons]
  );

  return (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/pokedex"
        element={
          <Pokedex
            pokemons={state.pokemons}
            loading={state.loading}
            error={state.error}
            selected={state.selected}
            onSelect={selectPokemon}
            onSearch={searchPokemon}
          />
        }
      />
    </Routes>
  </Router>
);
}
