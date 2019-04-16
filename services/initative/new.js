const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  if (!text[2]) return bot.sendMessage(msg.chat.id, 'Parametro invalido, use: /init novo <sessão>');


  await initLoader.newDoc(msg.chat.id, text[2]);
  bot.sendMessage(msg.chat.id, `Sessão de Iniciativa criado: ${text[2]}`);
};
