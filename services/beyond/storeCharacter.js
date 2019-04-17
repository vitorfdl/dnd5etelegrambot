const storage = require('./lib/storage');
const getCharacter = require('./getCharacter');

module.exports = async (bot, msg, link) => {
  if (!link) {
    return bot.sendStructedMessage(msg, 'Sintaxe incorreta. Use `/personagem <link>`.');
  } else if (!link.includes('https://www.dndbeyond.com/')) {
    return bot.sendStructedMessage(msg, 'Link inválido. Utilize uma rota do Beyond DnD 5e.\nUse `/personagem <link>`.');
  }

  const data = await getCharacter(bot, msg, msg.from.id, link);
  if (!data) return;

  storage.save(msg.from.id, link);

  const quote = `[${msg.from.first_name}](tg://user?id=${msg.from.id})`;
  bot.sendStructedMessage(msg, `O personagem ${data.name} foi associado a você ${quote}`);
};
