const add   = require('./add');
const rem   = require('./rem');
const list  = require('./list');
const reset = require('./reset');
const newS   = require('./new');
const roll  = require('./roll');
const destroy  = require('./destroy');
const copy  = require('./copy');
const sethp  = require('./sethp');

module.exports = (bot, msg) => {
  const text = msg.text.split(' ');

  if (!text[1]) return;

  switch (text[1].toLowerCase()) {
    case 'add':  add(bot, msg, text); break;
    case 'list':  list(bot, msg, text); break;
    case 'rem':   rem(bot, msg, text); break;
    case 'reset': reset(bot, msg, text); break;
    case 'reroll':  roll(bot, msg, text); break;
    case 'novo':  newS(bot, msg, text); break;
    case 'destroy':  destroy(bot, msg, text); break;
    case 'copy':  copy(bot, msg, text); break;
    case 'sethp':  sethp(bot, msg, text); break;
    case 'ajuda': 
      const help_text = [
        '[Comando] - [Descrição]', 
        '/init novo <sessão> - Inicia uma sessão com nome <sessão>',
        '/init add <sessão> <nome> <mod> - Adiciona criatura na sessão.',
        '/init add <sessão> <nome> <mod> [hp] [CA] [DuplicarN] - Descritivo.',
        '/init sethp <sessão> <nome> <+/-hp> - Aumenta ou reduz HP do alvo.',
        '/init list - Lista todas as sessões',
        '/init list <sessão> - Lista ordem de iniciativa da sessão.',
        '/init rem <sessão> <nome> - Remove criatura da sessão.',
        '/init reroll <sessão> - Rola novamente os dados de iniciativa.',
        '/init reset <sessão> - Reinicia pontos de HP.',
        '/init copy <sessão> <novasessão> - Copia sessão para nova.',
        '/init destroy <sessão> - Deleta completamente a sessão.',
      ].join('\n');
      console.log(help_text);
      bot.sendMessage(msg.chat.id, help_text);
      break;
    default:
      bot.sendMessage(msg.chat.id, 'Parametro para /init não existe. Use /init ajuda');
      break;
  }
}