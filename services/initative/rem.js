const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  // /init add name creature mod hp CA
  if (!text[2]) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init rem <sessão> <nome>');
  else if (!text[3]) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init rem <sessão> <nome>');

  const my_list = await initLoader.load(msg.chat.id, text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  const creatures = text.slice(3).map(x => x.toLowerCase());
  const total_old = my_list.creatures.length;

  my_list.creatures = my_list.creatures.filter(x => !creatures.includes(x.name.toLowerCase()));
  if (my_list.creatures.length === total_old) {
    return bot.sendMessage(msg.chat.id, `Nenhuma criaturas citada foi encontrada na sessão ${text[2]}.`);
  }

  initLoader.save(msg.chat.id, text[2], my_list).catch(console.log);
  bot.sendMessage(msg.chat.id, `Total de ${total_old - my_list.creatures.length} criaturas removidas da sessão ${text[2]}!`);
};

