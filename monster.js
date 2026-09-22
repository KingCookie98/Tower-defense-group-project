let monster = {
  x: 300,
  y: 240,
  radius: 30,
  maxHealth: 5,
  health: 5,
  hitFlash: 0,
  attackCooldown: 0
};

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);

  if (monster.health <= 0) {
    return;
  }

  monster.attackCooldown = max(0, monster.attackCooldown - 1 / 60);
  monster.hitFlash = max(0, monster.hitFlash - 1);

  if (mouseIsPressed) {
    if (dist(mouseX, mouseY, monster.x, monster.y) < monster.radius) {
      if (monster.attackCooldown <= 0) {
        monster.health = max(0, monster.health - 1);
        monster.hitFlash = 8;
        monster.attackCooldown = 0.5;
      }
    }
  }

  drawMonster();
}

function drawMonster() {
  if (monster.health <= 0) {
    return;
  }

  if (monster.hitFlash > 0) {
    fill(50, 90, 50);
  } else {
    fill(120, 210, 120);
  }

  stroke(0);
  circle(monster.x, monster.y, monster.radius * 2);

  let barWidth = 70;
  let barX = monster.x - barWidth / 2;
  let barY = monster.y - monster.radius - 20;

  fill(80);
  rect(barX, barY, barWidth, 8);

  fill(255, 0, 0);
  rect(barX, barY, barWidth * (monster.health / monster.maxHealth), 8);
}