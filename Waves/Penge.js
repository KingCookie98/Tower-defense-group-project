const TOWER_COST = 10;
const TOWER_SELL_REFUND = 7;
const TOWER_UPGRADE_COST = 5;
const MONSTER_REWARD = 3;
let playerMoney = 10;

const moneyDisplay = document.createElement("div");
moneyDisplay.style.font = "16px sans-serif";
moneyDisplay.style.color = "white";
moneyDisplay.style.whiteSpace = "nowrap";
if (typeof healthText !== "undefined") {
	healthText.appendChild(moneyDisplay);
} else {
	document.body.appendChild(moneyDisplay);
}

function updateMoneyDisplay() {
	moneyDisplay.textContent = `Penge: ${playerMoney} kr.`;
}

function canAffordTower() {
	return playerMoney >= TOWER_COST;
}

function spendMoney(amount) {
	if (playerMoney < amount) {
		return false;
	}

	playerMoney -= amount;
	updateMoneyDisplay();
	return true;
}

function addMoney(amount) {
	playerMoney += amount;
	updateMoneyDisplay();
}

updateMoneyDisplay();
