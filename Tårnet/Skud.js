/** Et projektil, der følger sit mål og giver skade ved træf. */
class Skud {
	/** Opretter et projektil rettet mod et bestemt monster. */
	constructor(x, y, target) {
		this.x = x;
		this.damage = 1;
		this.y = y;
		this.target = target;
		this.speed = 240;
		this.radius = 5;
		this.finished = false;
	}

	/** Flytter projektilet og afslutter det ved træf eller hvis målet dør. */
	update() {
		if (!this.target || this.target.health <= 0) {
			this.finished = true;
			return;
		}

		const angle = atan2(this.target.y - this.y, this.target.x - this.x);
		const distanceToTarget = dist(this.x, this.y, this.target.x, this.target.y);
		const distanceToMove = min(
			this.speed * deltaTime / 1000 * gameSpeed,
			distanceToTarget
		);
		this.x += cos(angle) * distanceToMove;
		this.y += sin(angle) * distanceToMove;

		if (distanceToTarget <= distanceToMove + this.radius + this.target.radius) {
			if (typeof this.target.takeDamage === "function") {
				this.target.takeDamage(this.damage);
			} else {
				this.target.health -= this.damage;
			}
			this.finished = true;
		}
	}

	/** Tegner projektilet på p5-canvas. */
	draw() {
		fill(255, 215, 0);
		noStroke();
		circle(this.x, this.y, this.radius * 2);
	}
}
