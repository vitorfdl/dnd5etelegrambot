const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  if (!text[2]) return bot.sendMessage(msg.chat.id, `Parametro invalido, use: /init destroy <sessão>`);

  if (!await initLoader.remove('test', text[2])) {
    return bot.sendMessage(msg.chat.id, `Sessão ${text[2]} não existe!`);
  }
  bot.sendMessage(msg.chat.id, `Sessão ${text[2]} destruida.`);
}