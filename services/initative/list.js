const initLoader = require('./lib/index');
const emoji = require('node-emoji');

module.exports = async (bot, msg, [, cmd], my_list) => {
  if (!cmd) {
    if (!my_list) my_list = await initLoader.getSession(msg.chat.id);
    if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

    if (!my_list.creatures[0]) {
      return bot.sendStructedMessage(msg, [
        `\`${my_list.name} - Rodada: ${my_list.round || 0}\``,
        '=============================',
        '<Vazio>',
        '',
        'Use `/init ajuda` para ajuda sobre sessões.']);
    }

    const order_list = initLoader.reOrder(my_list.creatures).map((x, i) => {
      let res = `${x.order}: *${x.name}* <\`${x.hp}/${x.max_hp}\` HP> (AC \`${x.ca + Number(x.temp_ca || 0)}\`)`;
      if (my_list.turn === i) res = `${emoji.get('crossed_swords')}${res}`;
      if ((x.hp <= 0 && x.max_hp) || x.death) res = `${emoji.get('skull')}${res.slice(res.indexOf(':') + 1)}`;
      if (x.constrained) res = `${emoji.get('clock1')}${res.slice(res.indexOf(':') + 1)}`;
      return res;
    });

    const header = [
      `\`${my_list.name} - Rodada: ${my_list.round || 0}\``,
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

