const storage = require('./lib/storage');
const getCharacter = require('./getCharacter');

module.exports = async (bot, msg, link) => {
  if (!link.includes('https://www.dndbeyond.com/')) {
    return bot.sendMessage(msg.chat.id, 'Link inválido. Utilize uma rota do Beyond DnD 5e.');
  }

  const data = await getCharacter(bot, msg, msg.from.id, link);
  if (!data) return;

  storage.save(msg.from.id, link);

  const quote = `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a>`;
  bot.sendMessage(msg.chat.id, `O personagem ${data.name} foi associado a você ${quote}`, { parse_mode: 'HTML', disable_notification: true });
};
