/**
 * Spillets økonomi: startbeløb, priser, belønninger og visning af spillerens penge.
 * Indlæses efter player.js, så visningen kan placeres i healthText.
 */
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

/** Viser den aktuelle saldo på siden. */
function updateMoneyDisplay() {
	moneyDisplay.textContent = `Penge: ${playerMoney} kr.`;
}

/** Returnerer om spilleren har råd til et nyt tårn. */
function canAffordTower() {
	return playerMoney >= TOWER_COST;
}

/**
 * Trækker et beløb fra saldoen, hvis det er til rådighed.
 * @param {number} amount Beløbet, der skal betales.
 * @returns {boolean} False, hvis saldoen er for lav; ellers true.
 */
function spendMoney(amount) {
	if (playerMoney < amount) {
		return false;
	}

	playerMoney -= amount;
	updateMoneyDisplay();
	return true;
}

/** Lægger en belønning eller et salgsbeløb til saldoen. */
function addMoney(amount) {
	playerMoney += amount;
	updateMoneyDisplay();
}

updateMoneyDisplay();
