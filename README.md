## Integrantes

- Wesley David Saavedra - 100401
- Danna Andrea Rodriguez - 101050
- Santiago Vaca Perez - 97537S
- Juliana Ramirez Barona - 85234

## Descripción corta del proyecto

Esta aplicación es una Pokedex creada con React y Three.js. Permite explorar Pokémones mostrando tarjetas y elementos 3D interactivos. La interfaz combina componentes React tradicionales como listas y tarjetas con una escena 3D para enriquecer la experiencia visual.

Para iniciar el proyecto, -cd three-react-app y luego -npm run dev


## Breve explicacion de cómo conectamos la API

-API utilizada: PokeAPI (https://pokeapi.co/).
-Implementación: la app solicita la lista de Pokémon y sus detalles desde el cliente usando fetch/async-await dentro de efectos de React (useEffect). Por ejemplo, en el componente que lista Pokémon (Pokedex.jsx) se hace una petición al endpoint /api/v2/pokemon?limit=... para obtener las entradas basicas y después se solicitan los detalles necesarios para cada Pokémon.
-Los resultados se guardan en el estado del componente (useState) y se muestran en componentes como PokemonCard.jsx 


## Cómo decidimos representar los elementos (colores / figuras)

-los Pokémones en la lista aparecen en tarjetas que aprovechan un elemento 3D (RotatingBox) para dar sensación de profundidad y movimiento.
- Colores por tipo:
	- Fuego: rojo
	- Agua: azule
	- Planta: verde
	- Eléctrico: amarillos
	- Hielo: celestes
	- Veneno: morados
	- Fantasma/Siniestro: tonos oscuros
	- Normal/Lucha/Acero/etc.: variaciones basadas en la paleta visual para mantener contraste y accesibilidad
	

- Tipografía y contraste: se eligieron colores de texto y fondos con suficiente contraste para mantener legibilidad sobre las tarjetas 3D.
- Interacciones: las tarjetas y objetos 3D responden a click con animaciones suaves para mejorar la sensación táctil.
