const initLoader = require('./lib/index');
const initList = require('./list');

module.exports = async (bot, msg, [,, sessao]) => {
  // /init add name creature mod hp CA
  console.log(sessao);
  if (!sessao) return bot.sendStructedMessage(msg, 'Erro de sintaxe. Use: `/init setar <sessão>');

  const exists = await initLoader.load(msg.chat.id, sessao);
  if (!exists) return bot.sendStructedMessage(msg, 'Sessão não encontrada. Use: `/init setar <sessão>');

  initLoader.changeSession(msg.chat.id, sessao);
  bot.sendStructedMessage(msg, `Sessão ativa agora é ${exists.name}`);
  return initList(bot, msg, [], exists);
};

