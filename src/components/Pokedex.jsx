import React, { useState, useEffect } from "react";
import "./Pokedex.css";
import TypeLogo3D from "./TypeLogo3D";
import PokemonCard from "./PokemonCard";

const Pokedex = ({ pokemons = [], loading, error, selected, onSelect, onSearch }) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [evolutions, setEvolutions] = useState([]);

  const isSearching = loading;
  const isNotFound = !!error;

  // 🔁 Buscar sugerencias
  useEffect(() => {
    if (input.trim().length < 2) {
      setApiSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
        const data = await res.json();
        const matches = data.results.filter((p) =>
          p.name.toLowerCase().startsWith(input.toLowerCase())
        );
        setApiSuggestions(matches);
      } catch (err) {
        console.error("Error al buscar sugerencias:", err);
      }
    };

    fetchSuggestions();
  }, [input]);

  // 🔁 Cargar cadena evolutiva del Pokémon seleccionado
  useEffect(() => {
    if (!selected?.species?.url) return;

    async function fetchEvolutionChain() {
      try {
        const speciesRes = await fetch(selected.species.url);
        const speciesData = await speciesRes.json();

        if (!speciesData.evolution_chain?.url) {
          setEvolutions([]);
          return;
        }

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        const evoNames = [];
        let current = evoData.chain;
        while (current) {
          evoNames.push(current.species.name);
          current = current.evolves_to[0];
        }

        setEvolutions(evoNames);
      } catch (err) {
        console.error("Error cargando evoluciones:", err);
        setEvolutions([]);
      }
    }

    fetchEvolutionChain();
  }, [selected]);

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      const q = input.trim();
      if (!q) return;
      onSearch(q);
      setShowSuggestions(false);
      setInput("");
    }
  }

  function handleSuggestionClick(name) {
    onSearch(name);
    setInput("");
    setShowSuggestions(false);
  }

  return (
    <div className="container">
      <div className="left-screen">
        <div className="left-screen__top">
          <div className="light-container">
            <div className="light light--blue"></div>
          </div>
          <div className="light light--red"></div>
          <div className="light light--yellow"></div>
          <div className="light light--green"></div>
        </div>

        <div className="left-screen__bottom">
          <div className="main-screen">
            <div className="main-screen__top-lights"></div>

            <div
              id="display"
              className={`main-screen__display ${
                isSearching ? "is-searching" : isNotFound ? "is-not-found" : ""
              }`}
            >
              <div className="display-wrapper">
                {selected && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <PokemonCard pokemon={selected} />
                  </div>
                )}

                {isSearching && (
                  <div className="search-message visible">Searching...</div>
                )}
                {isNotFound && (
                  <div className="not-found-message visible">
                    Pokémon <br /> Not Found
                  </div>
                )}
              </div>
            </div>

            <div className="main-screen__speaker-light"></div>
            <div className="main-screen__speaker">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="left-screen__joint">
          <div className="joint"></div>
          <div className="joint"></div>
          <div className="joint"></div>
          <div className="joint"></div>
          <div className="joint__reflextion"></div>
        </div>
      </div>

      <div className="right-screen">
        <div className="right-screen__top">
          <div></div>
        </div>

        <div className="right-screen__bottom">
          <div className="info-container">
            <div style={{ position: "relative", width: "90%" }}>
              <input
                id="search"
                type="text"
                className="info-input"
                placeholder="Search Pokemon Name or ID"
                value={input}
                onChange={(e) => {
                  const value = e.target.value;
                  setInput(value);
                  setShowSuggestions(value.trim().length > 0);
                }}
                onKeyDown={handleKeyDown}
              />

              {showSuggestions && apiSuggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "110%",
                    left: 0,
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    listStyle: "none",
                    borderRadius: "6px",
                    padding: "0.3rem",
                    maxHeight: "120px",
                    overflowY: "auto",
                    zIndex: 10,
                  }}
                >
                  {apiSuggestions.map((p) => (
                    <li
                      key={p.name}
                      onMouseDown={() => handleSuggestionClick(p.name)}
                      style={{
                        padding: "4px 8px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(255,255,255,0.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      {p.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div id="id" className="info">
              <div className="label">ID:</div>
              <div className="desc">{selected ? `#${selected.id}` : "N/A"}</div>
            </div>

            <section className="info-screen">
              <div id="species" className="info">
                <div className="label">Species:</div>
                <div className="desc">{selected?.species?.name || "N/A"}</div>
              </div>

              <div id="type" className="info">
                <div className="label">Type:</div>
                <div className="desc">
                  {selected
                    ? selected.types.map((t) => t.type.name).join(" / ")
                    : "..."}
                </div>
              </div>

              <div id="height" className="info">
                <div className="label">Height:</div>
                <div className="desc">
                  {selected ? `${selected.height / 10} m` : "..."}
                </div>
              </div>

              <div id="weight" className="info">
                <div className="label">Weight:</div>
                <div className="desc">
                  {selected ? `${selected.weight / 10} kg` : "..."}
                </div>
              </div>

              <div id="evolution" className="info">
                <div className="label">Evolution Chain:</div>
                <div className="desc">
                  {evolutions.length > 0 ? (
                    evolutions.map((name) => (
                      <button
                        key={name}
                        onClick={() => onSearch(name)}
                        className="evo-button"
                      >
                        {name}
                      </button>
                    ))
                  ) : (
                    <span>No evolution data</span>
                  )}
                </div>
              </div>

              <div id="bio" className="info">
                <div className="label">Biology:</div>
                <div className="desc">
                  {selected?.description || "Sin descripción"}
                </div>
              </div>
            </section>

            <div
              style={{ marginTop: "1rem", width: "100%", textAlign: "center" }}
            >
              <div style={{ color: "white", marginBottom: ".4rem" }}>
                Pokémon list
              </div>
              <div
                style={{
                  display: "flex",
                  gap: ".4rem",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {loading && <div style={{ color: "white" }}>Cargando...</div>}
                {error && <div style={{ color: "tomato" }}>{error}</div>}
                {pokemons.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelect(p)}
                    style={{
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: 8,
                      border:
                        selected?.id === p.id
                          ? "2px solid #fff"
                          : "1px solid rgba(255,255,255,0.2)",
                      background:
                        selected?.id === p.id
                          ? "rgba(255,255,255,0.12)"
                          : "transparent",
                      color: "white",
                      textTransform: "capitalize",
                      fontSize: "0.9rem",
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex;
