const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  if (!text[2]) return bot.sendMessage(msg.chat.id, `Parametro invalido, use: /init novo <sessão>`);


  const my_list = await initLoader.load('test', text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  const exists = await initLoader.load('test', text[3]);
  if (!exists) {
    await initLoader.newDoc('test', text[3]);
  }

  initLoader.save('test', text[3], my_list);
  
  bot.sendMessage(msg.chat.id, `Sessão ${text[2]} copiada para ${text[3]}`);
}