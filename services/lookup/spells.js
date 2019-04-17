const spell_list = require('./data/spells.json');
const stringSimilarity = require('string-similarity');

const schools = {
  A: 'Abjuration',
  V: 'Evocation',
  E: 'Enchantment',
  I: 'Illusion',
  D: 'Divination',
  N: 'Necromancy',
  T: 'Transmutation',
  C: 'Conjuration',
};
module.exports = (bot, msg) => {
  const spell_name = msg.text.split(' ').slice(1).join(' ').toLowerCase();
  const similar = [];
  const spell = spell_list.find((x) => {
    const x_name = x.name.toLowerCase();
    if (stringSimilarity.compareTwoStrings(x_name, spell_name) >= 0.75) similar.push(`   _${x.name}_`);
    return x_name === spell_name;
  });

  if (!spell) {
    let text = [`Não foi possível encontrar a magia ${spell_name}.`];
    if (similar[0]) text = text.concat(['Você quis dizer?']).concat(similar);
    return bot.sendStructedMessage(msg, text);
  }

  const text = [
    `*${spell.name}* _[${spell.source}]_`,
    `\`${schools[spell.school]} (${spell.classes.concat(spell.subclasses).join(', ')})\``,
    '*          Tempo                   Distância               Componentes*',
    `\`   ${spell.casttime}        ${spell.range || ''}         ${spell.components || ''}\``,
    `                          *Duração:* \`${spell.duration}\``,
    '',
    spell.description,
  ];
  return bot.sendStructedMessage(msg, text);
};

