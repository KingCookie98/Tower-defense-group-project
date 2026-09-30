/**
 * Styrer wave-start, monster-spawns, ruteopbygning og wave-tælleren.
 * Forudsætter at map, TILE, Monster og BossMonster er indlæst først.
 */
class WaveSpawner {
	/** Finder spawnfeltet og forbereder wave-tilstanden. */
	constructor() {
		const startRow = map.findIndex(row => row.includes(TILE.START));
		const startColumn = map[startRow].indexOf(TILE.START);

		this.spawnX = startColumn * TILE_SIZE + TILE_SIZE / 2;
		this.spawnY = startRow * TILE_SIZE + TILE_SIZE / 2;
		this.path = this.buildPath(startRow, startColumn);
		this.waveIndex = 0;
		this.spawnedInWave = 0;
		this.autoWave = false;
		this.timer = 3;
		this.waitingForStart = true;
		this.buttonWidth = 61;
		this.buttonHeight = 55;
	}

	/**
	 * Bygger en ordnet liste af midtpunkter fra startfeltet til slutstenen.
	 * @param {number} startRow Rækken med startfeltet.
	 * @param {number} startColumn Kolonnen med startfeltet.
	 * @returns {{x: number, y: number}[]} Monsterets rute i canvas-koordinater.
	 * @throws {Error} Hvis kortets sti ikke forbinder start og slut.
	 */
	buildPath(startRow, startColumn) {
		const path = [];
		const visited = new Set();
		let row = startRow;
		let column = startColumn;
		let previousTile = null;

		while (true) {
			path.push({
				x: column * TILE_SIZE + TILE_SIZE / 2,
				y: row * TILE_SIZE + TILE_SIZE / 2,
			});
			visited.add(`${row},${column}`);

			if (map[row][column] === TILE.END) {
				return path;
			}

			const nextTile = [
				{ row: row - 1, column },
				{ row: row + 1, column },
				{ row, column: column - 1 },
				{ row, column: column + 1 },
			].find(tile => {
				const tileKey = `${tile.row},${tile.column}`;
				const isInBounds = tile.row >= 0 && tile.row < map.length &&
					tile.column >= 0 && tile.column < map[tile.row].length;
				const isPath = isInBounds &&
					(map[tile.row][tile.column] === TILE.PATH || map[tile.row][tile.column] === TILE.END);

				return isPath && tileKey !== previousTile && !visited.has(tileKey);
			});

			if (!nextTile) {
				throw new Error("The map path does not connect the start to the end.");
			}

			previousTile = `${row},${column}`;
			row = nextTile.row;
			column = nextTile.column;
		}
	}

	/** Opdaterer HTML-elementet, der viser det aktuelle wave-nummer. */
	updateWaveCounter() {
		document.getElementById("wave-counter").textContent = `WAVE ${this.waveIndex + 1}`;
	}

	/** Tegner den klikbare startflade, når spawneren venter på næste wave. */
	drawStartButton() {
		if (!this.waitingForStart) {
			return;
		}

		push();
		rectMode(CENTER);
		fill(25, 100, 35);
		stroke(255);
		strokeWeight(2);
		rect(this.spawnX, this.spawnY, this.buttonWidth, this.buttonHeight, 6);
		noStroke();
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(9);
		text(this.waveIndex === 0 ? "START WAVE 1" : "NEXT WAVE?", this.spawnX, this.spawnY);
		pop();
	}

	/** Starter en ventende wave, hvis canvas-klikket rammer startfladen. */
	startWaveAt(x, y) {
		if (!this.waitingForStart ||
			Math.abs(x - this.spawnX) > this.buttonWidth / 2 ||
			Math.abs(y - this.spawnY) > this.buttonHeight / 2) {
			return false;
		}

		this.waitingForStart = false;
		this.timer = 0;
		return true;
	}

	/**
	 * Opdaterer spawn-timeren. Hver femte wave består af en boss; øvrige waves
	 * indeholder et stigende antal normale monstre. Næste wave venter på, at
	 * hele monsterlisten er tom, også når listen indeholder en boss.
	 * @param {Monster[]} monsters Aktive monstre, som spawneren kan tilføje til.
	 */
	update(monsters) {
		if (this.waitingForStart) {
			if (!this.autoWave) {
				return;
			}

			this.waitingForStart = false;
			this.timer = 0;
		}

		this.timer -= deltaTime / 1000 * gameSpeed;
		const waveNumber = this.waveIndex + 1;
		const regularMonsterCount = waveNumber + 1;
		const hasBoss = waveNumber % 5 === 0;
		const totalMonsterCount = hasBoss ? 1 : regularMonsterCount;

		if (this.spawnedInWave < totalMonsterCount) {
			if (this.timer <= 0) {
				const isBoss = hasBoss;
				const MonsterType = isBoss ? BossMonster : Monster;
				const monster = new MonsterType(this.spawnX, this.spawnY, this.path);
				const health = isBoss
					? 20 + 3 * waveNumber
					: 4 + 5 * Math.floor((waveNumber - 1) / 5);
				monster.maxHealth = health;
				monster.health = health;
				monsters.push(monster);
				this.spawnedInWave++;
				this.timer = 0.8;
			}
			return;
		}

		if (monsters.length === 0) {
			this.waveIndex++;
			this.spawnedInWave = 0;
			this.waitingForStart = true;
		}
	}
}
