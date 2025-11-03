import React, { useEffect, useRef, useState } from "react";
import "./PokemonCard.css";
import TypeLogo3D from "./TypeLogo3D";

const CLICK_MAX_MOVE = 8;
const CLICK_MAX_TIME = 450;

export default function PokemonCard({ pokemon }) {
  const [flipped, setFlipped] = useState(false);
  const startRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const onPointerDown = (ev) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ev.clientX ?? ev.touches?.[0]?.clientX;
      const y = ev.clientY ?? ev.touches?.[0]?.clientY;
      if (x == null || y == null) return;

      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        startRef.current = { x, y, t: Date.now() };
      } else {
        startRef.current = null;
      }
    };

    const onPointerUp = (ev) => {
      const start = startRef.current;
      if (!start) return;
      const x = ev.clientX ?? ev.changedTouches?.[0]?.clientX;
      const y = ev.clientY ?? ev.changedTouches?.[0]?.clientY;
      if (x == null || y == null) return;
      const dx = Math.abs(x - start.x);
      const dy = Math.abs(y - start.y);
      const dt = Date.now() - start.t;
      startRef.current = null;

      if (dx <= CLICK_MAX_MOVE && dy <= CLICK_MAX_MOVE && dt <= CLICK_MAX_TIME) {
        setFlipped((v) => !v);
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("touchstart", onPointerDown, { capture: true, passive: true });
    document.addEventListener("touchend", onPointerUp, { capture: true, passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("touchstart", onPointerDown, { capture: true });
      document.removeEventListener("touchend", onPointerUp, { capture: true });
    };
  }, []);

  if (!pokemon) return null;

  return (
    <div
      ref={cardRef}
      className={`pokemon-card ${flipped ? "is-flipped" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
    >
      <div className={`card-inner ${flipped ? "is-flipped" : ""}`}>
        
        <div className="card-front">
          <img
            src={
              pokemon.sprites?.other?.["official-artwork"]?.front_default ||
              pokemon.sprites?.front_default
            }
            alt={pokemon.name}
            className="pokemon-img"
          />
          <h2 className="pokemon-name">{pokemon.name}</h2>
          <p className="pokemon-type">
            {pokemon.types.map((t) => t.type.name).join(" / ")}
          </p>
        </div>

      
        <div className="card-back">
          <div className="three-container">
            <TypeLogo3D types={pokemon.types} />
          </div>
        </div>
      </div>
    </div>
  );
}
