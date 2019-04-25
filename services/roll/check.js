
const data_info = require('../beyond/lib/info.json');
const roll = require('./roll');
const getCharacter = require('../beyond/getCharacter');
const changeDice = require('../lib/changeDice');

module.exports = async (bot, msg, params) => {
  let skill = params[1].toLowerCase();
  let type = params[2] ? params[2].toLowerCase() : params[2];

  skill = Object.keys(data_info.translate_map).find(x => [x.toLowerCase(), data_info.translate_map[x].toLowerCase()].includes(skill));
  if (!skill) {
    return bot.sendMessage(msg.chat.id, `A perícia/atributo ${params[1]} não existe no nosso sistema.`);
  }

  if (type && !['van', 'des'].includes(type)) type = null;

  const data = await getCharacter(bot, msg, msg.from.id);
  if (!data) return;

  const v = data.skills[skill];
  const translate = data_info.translate_map[skill] || skill;

  const diceroll = [null, `1d20${v >= 0 ?  `+${v}` : v}`, params[1] || translate.toUpperCase()];

  if (data.mods.advantage.includes(skill)) {
    diceroll[1] = changeDice(diceroll[1], +1);
  } else if (data.mods.disadvantage.includes(skill)) {
    diceroll[1] = changeDice(diceroll[1], -1);
  }

  if (type) diceroll.push(translate.toUpperCase());

  roll(bot, msg, diceroll, data);
};
