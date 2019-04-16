const initLoader = require('./lib/index');

const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

module.exports = async (bot, msg, text) => {
  // /init add name creature mod hp CA
  if (!text[2] || !text[3] || !text[4]) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init setca <sessão> <nome> <ca>');
  else if (Number.isNaN(Number(text[4]))) return bot.sendMessage(msg.chat.id, 'O CA a ser modificado precisa ser um número!');
  text[4] = Number(text[4]);

  const my_list = await initLoader.load(msg.chat.id, text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  const monster = my_list.creatures.find(x => x.name.toLowerCase() === text[3].toLowerCase());
  if (!monster) return bot.sendMessage(msg.chat.id, `Criatura ${text[3]} não encontrado na sessão ${text[2]}.`);

  monster.temp_ca = text[4];

  initLoader.save(msg.chat.id, text[2], my_list);
  bot.sendMessage(msg.chat.id, `CA de ${text[3]} agora é ${monster.ca + monster.temp_ca}`);
};
