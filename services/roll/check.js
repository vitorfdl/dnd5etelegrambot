
const data_info = require('../beyond/lib/info.json');
const roll = require('./roll');
const getCharacter = require('../beyond/getCharacter');

module.exports = async (bot, msg, params) => {
  let skill = params[1];
  let type = params[2];

  skill = Object.keys(data_info.translate_map).find(x => [x.toLowerCase(), data_info.translate_map[x].toLowerCase()].includes(skill.toLowerCase()));
  if (!skill) {
    return bot.sendMessage(msg.chat.id, `A perícia/atributo ${params[1]} não existe no nosso sistema.`);
  }

  if (type && !['van', 'des'].includes(type.toLowerCase())) type = null;

  const data = await getCharacter(bot, msg, msg.from.id);
  if (!data) return;

  const v = data.skills[skill];
  const translate = data_info.translate_map[skill] || skill;

  const diceroll = [null, `1d20${v >= 0 ?  `+${v}` : v}`, type || translate.toUpperCase()];
  if (type) diceroll.push(translate.toUpperCase());

  roll(bot, msg, diceroll, data);
};
