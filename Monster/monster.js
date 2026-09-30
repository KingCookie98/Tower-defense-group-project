let gameSpeed = 1;

document.querySelectorAll("#game-speed button").forEach(button => {
  button.addEventListener("click", () => {
    gameSpeed = Number(button.dataset.speed);
    document.querySelectorAll("#game-speed button").forEach(speedButton => {
      speedButton.setAttribute("aria-pressed", String(speedButton === button));
    });
  });
});

class Monster {
  constructor(x = 300, y = 240, path = []) {
    this.x = x;
    this.y = y;
    this.path = path;
    this.pathIndex = 1;
    this.speed = 75;
    this.radius = 25;
    this.isBoss = false;
    this.monsterColor = color(120, 210, 120);
    this.monsterHitColor = color(50, 90, 50);
    this.hitFlashFrames = 0;
    this.reachedEnd = false;
    this.maxHealth = 5;
    this.health = 5;
    this.rewarded = false;
  }

  takeDamage(amount) {
    if (this.health <= 0) {
      return;
    }

    this.health = max(0, this.health - amount);
  this.hitFlashFrames = 8;

    if (this.health === 0 && !this.rewarded) {
      this.rewarded = true;
      addMoney(MONSTER_REWARD);
    }
  }

  draw() {
    if (this.health <= 0) {
      return;
    }

    this.move(deltaTime / 1000 * gameSpeed);
    this.hitFlashFrames = max(0, this.hitFlashFrames - gameSpeed);
    this.drawMonster();
  }

  move(deltaSeconds) {
    let distanceToMove = this.speed * deltaSeconds;

    while (distanceToMove > 0 && this.pathIndex < this.path.length) {
      const target = this.path[this.pathIndex];
      const deltaX = target.x - this.x;
      const deltaY = target.y - this.y;
      const distanceToTarget = Math.hypot(deltaX, deltaY);

      if (distanceToTarget <= distanceToMove) {
        this.x = target.x;
        this.y = target.y;
        distanceToMove -= distanceToTarget;
        this.pathIndex++;
      } else {
        this.x += deltaX / distanceToTarget * distanceToMove;
        this.y += deltaY / distanceToTarget * distanceToMove;
        distanceToMove = 0;
      }
    }

    if (this.path.length > 0 && this.pathIndex >= this.path.length && !this.reachedEnd) {
      this.reachedEnd = true;
      if (typeof checkMonsterCollision === "function") {
        checkMonsterCollision(
          Math.floor(this.y / TILE_SIZE),
          Math.floor(this.x / TILE_SIZE),
          this.isBoss
        );
      }
      this.health = 0;
    }
  }

  drawMonster() {
    if (this.health <= 0) {
      return;
    }

    fill(this.hitFlashFrames > 0 ? this.monsterHitColor : this.monsterColor);
    stroke(0);
    circle(this.x, this.y, this.radius * 2);

    let barWidth = 70;
    let barX = this.x - barWidth / 2;
    let barY = this.y - this.radius - 20;

    fill(80);
    rect(barX, barY, barWidth, 8);

    fill(255, 0, 0);
    rect(barX, barY, barWidth * (this.health / this.maxHealth), 8);
  }
}

let monsters = [];
let waveSpawner;

function setup() {
  const canvas = createCanvas(map[0].length * TILE_SIZE, map.length * TILE_SIZE);
  canvas.parent("game-board");
  waveSpawner = new WaveSpawner();
}

function draw() {
  drawMap();
  waveSpawner.drawStartButton();
  monsters = monsters.filter(currentMonster => currentMonster.health > 0);
  waveSpawner.update(monsters);
  waveSpawner.updateWaveCounter();
  updateTowers(monsters);
  drawTowers();
  for (const currentMonster of monsters) {
    currentMonster.draw();
  }
}

function mousePressed() {
  if (waveSpawner && waveSpawner.startWaveAt(mouseX, mouseY)) {
    return false;
  }
}

class BossMonster extends Monster {
  constructor(x, y, path) {
    super(x, y, path);
    this.isBoss = true;
    this.monsterColor = color(139, 0, 0);
    this.monsterHitColor = color(80, 0, 0);
    this.maxHealth = 15;
    this.health = this.maxHealth;
  }
}