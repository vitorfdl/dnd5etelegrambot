process.env.NTBA_FIX_319 = 1;
const TelegramBot = require(`node-telegram-bot-api`);
const bot = new TelegramBot( '825396657:AAHoVYR2h2bFxMX8Ei61gO2jm0_LKCWl_GY', { polling: true } );

const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

const initiative = require('./services/initative/index');


bot.onText(/^(\/r)\b/i, (msg, match) => {
  const text = msg.text.split(' ');
  // if (!roll.validate(text[1])) {
  //   return bot.sendMessage(msg.chat.id, 'Essa não é uma formula válida para rolagem de dados.', );
  // }

  let extra = '';
  let opt = '';

  if (text[2] == 'adv') {
    text[1] = text[1].replace(/1d/g, '2d');
    text[1] += '-L';

    opt = '\nRolado com Vantagem';
  } else if (text[2] == 'dis') {
    text[1] = text[1].replace(/1d/g, '2d');
    text[1] += '-H';

    opt = '\nRolado com Desvantagem';
  }
  
  if (text[opt ? 3 : 2]) {
    extra = ` <b>(${text.slice(opt ? 3 : 2).join(' ')})</b>`;
  }
  const res = roller.roll(text[1]);
  const dice = `${res.notation}`;
  const quote = `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a>${extra}`;

  bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => null);
  bot.sendMessage(
    msg.chat.id, 
    `${quote}\nResultado: ${dice} (<code>${res.rolls.join(', ')}</code>)\nTotal: <code>${res.total}</code>${opt}`, 
    {parse_mode: 'HTML', disable_notification: true}
  );
});

bot.onText(/^(\/rrr)\b/i, (msg, match) => {
  const text = msg.text.split(' ');
  // if (!roll.validate(text[2])) {
  //   return bot.sendMessage(msg.chat.id, 'Essa não é uma formula válida para rolagem de dados. Tente: /rrr NdVezes Dado CD', );
  // }
  const n = Number(text[1]);
  if (!n || !text[2]) { 
    return bot.sendMessage(msg.chat.id, 'Parametro inválido, use: /rrr <n> <dado> <cd>');
  }

  const final = [];
  text[3] = Number(text[3]);
  text[3] = isNaN(text[3]) ? 0 : text[3];

  let success = 0;
  for (let i = 1; i <= n; i++) {
    const res = roller.roll(text[2]);
    final.push(`${text[2]} (<code>${res.rolls.join(', ')}</code>) = ${res.total}`);

    if (text[3] <= Number(res.total)) success += 1;
  }

  const dice_rolls = final.join('\n');
  const quote = `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a>`;

  bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => null);
  bot.sendMessage(
    msg.chat.id, 
    `${quote} Rolando ${n} interações para CD ${text[3]}:\n${dice_rolls}\n${success} Sucessos.`, 
    {parse_mode: 'HTML', disable_notification: true}
  );
});


bot.onText(/^(\/init)\b/i, (msg, match) => {
  initiative(bot, msg);
});

bot.onText(/^(\/ajuda)\b/i, (msg, match) => {
  const text = [
    '[Comando] - [Descrição]', 
    '/r 1d20 [Desc] - Realiza rolagem de dados com descrição. ',
    '/r 1d20 adv [Desc] - Realiza rolagem de dados com vantagem e descrição. ',
    '/r 1d20 dis [Desc] - Realiza rolagem de dados com desvantagem e descrição. ',
    '/r 1d20 dis [Desc] - Realiza rolagem de dados com desvantagem e descrição. ',
    '/rrr 5 1d20 10 - Realiza multiplas rolagens N para DADO contra CD para sucesso. ',
    '/init ajuda - Instruções sobre comandos de iniciativa. ',
  ].join('\n');
  
  bot.sendMessage(
    msg.chat.id, 
    text, 
    {parse_mode: 'HTML', disable_notification: true}
  );
});