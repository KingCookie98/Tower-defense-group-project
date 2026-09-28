class WaveSpawner {
	constructor() {
		const startRow = map.findIndex(row => row.includes(TILE.START));
		const startColumn = map[startRow].indexOf(TILE.START);

		this.spawnX = startColumn * TILE_SIZE + TILE_SIZE / 2;
		this.spawnY = startRow * TILE_SIZE + TILE_SIZE / 2;
		this.path = this.buildPath(startRow, startColumn);
		this.waves = [
			{ count: 3, health: 5 },
			{ count: 5, health: 7 },
			{ count: 1, health: 15, boss: true },
		];
		this.waveIndex = 0;
		this.spawnedInWave = 0;
		this.timer = 3;
		this.waitingForStart = true;
		this.buttonWidth = 61;
		this.buttonHeight = 55;
	}

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

	drawStartButton() {
		if (!this.waitingForStart || this.waveIndex >= this.waves.length) {
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

	startWaveAt(x, y) {
		if (!this.waitingForStart || this.waveIndex >= this.waves.length ||
			Math.abs(x - this.spawnX) > this.buttonWidth / 2 ||
			Math.abs(y - this.spawnY) > this.buttonHeight / 2) {
			return false;
		}

		this.waitingForStart = false;
		this.timer = 0;
		return true;
	}

	update(monsters) {
		if (this.waitingForStart || this.waveIndex >= this.waves.length) {
			return;
		}

		this.timer -= deltaTime / 1000;
		const wave = this.waves[this.waveIndex];

		if (this.spawnedInWave < wave.count) {
			if (this.timer <= 0) {
				const MonsterType = wave.boss ? BossMonster : Monster;
				const monster = new MonsterType(this.spawnX, this.spawnY, this.path);
				monster.maxHealth = wave.health;
				monster.health = wave.health;
				monsters.push(monster);
				this.spawnedInWave++;
				this.timer = 0.8;
			}
			return;
		}

		if (monsters.length === 0) {
			this.waveIndex++;
			this.spawnedInWave = 0;
			this.waitingForStart = this.waveIndex < this.waves.length;
		}
	}
}
