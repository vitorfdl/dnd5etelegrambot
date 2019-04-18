
const getCharacter = require('../beyond/getCharacter');
const table        = require('table');
const data_info    = require('./lib/info.json');
const storage      = require('./lib/storage');

async function getUserIdReference(msg) {
  let user_id = msg.from.id;
  const [, mention] = msg.text.split(' ');

  if (mention) {
    user_id = await storage.getUser(mention.replace('@', '')) || msg.from.id;
  }
  return user_id;
}

module.exports = async (bot, msg) => {
  const user_id = await getUserIdReference(msg);
  const data = await getCharacter(bot, msg, user_id);
  if (!data) return;

  const attr = ['strength', 'charisma', 'intelligence', 'dexterity', 'constitution', 'wisdom', 'initiative'];
  const skills = Object.keys(data_info.translate_map).filter(x => !x.includes('Save') && !attr.includes(x)).reduce((final, x) => {
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
    ['Stats', '       Salvaguarda'],
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
    },
  });
  // output = output.replace(`Ficha de ${data.name}`, `[Ficha de ${data.name}](${data.avatar})`);
  bot.sendStructedMessage(msg, output);
};
