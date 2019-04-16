
const Roll = require('rpg-dice-roller');
const getCharacter = require('../beyond/getCharacter');
const table = require('table');
const data_info = require('./lib/info.json');

module.exports = async (bot, msg) => {
  const data = await getCharacter(bot, msg, msg.from.id);
  if (!data) return;

  const attr = ['strength', 'charisma', 'intelligence', 'dexterity', 'constitution'];
  const skills = Object.keys(data_info.translate_map).filter(x => !x.includes('Save') && !attr.includes(x)).reduce((final, x) => {
    if (!data.skills[x]) return final;

    const name_skill = data_info.translate_map[x].replace(/^\w/, (chr) => {
      return chr.toUpperCase();
    });
    final.push([`\`${name_skill}: ${data.skills[x]}\``, '']);
    return final;
  }, []);


  const output_table = [
    [`Ficha de ${data.name}`, ''],
    [`\`HP: ${data.hp}\``, `\`CA: ${data.armor}\``],
    [`\`Level: ${data.levels.level}\``, ''],
    [`\`Iniciativa: ${data.skills.initiative}\``, ''],
    ['Stats', '         Saves'],
    [`\`For: ${data.stats.strength} (${data.stats.strengthMod})\``, `\`For: ${data.skills.strengthSave}\``],
    [`\`Des: ${data.stats.dexterity} (${data.stats.dexterityMod})\``, `\`Des: ${data.skills.dexteritySave}\``],
    [`\`Con: ${data.stats.constitution} (${data.stats.constitutionMod})\``, `\`Con: ${data.skills.constitutionSave}\``],
    [`\`Int: ${data.stats.intelligence} (${data.stats.intelligenceMod})\``, `\`Int: ${data.skills.intelligenceSave}\``],
    [`\`Car: ${data.stats.charisma} (${data.stats.charismaMod})\``, `\`Car: ${data.skills.charismaSave}\``],
    [`\`Sab: ${data.stats.wisdom} (${data.stats.wisdomMod})\``, `\`Sab: ${data.skills.wisdomSave}\``],
  ].concat(skills);

  const output = table.table(output_table, {
    border: table.getBorderCharacters('void'),
    drawHorizontalLine: () => false,
    columns: {
      0: {
        alignment: 'left',
        minWidth: 120,
      },
      1: {
        alignment: 'left',
        minWidth: 10,
      },
    } });

  bot.sendStructedMessage(msg, output);
};
