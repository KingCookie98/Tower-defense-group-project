let tower;
let enemies = [];
let bullets = [];
let enemySpawnTimer = 0;

class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 160;
        this.fireRate = 1;
        this.cooldown = 0;
    }

    update() {
        this.cooldown = max(0, this.cooldown - 1 / 60);

        if (this.cooldown <= 0) {
            const target = this.findTarget();
            if (target) {
                this.shoot(target);
                this.cooldown = 1 / this.fireRate;
            }
        }
    }

    findTarget() {
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (const enemy of enemies) {
            const distance = dist(this.x, this.y, enemy.x, enemy.y);
            if (distance <= this.range && distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        return closestEnemy;
    }

    shoot(target) {
        bullets.push(new Bullet(this.x, this.y, target));
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

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 12;
        this.speed = 1.2;
        this.health = 1;
    }

    update() {
        this.x += this.speed;
    }

    draw() {
        fill(220, 60, 60);
        stroke(0);
        circle(this.x, this.y, this.radius * 2);
    }
}

class Bullet {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 4;
        this.radius = 5;
    }

    update() {
        if (!this.target) {
            return;
        }

        const angle = atan2(this.target.y - this.y, this.target.x - this.x);
        this.x += cos(angle) * this.speed;
        this.y += sin(angle) * this.speed;

        if (dist(this.x, this.y, this.target.x, this.target.y) < this.radius + this.target.radius) {
            this.target.health -= 1;
            this.remove = true;
        }
    }

    draw() {
        fill(255, 215, 0);
        noStroke();
        circle(this.x, this.y, this.radius * 2);
    }
}

function setup() {
    createCanvas(800, 600);
    tower = new Tower(200, 300);
}

function draw() {
    background(220);

    enemySpawnTimer += 1;
    if (enemySpawnTimer > 60) {
        enemies.push(new Enemy(-20, random(80, 520)));
        enemySpawnTimer = 0;
    }

    tower.update();
    tower.draw();

    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].draw();

        if (enemies[i].x > width + 50) {
            enemies.splice(i, 1);
        }
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        bullets[i].draw();

        if (bullets[i].remove || bullets[i].x < 0 || bullets[i].x > width || bullets[i].y < 0 || bullets[i].y > height) {
            bullets.splice(i, 1);
        }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].health <= 0) {
            enemies.splice(i, 1);
        }
    }
}
