/**
 * Selvstændig p5-testsketch til Tower og Skud. Indlæs klasserne sammen med
 * denne fil, og udfyld testEnemies fra browserkonsollen eller en testfixture.
 */
let testTower;
let testEnemies = [];
let testShots = [];

/** Opretter test-canvas og ét tårn. */
function setup() {
    createCanvas(800, 600);
    testTower = new Tower(200, 300);
}

/** Opdaterer og tegner testtårn, fjender og projektiler. */
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
