const initLoader = require('./lib/index');

module.exports = async (bot, msg, [,, name]) => {
  if (!name) return bot.sendStructedMessage(msg, 'Parametro invalido, use: `/init novo <sessão>`');


  if (!await initLoader.newDoc(msg.chat.id, name)) {
    return bot.sendStructedMessage(msg, `Nome de sessão \`${name}\` já está em uso.`);
  }

  bot.sendStructedMessage(msg, `Sessão de Iniciativa criado: ${name}`);
};
