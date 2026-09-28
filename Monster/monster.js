class Monster {
  constructor(x = 300, y = 240) {
    this.x = x;
    this.y = y;
    this.radius = 25;
    this.maxHealth = 5;
    this.health = 5;
    this.hitFlash = 0;
    this.attackCooldown = 0;
  }

  draw() {
    if (this.health <= 0) {
      return;
    }

    this.attackCooldown = max(0, this.attackCooldown - 1 / 60);
    this.hitFlash = max(0, this.hitFlash - 1);

    if (mouseIsPressed) {
      if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
        if (this.attackCooldown <= 0) {
          this.health = max(0, this.health - 1);
          this.hitFlash = 8;
          this.attackCooldown = 0.1;
        }
      }
    }

    this.drawMonster();
  }

  drawMonster() {
    if (this.health <= 0) {
      return;
    }

    if (this.hitFlash > 0) {
      fill(50, 90, 50); // RGB Color for the monster when hit
    } else {
      fill(120, 210, 120); // RGB Color for the monster when its not getting hit
    }

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
  createCanvas(map[0].length * TILE_SIZE, map.length * TILE_SIZE);
  waveSpawner = new WaveSpawner();
}

function draw() {
  drawMap();
  monsters = monsters.filter(currentMonster => currentMonster.health > 0);
  waveSpawner.update(monsters);
  updateTowers(monsters);
  drawTowers();
  for (const currentMonster of monsters) {
    currentMonster.draw();
  }
}

class BossMonster extends Monster {
  constructor(x, y) {
    super(x, y);
    this.maxHealth = 15;
    this.health = this.maxHealth;
  }
}