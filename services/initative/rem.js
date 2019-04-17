const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  // /init add name creature mod hp CA
  if (!text[2]) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init rem <nomes...>');

  const my_list = await initLoader.getSession(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  const creatures = text.slice(2).map(x => x.toLowerCase());
  const total_old = my_list.creatures.length;

  my_list.creatures = my_list.creatures.filter(x => !creatures.includes(x.name.toLowerCase()));
  if (my_list.creatures.length === total_old) {
    return bot.sendStructedMessage(msg, `Nenhuma criaturas citada foi encontrada na sessão ${my_list.name}.`);
  }

  initLoader.save(msg.chat.id, my_list.name, my_list).catch(console.log);
  bot.sendStructedMessage(msg, `*${total_old - my_list.creatures.length}* criaturas removidas da sessão *${my_list.name}*!`);
};

