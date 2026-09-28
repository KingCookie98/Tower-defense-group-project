let gameStarted = false;
let playButton;

function setup() {
    createCanvas(800, 600);
    textFont('Trebuchet MS');
    playButton = {
        x: width / 2 - 110,
        y: height / 2 + 55,
        width: 220,
        height: 62
    };
}

function draw() {
    drawBackground();

    if (gameStarted) {
        drawGamePlaceholder();
    } else {
        drawStartMenu();
    }
}

function drawBackground() {
    background('#101827');

    noStroke();
    fill('#17263b');
    circle(width * 0.12, height * 0.2, 260);
    fill('#1d3344');
    circle(width * 0.88, height * 0.78, 360);

    stroke('#243d50');
    strokeWeight(1);
    for (let x = 0; x <= width; x += 40) {
        line(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += 40) {
        line(0, y, width, y);
    }
}

function drawStartMenu() {
    textAlign(CENTER, CENTER);
    noStroke();
    fill('#8ee3a8');
    textSize(18);
    textStyle(BOLD);
    text('TACTICAL DEFENSE', width / 2, height / 2 - 126);

    fill('#f4f7f2');
    textSize(58);
    text('TOWER DEFENSE', width / 2, height / 2 - 65);

    fill('#b9c8d2');
    textSize(18);
    textStyle(NORMAL);
    text('Beskyt basen. Planlaeg dit forsvar. Hold stand.', width / 2, height / 2 - 12);

    const isHovering = mouseX >= playButton.x && mouseX <= playButton.x + playButton.width
        && mouseY >= playButton.y && mouseY <= playButton.y + playButton.height;
    fill(isHovering ? '#b1f4c2' : '#8ee3a8');
    rect(playButton.x, playButton.y, playButton.width, playButton.height, 8);

    fill('#102019');
    textSize(22);
    textStyle(BOLD);
    text('PLAY', width / 2, playButton.y + playButton.height / 2);
}

function drawGamePlaceholder() {
    textAlign(CENTER, CENTER);
    fill('#f4f7f2');
    textSize(34);
    text('Spillet starter her', width / 2, height / 2 - 20);
    fill('#b9c8d2');
    textSize(16);
    text('Tryk R for at vende tilbage til menuen', width / 2, height / 2 + 28);
}

function mousePressed() {
    if (!gameStarted && mouseX >= playButton.x && mouseX <= playButton.x + playButton.width
        && mouseY >= playButton.y && mouseY <= playButton.y + playButton.height) {
        gameStarted = true;
    }
}

function keyPressed() {
    if (key === 'r' || key === 'R') {
        gameStarted = false;
    }
}
