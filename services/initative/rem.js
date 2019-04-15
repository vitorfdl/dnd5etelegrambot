const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  // /init add name creature mod hp CA
  if (!text[2]) return;
  else if (!text[3]) return bot.sendMessage(msg.chat.id, `Erro de sintaxe. Use: /init rem <sessão> <nome>`);

  const my_list = await initLoader.load('test', text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  const c_i = my_list.creatures.findIndex((x) => x.name.toLowerCase() === text[3].toLowerCase());
  if (c_i < 0) return bot.sendMessage(msg.chat.id, `Criatura ${text[3]} não encontrado na sessão ${text[2]}.`);

  my_list.creatures.splice(c_i, 1);

  initLoader.save('test', text[2], my_list).catch(console.log);
  bot.sendMessage(msg.chat.id, `Criatura ${text[3]} removida da sessão ${text[2]}!`);
}