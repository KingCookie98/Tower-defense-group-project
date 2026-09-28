const TOWER_COST = 10;
const TOWER_SELL_REFUND = 7;
const MONSTER_REWARD = 3;
let playerMoney = 10;

const moneyDisplay = document.createElement("div");
moneyDisplay.style.position = "fixed";
moneyDisplay.style.top = "20px";
moneyDisplay.style.right = "20px";
moneyDisplay.style.zIndex = "2";
moneyDisplay.style.padding = "8px 12px";
moneyDisplay.style.color = "white";
moneyDisplay.style.background = "#193247";
moneyDisplay.style.border = "1px solid #77bce8";
moneyDisplay.style.borderRadius = "6px";
moneyDisplay.style.font = "16px sans-serif";
document.body.appendChild(moneyDisplay);

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
