const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  if (!text[2] || !text[3]) return bot.sendMessage(msg.chat.id, `Parametro invalido, use: /init copy <sessão> <novasessão>`);


  await initLoader.newDoc('test', text[2]);
  bot.sendMessage(msg.chat.id, `Sessão de Iniciativa criado: ${text[2]}`);
}
