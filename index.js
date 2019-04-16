process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const initiative = require('./services/initative/index');
const character  = require('./services/beyond/index');
const roll       = require('./services/roll/roll');
const rrroll     = require('./services/roll/rrroll');
const check      = require('./services/roll/check');
const save       = require('./services/roll/save');
const ficha       = require('./services/beyond/ficha');

bot.sendStructedMessage = (msg, text) =>  {
  bot.sendMessage(msg.chat.id,
    Array.isArray(text) ? text.join('\n') : text,
    { parse_mode: 'MARKDOWN', disable_notification: true });
};


bot.onText(/^(\/r)\b/i, (msg) => {
  const text = msg.text.toLowerCase().split(' ');
  if (text[1] === 'ajuda') {
    return bot.sendStructedMessage(msg, [
      '[Comando] - [Descrição]',
      '/r `<dado> adv [Desc]` - _Rolagem de dados com vantagem e descrição._',
      '/r `<dado> dis [Desc]` - _Rolagem de dados com desvantagem e descrição._',
    ]);
  }

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

bot.onText(/^(\/ficha)\b/i, (msg) => {
  ficha(bot, msg);
});

bot.onText(/^(\/ajuda)\b/i, (msg) => {
  bot.sendStructedMessage(msg, [
    '[Comando] - [Descrição]',
    '/r `ajuda` - _Instruções sobre comandos de rolagem._',
    '/rrr `5 <dado> 10` -  _Multiplas rolagens N para DADO contra CD para sucesso._',
    '/check `<pericia/atributo> <adv/dis>` - Faz um teste de perícia.',
    '/save `<atributo>` <adv/dis> - Faz um teste de resistência.',
    '/init `ajuda` -  _Instruções sobre comandos de iniciativa._',
    '/personagem `ajuda` -  _Instruções sobre comandos de personagem._',
  ]);
});
