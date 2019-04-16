const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  const [,,sessao, new_sessao] = text;
  if (!sessao) return bot.sendMessage(msg.chat.id, `Parametro invalido, use: /init novo <sessão>`);


  const my_list = await initLoader.load('test', sessao);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${sessao} não encontrado.`);

  const exists = await initLoader.load('test', new_sessao);
  if (!exists) {
    await initLoader.newDoc('test', new_sessao);
  }

  initLoader.save('test', new_sessao, my_list);
  
  bot.sendMessage(msg.chat.id, `Sessão ${sessao} copiada para ${new_sessao}`);
}