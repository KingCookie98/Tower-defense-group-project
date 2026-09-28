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
			enemy.health > 0 && dist(this.x, this.y, enemy.x, enemy.y) <= this.range
		);
	}

	shoot(target) {
		return new Skud(this.x, this.y, target);
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

const placedTowers = [];
const towerShots = [];
let towerDragActive = false;
let towerPlacementTile = null;
const towerPlacementEnabled = typeof map !== "undefined" && typeof TILE_SIZE !== "undefined";

const towerInventory = document.createElement("div");
towerInventory.style.position = "fixed";
towerInventory.style.top = "78px";
towerInventory.style.left = "20px";
towerInventory.style.zIndex = "2";
towerInventory.style.color = "white";
towerInventory.style.font = "14px sans-serif";
towerInventory.style.userSelect = "none";

const towerInventoryLabel = document.createElement("div");
towerInventoryLabel.textContent = "Tårne";
towerInventoryLabel.style.marginBottom = "6px";

const towerInventoryItem = document.createElement("button");
towerInventoryItem.type = "button";
towerInventoryItem.setAttribute("aria-label", "Træk et tårn til en græs-tile");
towerInventoryItem.style.display = "flex";
towerInventoryItem.style.alignItems = "center";
towerInventoryItem.style.gap = "8px";
towerInventoryItem.style.padding = "8px 12px";
towerInventoryItem.style.color = "white";
towerInventoryItem.style.background = "#193247";
towerInventoryItem.style.border = "1px solid #77bce8";
towerInventoryItem.style.borderRadius = "6px";
towerInventoryItem.style.cursor = "grab";
towerInventoryItem.style.font = "inherit";

const towerInventoryIcon = document.createElement("span");
towerInventoryIcon.textContent = "●";
towerInventoryIcon.style.color = "#5ab4ff";
towerInventoryIcon.style.fontSize = "22px";
towerInventoryItem.append(towerInventoryIcon, document.createTextNode("Tårn"));
towerInventory.append(towerInventoryLabel, towerInventoryItem);
if (towerPlacementEnabled) {
	document.body.appendChild(towerInventory);
}

function getTowerTileAt(clientX, clientY) {
	const canvas = document.querySelector("canvas");
	if (!canvas || !width || !height) {
		return null;
	}

	const bounds = canvas.getBoundingClientRect();
	const canvasX = (clientX - bounds.left) * width / bounds.width;
	const canvasY = (clientY - bounds.top) * height / bounds.height;
	const column = Math.floor(canvasX / TILE_SIZE);
	const row = Math.floor(canvasY / TILE_SIZE);

	if (canvasX < 0 || canvasY < 0 || row >= map.length || column >= map[0].length) {
		return null;
	}

	return { row, column };
}

function canPlaceTower(tile) {
	return tile !== null &&
		map[tile.row][tile.column] === TILE.GRASS &&
		!placedTowers.some(tower =>
			Math.floor(tower.x / TILE_SIZE) === tile.column &&
			Math.floor(tower.y / TILE_SIZE) === tile.row
		);
}

if (towerPlacementEnabled) {
	towerInventoryItem.addEventListener("pointerdown", event => {
		event.preventDefault();
		towerDragActive = true;
		towerInventoryItem.style.cursor = "grabbing";
		towerPlacementTile = getTowerTileAt(event.clientX, event.clientY);
	});

	window.addEventListener("pointermove", event => {
		if (towerDragActive) {
			towerPlacementTile = getTowerTileAt(event.clientX, event.clientY);
		}
	});

	window.addEventListener("pointerup", event => {
		if (!towerDragActive) {
			return;
		}

		const tile = getTowerTileAt(event.clientX, event.clientY);
		if (canPlaceTower(tile)) {
			placedTowers.push(new Tower(
				tile.column * TILE_SIZE + TILE_SIZE / 2,
				tile.row * TILE_SIZE + TILE_SIZE / 2
			));
		}

		towerDragActive = false;
		towerPlacementTile = null;
		towerInventoryItem.style.cursor = "grab";
	});

	window.addEventListener("pointercancel", () => {
		towerDragActive = false;
		towerPlacementTile = null;
		towerInventoryItem.style.cursor = "grab";
	});
}

function drawTowers() {
	for (const tower of placedTowers) {
		tower.draw();
	}

	if (towerDragActive && towerPlacementTile) {
		const { row, column } = towerPlacementTile;
		const valid = canPlaceTower(towerPlacementTile);
		const centerX = column * TILE_SIZE + TILE_SIZE / 2;
		const centerY = row * TILE_SIZE + TILE_SIZE / 2;

		noStroke();
		fill(valid ? color(40, 220, 90, 90) : color(240, 50, 50, 90));
		rect(column * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		fill(90, 180, 255, 180);
		circle(centerX, centerY, 30);
		strokeWeight(1);
	}
}

function updateTowers(enemies) {
	for (const tower of placedTowers) {
		const shot = tower.update(enemies);
		if (shot) {
			towerShots.push(shot);
		}
	}

	for (let i = towerShots.length - 1; i >= 0; i--) {
		const shot = towerShots[i];
		shot.update();
		shot.draw();
		if (shot.finished) {
			towerShots.splice(i, 1);
		}
	}
}
