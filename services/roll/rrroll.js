
const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

module.exports = (bot, msg, params) => {
  const n = Number(params[1]);
  const dice_string = params[2];
  let ca = params[3];

  if (!n || !dice_string) {
    return bot.sendMessage(msg.chat.id, 'Parametro inválido, use: /rrr <n> <dado> <cd>');
  }

  const final = [];
  ca = Number(ca);
  ca = Number.isNaN(ca) ? 0 : ca;

  let success = 0;
  for (let i = 1; i <= n; i++) {
    const res = roller.roll(dice_string);
    final.push(`${dice_string} (<code>${res.rolls.join(', ')}</code>) = ${res.total}`);

    if (ca <= Number(res.total)) success += 1;
  }

  const dice_rolls = final.join('\n');
  const quote = `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a>`;

  bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => null);
  bot.sendMessage(
    msg.chat.id,
    `${quote} Rolando ${n} interações para CD ${ca}:\n${dice_rolls}\n${success} Sucessos.`,
    { parse_mode: 'HTML', disable_notification: true },
  );
};
