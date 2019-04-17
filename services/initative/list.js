const initLoader = require('./lib/index');

module.exports = async (bot, msg, [, cmd], my_list) => {
  if (!cmd) {
    if (!my_list) my_list = await initLoader.getSession(msg.chat.id);
    if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

    if (!my_list.creatures[0]) {
      return bot.sendStructedMessage(msg, [
        `\`${my_list.name} - Turno: ${my_list.turn}\``,
        '=============================',
        '<Vazio>',
        '',
        'Use `/init ajuda` para ajuda sobre sessões.']);
    }

    my_list.creatures = my_list.creatures.sort((a, b) => a.order < b.order);
    const order_list = my_list.creatures.map(x => `${x.order}: *${x.name}* <\`${x.hp}/${x.max_hp}\` HP> (AC \`${x.ca + Number(x.temp_ca || 0)}\`)`);
    const header = [
      `\`${my_list.name} - Turno: ${my_list.turn}\``,
      '=============================',
    ];

    return bot.sendStructedMessage(msg, header.concat(order_list));
  }

  const files = await initLoader.namelist(msg.chat.id);
  return bot.sendStructedMessage(msg, [
    'Lista de Sessões:',
    files ? files.join('\n') : '<vazio>',
    '',
    files ? 'Para setar uma sessão use /init setar <sessão>.' : 'Para criar uma sessão use `/init criar <sessão>`',
  ]);
};

