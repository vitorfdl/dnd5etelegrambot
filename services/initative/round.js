const initLoader = require('./lib/index');
const initList = require('./list');

module.exports = async (bot, msg) => {
  const my_list = await initLoader.load(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  my_list.round = (my_list.round || 0) + 1;
  my_list.turn = 0;

  await initLoader.save(msg.chat.id, my_list.name, my_list);
  return initList(bot, msg, [], my_list);
};

