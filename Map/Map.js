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

const game = document.getElementById("game");

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        const tile = document.createElement("div");

        tile.style.width = "50px";
        tile.style.height = "50px";

        if (map[y][x] === 0) {
            tile.style.backgroundColor = "#099309";
        } else if (map[y][x] === 1) {
            tile.style.backgroundColor = "#6a3006";
        } else if (map[y][x] === 2) {
            tile.style.backgroundColor = "#05fa0549";
        } else if (map[y][x] === 3) {
            tile.style.backgroundColor = "#ff00003e";
        }

        game.appendChild(tile);
    }
}

