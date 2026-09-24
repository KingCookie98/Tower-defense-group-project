class Tower {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.range = 160;
		this.cooldown = 0;
	}

	update(enemies) {
		this.cooldown = max(0, this.cooldown - deltaTime / 1000);

		if (this.cooldown <= 0) {
			const target = this.findTarget(enemies);

			if (target) {
				this.cooldown = 1;
				return this.shoot(target);
			}
		}

		return null;
	}

	findTarget(enemies) {
		return enemies.find(enemy =>
			dist(this.x, this.y, enemy.x, enemy.y) <= this.range
		);
	}

	shoot(target) {
		// Skuddet bliver lavet i en anden fil.
		return target;
	}

	draw() {
		fill(90, 180, 255);
		stroke(0);
		circle(this.x, this.y, 30);

		noFill();
		stroke(100, 180, 255, 120);
		circle(this.x, this.y, this.range * 2);
	}
}
