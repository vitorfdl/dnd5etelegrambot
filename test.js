
const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

console.log(roller.roll('2d20+1-L').output);