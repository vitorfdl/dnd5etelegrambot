const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  const [,, sessao, new_sessao] = text;
  if (!sessao) return bot.sendStructedMessage(msg, 'Parametro invalido, Use: `/init novo <sessão>`');


  const my_list = await initLoader.load(msg.chat.id, sessao);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${sessao} não encontrado.`);

  const exists = await initLoader.load(msg.chat.id, new_sessao);
  if (!exists) {
    if (!await initLoader.newDoc(msg.chat.id, new_sessao)) {
      return bot.sendStructedMessage(msg, `Nome de sessão \`${new_sessao}\` já está em uso.`);
    }
  }

  initLoader.save(msg.chat.id, new_sessao, my_list);

  bot.sendMessage(msg.chat.id, `Sessão ${sessao} copiada para ${new_sessao}.`);
}
;