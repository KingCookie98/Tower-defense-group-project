let testTower;
let testEnemies = [];
let testShots = [];

function setup() {
    createCanvas(800, 600);
    testTower = new Tower(200, 300);
}

function draw() {
    background(220);

    const target = testTower.update(testEnemies);
    if (target) {
        testShots.push(new Skud(testTower.x, testTower.y, target));
    }

    testTower.draw();

    for (let i = testEnemies.length - 1; i >= 0; i--) {
        testEnemies[i].update();
        testEnemies[i].draw();

        if (testEnemies[i].x > width + 30 || testEnemies[i].health <= 0) {
            testEnemies.splice(i, 1);
        }
    }

    for (let i = testShots.length - 1; i >= 0; i--) {
        testShots[i].update();
        testShots[i].draw();

        if (testShots[i].finished) {
            testShots.splice(i, 1);
        }
    }
}
