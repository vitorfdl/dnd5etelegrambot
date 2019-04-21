/* eslint-disable no-case-declarations */
const add     = require('./add');
const rem     = require('./rem');
const show    = require('./show');
const reset   = require('./reset');

module.exports = (bot, msg) => {
  const text = msg.text.split(' ');
  if (!text[1]) {
    return list(bot, msg, text);
  }

  switch (text[1].toLowerCase()) {
    case 'add':     add(bot, msg, text); break;
    case 'rem':    rem(bot, msg, text); break;
    case 'ver':     show(bot, msg, text); break;
    case 'reset':     reset(bot, msg, text); break;
    
    case 'ajuda':
      const help_text = [
        '*Contadores Customizados*',
        '/cc - _Lista seus contadores._',
        '/cc `add <nome> <valor>` - _Lista todas as sessões._',
        '       `-m <valor>` - _Seta valor máximo_',
        '       `-i` - Inclui o contador nesta sessão de iniciativa._',
        '       `-a` - _Incrementa o valor por turno._',
        '/cc `rem` - _Remove todos seus contadores._',
        '/cc `rem <nome>` - Remove o contador especificado._',
        '/cc `ver <usuario>` - _Lista contadores do usuario._',
        '/cc `reset` - _Reseta todos seus contadores._',
        '/cc `reset <nome>` - _Reseta o contador especifico seu.._',
        '',
      ];
      bot.sendStructedMessage(msg, help_text);
      break;
    default:
      bot.sendStructedMessage(msg, 'Parametro para /cc \`não existe. Use /cc \`ajuda');
      break;
  }
};

