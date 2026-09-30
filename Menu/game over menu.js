let restartButton;
let menuButton;
let gameResult;
let waveCount;

function setup() {
	createCanvas(800, 600);
	textFont('Trebuchet MS');

	restartButton = {
		x: width / 2 - 230,
		y: height / 2 + 120,
		width: 220,
		height: 62
	};
	menuButton = {
		x: width / 2 + 10,
		y: height / 2 + 120,
		width: 220,
		height: 62
	};

	const parameters = new URLSearchParams(window.location.search);
	gameResult = parameters.get('result') === 'win' ? 'VICTORY' : 'GAME OVER';
	waveCount = readWaveCount(parameters.get('waves'));
}

function readWaveCount(value) {
	const count = Number.parseInt(value, 10);
	return Number.isFinite(count) ? Math.max(0, count) : 0;
}

function draw() {
	drawBackground();
	drawGameOverMenu();
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

function drawGameOverMenu() {
	textAlign(CENTER, CENTER);
	noStroke();
	fill('#8ee3a8');
	textSize(18);
	textStyle(BOLD);
	text('TACTICAL DEFENSE', width / 2, height / 2 - 165);

	fill(gameResult === 'VICTORY' ? '#8ee3a8' : '#f4f7f2');
	textSize(58);
	text(gameResult, width / 2, height / 2 - 105);

	fill('#b9c8d2');
	textSize(18);
	textStyle(NORMAL);
	text(gameResult === 'VICTORY' ? 'All waves defeated. The base is safe.' : 'The base has fallen. Try another strategy.', width / 2, height / 2 - 53);

	fill('#f4f7f2');
	textStyle(BOLD);
	textSize(16);
	text('WAVES COMPLETED', width / 2, height / 2 + 7);

	fill('#8ee3a8');
	textSize(36);
	text(waveCount, width / 2, height / 2 + 48);

	drawButton(restartButton, 'PLAY AGAIN', true);
	drawButton(menuButton, 'MAIN MENU', false);
}

function drawButton(button, label, isPrimary) {
	const isHovering = mouseX >= button.x && mouseX <= button.x + button.width
		&& mouseY >= button.y && mouseY <= button.y + button.height;

	if (isPrimary) {
		noStroke();
		fill(isHovering ? '#b1f4c2' : '#8ee3a8');
	} else {
		stroke(isHovering ? '#b1f4c2' : '#527064');
		strokeWeight(2);
		fill(isHovering ? '#1d3344' : '#142536');
	}
	rect(button.x, button.y, button.width, button.height, 8);

	noStroke();
	fill(isPrimary ? '#102019' : '#f4f7f2');
	textAlign(CENTER, CENTER);
	textSize(18);
	textStyle(BOLD);
	text(label, button.x + button.width / 2, button.y + button.height / 2);
}

function mousePressed() {
	if (mouseX >= menuButton.x && mouseX <= menuButton.x + menuButton.width
		&& mouseY >= menuButton.y && mouseY <= menuButton.y + menuButton.height) {
		window.location.href = 'Start menu.html';
		return;
	}

	window.location.href = '../Game.html';
}

function keyPressed() {
	if (key === 'm' || key === 'M') {
		window.location.href = 'Start menu.html';
	} else if (key === ' ' || key === 'Enter') {
		window.location.href = '../Game.html';
	}
}
