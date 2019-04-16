process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('825396657:AAHoVYR2h2bFxMX8Ei61gO2jm0_LKCWl_GY', { polling: true });

const initiative = require('./services/initative/index');
const character = require('./services/beyond/index');
const roll       = require('./services/roll/roll');
const rrroll     = require('./services/roll/rrroll');
const check     = require('./services/roll/check');
const save     = require('./services/roll/save');

bot.onText(/^(\/r)\b/i, (msg) => {
  console.log(msg);
  const text = msg.text.toLowerCase().split(' ');
  roll(bot, msg, text);
});

bot.onText(/^(\/rrr)\b/i, (msg) => {
  const text = msg.text.toLowerCase().split(' ');
  rrroll(bot, msg, text);
});

bot.onText(/^(\/check)\b/i, async (msg) => {
  const text = msg.text.toLowerCase().split(' ');
  check(bot, msg, text);
});

bot.onText(/^(\/save)\b/i, async (msg) => {
  const text = msg.text.toLowerCase().split(' ');
  save(bot, msg, text);
});


bot.onText(/^(\/init)\b/i, (msg) => {
  initiative(bot, msg);
});


bot.onText(/^(\/personagem)\b/i, (msg) => {
  character(bot, msg);
});


bot.onText(/^(\/ajuda)\b/i, (msg) => {
  const text = [
    '[Comando] - [Descrição]',
    '/r <dado> [Desc] -  _Rolagem de dados com descrição._',
    '/r <dado> adv [Desc] - _Rolagem de dados com vantagem e descrição._',
    '/r <dado> dis [Desc] -  _Rolagem de dados com desvantagem e descrição._',
    '/rrr 5 <dado> 10 -  _Multiplas rolagens N para DADO contra CD para sucesso._',
    '/check <pericia/atributo> <adv/dis> - Faz um teste de perícia.',
    '/save <atributo> <adv/dis> - Faz um teste de resistência.',
    '/init ajuda -  _Instruções sobre comandos de iniciativa._',
    '/personagem ajuda -  _Instruções sobre comandos de personagem._',
  ].join('\n');

  bot.sendMessage(
    msg.chat.id,
    text,
    { parse_mode: 'MARKDOWN', disable_notification: true },
  );
});
