const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  if (!text[2]) {
    const files = await initLoader.namelist(msg.chat.id);
    return bot.sendMessage(msg.chat.id, `Lista de Sessões:\n${files || '<vazio>'}\nPara ver uma sessão use /init list <sessão>.`);
  }

  const my_list = await initLoader.load(msg.chat.id, text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  if (!my_list.creatures[0]) {
    return bot.sendMessage(msg.chat.id, `Ordem de Iniciativa [${text[2]}]:\n<Vazio>`);
  }

  my_list.creatures = my_list.creatures.sort((a, b) => a.order < b.order);
  const to_channel = my_list.creatures.map(x => `${x.order}: *${x.name}* <${x.hp}/${x.max_hp} HP> (AC ${x.ca + Number(x.temp_ca || 0)})`).join('\n');
  return bot.sendMessage(msg.chat.id, `Ordem de Iniciativa:\n${to_channel}`, { parse_mode: 'Markdown', disable_notification: true });
};

