const yargs = require('yargs');
const initLoader = require('./lib/index');

module.exports = async (bot, msg, text) => {
  const my_list = await initLoader.getSession(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  if (!my_list.creatures[0]) {
    return bot.sendMessage(msg.chat.id, `Ordem de Iniciativa [${my_list.name}]:\n<Vazio>`);
  }

  const params = yargs.parse(text.join(' '));

  my_list.creatures = my_list.creatures.map((x) => {
    const changes = {};
    if (!params.h) changes.hp = x.max_hp;
    if (!params.c) changes.temp_ca = 0;

    return { ...x, ...changes };
  });

  if (!params.t) my_list.round = 0;
  my_list.turn = 0;

  bot.sendMessage(msg.chat.id, `Sessão resetada: [${my_list.name}]`);

  initLoader.save(msg.chat.id, text[2], my_list);
};

