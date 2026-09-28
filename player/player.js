let playerHealth = 100;
const playerMaxHealth = 100;

const healthContainer = document.createElement("div");
const healthBar = document.createElement("div");
const healthText = document.createElement("div");

healthContainer.style.position = "fixed";
healthContainer.style.top = "20px";
healthContainer.style.left = "20px";
healthContainer.style.width = "220px";
healthContainer.style.height = "25px";
healthContainer.style.backgroundColor = "#333";
healthContainer.style.border = "2px solid white";

healthBar.style.height = "100%";
healthBar.style.backgroundColor = "#19d34a";
healthBar.style.transition = "width 0.2s";

healthText.style.color = "white";
healthText.style.font = "16px sans-serif";
healthText.style.marginTop = "5px";

healthContainer.appendChild(healthBar);
healthContainer.appendChild(healthText);
document.body.appendChild(healthContainer);

function updateHealthBar() {
	const healthPercentage = (playerHealth / playerMaxHealth) * 100;
	healthBar.style.width = `${healthPercentage}%`;
	healthText.textContent = `Health: ${playerHealth}/${playerMaxHealth}`;

	if (playerHealth <= 0) {
		healthText.textContent = "Game over";
	}
}

function damagePlayer(amount) {
	playerHealth = Math.max(0, playerHealth - amount);
	updateHealthBar();
}

function checkMonsterCollision(monsterRow, monsterColumn, isBoss = false) {
	const monsterIsOnEndTile = map[monsterRow]?.[monsterColumn] === TILE.END;

	if (monsterIsOnEndTile) {
		if (isBoss) {
			damagePlayer(playerHealth);
			return;
		}

		damagePlayer(10);
	}
}

window.checkMonsterCollision = checkMonsterCollision;
updateHealthBar();
