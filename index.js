process.env.NTBA_FIX_319 = 1;
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const TagoDevice = require('tago/device');
const tago = new TagoDevice(process.env.TAGO);

const initiative = require('./services/initative/index');
const roll       = require('./services/roll/roll');
const rrroll     = require('./services/roll/rrroll');
const check      = require('./services/roll/check');
const save       = require('./services/roll/save');
const ficha      = require('./services/beyond/ficha');
const storeCharacter   = require('./services/beyond/storeCharacter');
const spellLookUp      = require('./services/lookup/spells');

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
      '/r `<dado> van [Desc]` - _Rolagem de dados com vantagem._',
      '/r `<dado> des [Desc]` - _Rolagem de dados com desvantagem._',
      '/r `<dado>-L` - _Remove o menor resultado._ ',
      '/r `<dado>-H` - _Remove o menor maior._ ',
      '/r `<dado>!` - _Explode o dado.._ ',
      '/r `<dado>!` - _Explode o dado.._ ',
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
  const text = msg.text.toLowerCase().split(' ');
  storeCharacter(bot, msg, text[1]);
});

bot.onText(/^(\/ficha)\b/i, (msg) => {
  ficha(bot, msg);
});


bot.onText(/^(\/magia)\b/i, (msg) => {
  spellLookUp(bot, msg);
});

bot.onText(/^(\/ajuda)\b/i, async (msg) => {
  bot.sendStructedMessage(msg, [
    '[Comando] - [Descrição]',
    '/init `ajuda` -  _Instruções sobre comandos de iniciativa._',
    '/r `ajuda` - _Instruções sobre comandos de rolagem._',
    '/rrr `<N> <dado> <CA>` -  _Multiplas rolagens de dados contra CA._',
    '/check `<ajuda> <adv/dis>` - _Faz um teste de perícia_.',
    '/save `<atributo> <adv/dis>` - _Faz um teste de resistência_.',
    '/personagem `<link>` -  _Associa ficha Beyond a você._',
    '/ficha - _Exibe informações sobre sua ficha_.',
    '/magia `<magia>` - _Exibe informações sobre uma magia (ingles)_.',
  ]);

  if (!msg.chat.type === 'Group') {
    const [exist] = await tago.find({ variable: 'channel_id', value: msg.chat.id });
    if (!exist) tago.insert([{ variable: 'channel_id', value: msg.chat.id }, { variable: 'channel_name', value: msg.chat.title }]);
  }
});
