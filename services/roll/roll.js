
const Roll = require('rpg-dice-roller');
const changeDice = require('../lib/changeDice');
const roller = new Roll.DiceRoller();

module.exports = (bot, msg, params, datasheet) => {
  let dice_string = params[1];

  let extra = '';
  let opt = '';

  if (params[2] === 'van') {
    dice_string = changeDice(dice_string, +1);
    opt = '\nRolado com Vantagem';
  } else if (params[2] === 'des') {
    dice_string = changeDice(dice_string, -1);
    opt = '\nRolado com Desvantagem';
  }

  if (params[opt ? 3 : 2]) {
    extra = ` <b>(${params.slice(opt ? 3 : 2).join(' ')})</b>`;
  }
  const res = roller.roll(dice_string);
  if (!res.rolls[0]) {
    return bot.sendMessage(msg.chat.id, 'Dado inválido. Usa a conotação "1d20".');
  }
  
  const dice = `${res.notation}`;
  let quote = `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a>${extra}`;
  if (datasheet) {
    quote = `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a> - ${datasheet.name.split(' ')[0]} realiza um teste ${extra}`;
  }

  bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => null);
  bot.sendMessage(
    msg.chat.id,
    `${quote}\nResultado: ${dice} (<code>${res.rolls.join(', ')}</code>)\nTotal: <code>${res.total}</code>${opt}`,
    { parse_mode: 'HTML', disable_notification: true },
  );
};
