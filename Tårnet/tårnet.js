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

	draw(showRange = true) {
		if (showRange) {
			noFill();
			stroke(100, 180, 255, 170);
			strokeWeight(2);
			circle(this.x, this.y, this.range * 2);
		}

		fill(90, 180, 255);
		stroke(0);
		strokeWeight(1);
		circle(this.x, this.y, 30);
	}
}

const placedTowers = [];
const towerShots = [];
let selectedTower = null;
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
towerInventoryItem.setAttribute("aria-label", `Køb et tårn for ${TOWER_COST} kroner`);
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

const towerDragPreview = document.createElement("div");
towerDragPreview.style.position = "fixed";
towerDragPreview.style.zIndex = "3";
towerDragPreview.style.width = "30px";
towerDragPreview.style.height = "30px";
towerDragPreview.style.border = "2px solid black";
towerDragPreview.style.borderRadius = "50%";
towerDragPreview.style.background = "rgba(90, 180, 255, 0.8)";
towerDragPreview.style.pointerEvents = "none";
towerDragPreview.style.transform = "translate(-50%, -50%)";
towerDragPreview.style.display = "none";

const towerRangePreview = document.createElement("div");
towerRangePreview.style.position = "fixed";
towerRangePreview.style.zIndex = "3";
towerRangePreview.style.border = "2px solid rgba(100, 180, 255, 0.85)";
towerRangePreview.style.borderRadius = "50%";
towerRangePreview.style.pointerEvents = "none";
towerRangePreview.style.transform = "translate(-50%, -50%)";
towerRangePreview.style.display = "none";

const sellTowerButton = document.createElement("button");
sellTowerButton.type = "button";
sellTowerButton.textContent = "Sell";
sellTowerButton.style.position = "fixed";
sellTowerButton.style.top = "138px";
sellTowerButton.style.left = "20px";
sellTowerButton.style.zIndex = "4";
sellTowerButton.style.padding = "8px 12px";
sellTowerButton.style.color = "white";
sellTowerButton.style.background = "#7b2929";
sellTowerButton.style.border = "1px solid #e88787";
sellTowerButton.style.borderRadius = "6px";
sellTowerButton.style.cursor = "pointer";
sellTowerButton.style.font = "14px sans-serif";
sellTowerButton.style.display = "none";

const towerInventoryIcon = document.createElement("span");
towerInventoryIcon.textContent = "●";
towerInventoryIcon.style.color = "#5ab4ff";
towerInventoryIcon.style.fontSize = "22px";
towerInventoryItem.append(towerInventoryIcon, document.createTextNode(`Tårn - ${TOWER_COST} kr.`));
towerInventory.append(towerInventoryLabel, towerInventoryItem);
if (towerPlacementEnabled) {
	document.body.appendChild(towerInventory);
	document.body.appendChild(towerDragPreview);
	document.body.appendChild(towerRangePreview);
	document.body.appendChild(sellTowerButton);
}

function getCanvasPosition(clientX, clientY) {
	const canvas = document.querySelector("canvas");
	if (!canvas || !width || !height) {
		return null;
	}

	const bounds = canvas.getBoundingClientRect();
	return {
		x: (clientX - bounds.left) * width / bounds.width,
		y: (clientY - bounds.top) * height / bounds.height,
	};
}

function getTowerTileAt(clientX, clientY) {
	const position = getCanvasPosition(clientX, clientY);
	if (!position) {
		return null;
	}

	const column = Math.floor(position.x / TILE_SIZE);
	const row = Math.floor(position.y / TILE_SIZE);

	if (position.x < 0 || position.y < 0 || row >= map.length || column >= map[0].length) {
		return null;
	}

	return { row, column };
}

function canPlaceTower(tile) {
	return tile !== null &&
		canAffordTower() &&
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
		updateTowerDragPreview(event, towerPlacementTile);
	});

	window.addEventListener("pointermove", event => {
		if (towerDragActive) {
			towerPlacementTile = getTowerTileAt(event.clientX, event.clientY);
			updateTowerDragPreview(event, towerPlacementTile);
		}
	});

	window.addEventListener("pointerdown", event => {
		if (event.target !== document.querySelector("canvas")) {
			return;
		}

		const position = getCanvasPosition(event.clientX, event.clientY);
		selectedTower = position && placedTowers.find(tower =>
			dist(position.x, position.y, tower.x, tower.y) <= 20
		) || null;
		sellTowerButton.style.display = selectedTower ? "block" : "none";
	});

	sellTowerButton.addEventListener("click", () => {
		if (!selectedTower) {
			return;
		}

		const towerIndex = placedTowers.indexOf(selectedTower);
		if (towerIndex !== -1) {
			placedTowers.splice(towerIndex, 1);
		}
		selectedTower = null;
		sellTowerButton.style.display = "none";
	});

	window.addEventListener("pointerup", event => {
		if (!towerDragActive) {
			return;
		}

		const tile = getTowerTileAt(event.clientX, event.clientY);
		if (canPlaceTower(tile) && spendMoney(TOWER_COST)) {
			placedTowers.push(new Tower(
				tile.column * TILE_SIZE + TILE_SIZE / 2,
				tile.row * TILE_SIZE + TILE_SIZE / 2
			));
		}

		towerDragActive = false;
		towerPlacementTile = null;
		towerDragPreview.style.display = "none";
		towerRangePreview.style.display = "none";
		towerInventoryItem.style.cursor = "grab";
	});

	window.addEventListener("pointercancel", () => {
		towerDragActive = false;
		towerPlacementTile = null;
		towerDragPreview.style.display = "none";
		towerRangePreview.style.display = "none";
		towerInventoryItem.style.cursor = "grab";
	});
}

function updateTowerDragPreview(event, tile) {
	const canvas = document.querySelector("canvas");
	const scale = canvas && width ? canvas.getBoundingClientRect().width / width : 1;
	towerRangePreview.style.width = `${160 * 2 * scale}px`;
	towerRangePreview.style.height = `${160 * 2 * scale}px`;
	towerRangePreview.style.left = `${event.clientX}px`;
	towerRangePreview.style.top = `${event.clientY}px`;

	if (tile) {
		towerDragPreview.style.display = "none";
		towerRangePreview.style.display = "none";
		return;
	}

	towerRangePreview.style.display = "block";
	towerDragPreview.style.left = `${event.clientX}px`;
	towerDragPreview.style.top = `${event.clientY}px`;
	towerDragPreview.style.display = "block";
}

function drawTowers() {
	for (const tower of placedTowers) {
		tower.draw(tower === selectedTower);
	}

	if (towerDragActive && towerPlacementTile) {
		const { row, column } = towerPlacementTile;
		const valid = canPlaceTower(towerPlacementTile);
		const centerX = column * TILE_SIZE + TILE_SIZE / 2;
		const centerY = row * TILE_SIZE + TILE_SIZE / 2;

		noFill();
		stroke(100, 180, 255, 170);
		strokeWeight(2);
		circle(centerX, centerY, 160 * 2);
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
