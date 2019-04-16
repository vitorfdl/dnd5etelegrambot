const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  if (!text[2]) return;

  const my_list = await initLoader.load(msg.chat.id, text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  if (!my_list.creatures[0]) {
    return bot.sendMessage(msg.chat.id, `Ordem de Iniciativa [${text[2]}]:\n<Vazio>`);
  }
  my_list.creatures = my_list.creatures.map(x => ({ ...x, temp_ca: 0, hp: x.max_hp }));
  bot.sendMessage(msg.chat.id, `HP e CA resetados na sessão [${text[2]}]`);
};

