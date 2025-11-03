import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a la Pokedex</h1>
      <p className="home-description">
        Haz clic en <strong>"Pokedex"</strong> en el navbar para explorar todos tus Pokémon favoritos.
      </p>
      <div className="home-authors">
        <h2>Trabajo elaborado por:</h2>
        <ul>
          <li>Santiago Vaca Perez</li>
          <li>Juliana Ramirez Barona</li>
          <li>Danna Andrea Rodriguez</li>
          <li>Wesley David Saavedra</li>
        </ul>
      </div>
    </div>
  );
}
