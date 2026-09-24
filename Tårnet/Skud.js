class Skud {
	constructor(x, y, target) {
		this.x = x;
		this.y = y;
		this.target = target;
		this.speed = 4;
		this.radius = 5;
		this.finished = false;
	}

	update() {
		if (!this.target) {
			this.finished = true;
			return;
		}

		const angle = atan2(this.target.y - this.y, this.target.x - this.x);
		this.x += cos(angle) * this.speed;
		this.y += sin(angle) * this.speed;

		if (dist(this.x, this.y, this.target.x, this.target.y) < this.radius + this.target.radius) {
			this.target.health--;
			this.finished = true;
		}
	}

	draw() {
		fill(255, 215, 0);
		noStroke();
		circle(this.x, this.y, this.radius * 2);
	}
}
