class WaveSpawner {
	constructor() {
		const startRow = map.findIndex(row => row.includes(TILE.START));
		const startColumn = map[startRow].indexOf(TILE.START);

		this.spawnX = startColumn * TILE_SIZE + TILE_SIZE / 2;
		this.spawnY = startRow * TILE_SIZE + TILE_SIZE / 2;
		this.waves = [
			{ count: 3, health: 5 },
			{ count: 5, health: 7 },
			{ count: 1, health: 15, boss: true },
		];
		this.waveIndex = 0;
		this.spawnedInWave = 0;
		this.timer = 3;
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
				const monster = new MonsterType(this.spawnX, this.spawnY);
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
