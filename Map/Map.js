/**
 * Definerer spilbanen og dens tegning. Kortværdier fortolkes gennem TILE,
 * og alle felter tegnes som TILE_SIZE-store rektangler.
 */
const map = [
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [2,1,1,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,0,0,0,0],
    [0,0,1,0,0,1,1,1,1,0],
    [0,0,1,1,1,1,0,0,1,3]
];

const TILE = {
    GRASS: 0,
    PATH: 1,
    START: 2,
    END: 3,
};

/** Pixelstørrelsen på ét kvadratisk felt i spillets canvas. */
const TILE_SIZE = 65;
const TILE_COLORS = {
    [TILE.GRASS]: "#099309",
    [TILE.PATH]: "#6a3006",
    [TILE.START]: "#05fa05",
    [TILE.END]: "#ff0000",
};

/** Tegner alle kortfelter med farven for deres tile-type. */
function drawMap() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            fill(TILE_COLORS[map[y][x]]);
            stroke(0, 70);
            rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

const game = document.getElementById("game");

if (game) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            const tile = document.createElement("div");

            tile.style.width = `${TILE_SIZE}px`;
            tile.style.height = `${TILE_SIZE}px`;
            tile.style.backgroundColor = TILE_COLORS[map[y][x]];

            game.appendChild(tile);
        }
    }
}

