const initLoader = require('./lib/index');
const initList = require('./list');
const initRound = require('./round');

module.exports = async (bot, msg, text) => {
  const n = Number(text[2]);

  const my_list = await initLoader.load(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  if (n && my_list.creatures.length <= n) {
    my_list.turn = n - 1;
    const m = my_list.creatures[my_list.turn];
    bot.sendStructedMessage(msg, `Turno setado para ${n}.\`${m.name}\``);

    await initLoader.save(msg.chat.id, my_list.name, my_list);
    return initList(bot, msg, [], my_list);
  }
  
  my_list.turn = (my_list.turn || 0) + 1;
  for (let i = 0; i <= my_list.creatures.length; i += 1) {
    if (my_list.turn > my_list.creatures.length - 1) my_list.turn = 0;

    const m = my_list.creatures[my_list.turn];
    if ((m.hp > 0 || !m.max_hp) && !m.death && !m.constrained) break;

    my_list.turn += 1;

    if (i >= my_list.creatures.length) {
      return initRound(bot, msg, my_list);
    }
  }

  await initLoader.save(msg.chat.id, my_list.name, my_list);
  return initList(bot, msg, [], my_list);
};

