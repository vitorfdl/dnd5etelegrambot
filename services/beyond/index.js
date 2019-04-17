/* eslint-disable no-case-declarations */
const storeCharacter   = require('./storeCharacter');
const removeCharacter   = require('./removeCharacter');
// const list  = require('./list');
// const reset = require('./reset');
// const newS   = require('./new');
// const roll  = require('./roll');
// const destroy  = require('./destroy');
// const copy  = require('./copy');
// const sethp  = require('./sethp');

module.exports = (bot, msg) => {
  const text = msg.text.split(' ');

  if (!text[1]) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: `/personagem ajuda`');

  switch (text[1].toLowerCase()) {
    case 'associar': storeCharacter(bot, msg, text[2]); break;
    case 'desassociar':  removeCharacter(bot, msg); break;
    // case 'rem':   rem(bot, msg, text); break;
    // case 'reset': reset(bot, msg, text); break;
    // case 'reroll':  roll(bot, msg, text); break;
    // case 'novo':  newS(bot, msg, text); break;
    // case 'destroy':  destroy(bot, msg, text); break;
    // case 'copy':  copy(bot, msg, text); break;
    // case 'sethp':  sethp(bot, msg, text); break;
    case 'ajuda':
      const help_text = [
        '[Comando] - [Descrição]',
        '/personagem associar <link> - Associa seu usuario a link no beyond',
        '/personagem desassociar - Desassocia seu usuario do beyond',
      ].join('\n');
      bot.sendMessage(msg.chat.id, help_text);
      break;
    default:
      bot.sendMessage(msg.chat.id, 'Parametro para /personagem não existe. Use `/personagem ajuda`');
      break;
  }
};
