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

	update(monsters) {
		if (this.waveIndex >= this.waves.length) {
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
			this.timer = 3;
		}
	}
}
