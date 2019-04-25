
const data_info = require('../beyond/lib/info.json');
const roll = require('./roll');
const getCharacter = require('../beyond/getCharacter');

module.exports = async (bot, msg, params) => {
  let skill = `${params[1]}Save`;
  let type = params[2];

  skill = Object.keys(data_info.translate_map).find(x => [x.toLowerCase(), data_info.translate_map[x].toLowerCase()].includes(skill.toLowerCase()));
  if (!skill) {
    return bot.sendMessage(msg.chat.id, `A perícia/atributo ${params[1]} não existe no nosso sistema.`);
  }

  if (type && !['van', 'des'].includes(type.toLowerCase())) type = null;

  const data = await getCharacter(bot, msg, msg.from.id);
  if (!data) return;

  if (data.mods.advantage.includes(skill)) {
    type = 'van';
  } else if (data.mods.disadvantage.includes(skill)) {
    type = 'des';
  }

  const v = data.skills[skill];
  const translate = data_info.translate_map[skill] || skill;

  const diceroll = [null, `1d20${v >= 0 ?  `+${v}` : v}`, type || `Resist. ${translate.toUpperCase().replace('SAVE', '')}`];
  if (type) diceroll.push(`Resist. ${translate.toUpperCase().replace('SAVE', '')}`);
  roll(bot, msg, diceroll, data);
};
