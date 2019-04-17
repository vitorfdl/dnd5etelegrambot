/* eslint-disable no-case-declarations */
const add     = require('./add');
const rem     = require('./rem');
const list    = require('./list');
const reset   = require('./reset');
const newS    = require('./new');
const roll    = require('./roll');
const destroy = require('./destroy');
const copy    = require('./copy');
const sethp   = require('./sethp');
const setca   = require('./setca');
const setar   = require('./set');
const turn   = require('./turn');

module.exports = (bot, msg) => {
  const text = msg.text.split(' ');
  if (!text[1]) {
    return list(bot, msg, text);
  }

  switch (text[1].toLowerCase()) {
    case 'add':     add(bot, msg, text); break;
    case 'list':    list(bot, msg, text); break;
    case 'rem':     rem(bot, msg, text); break;
    case 'reset':   reset(bot, msg, text); break;
    case 'rolar':   roll(bot, msg, text); break;
    case 'criar':    newS(bot, msg, text); break;
    case 'deletar': destroy(bot, msg, text); break;
    case 'copiar':    copy(bot, msg, text); break;
    case 'hp':      sethp(bot, msg, text); break;
    case 'ca':      setca(bot, msg, text); break;
    case 'setar':   setar(bot, msg, text); break;
    case 'turno':   turn(bot, msg, text); break;
    case 'ajuda':
      const help_text = [
        '*Criação de Sessões*',
        '/init- Lista todas as sessões',
        '/init `criar <sessão>` - Inicia uma sessão com nome <sessão>',
        '/init `deletar <sessão>` - Deleta completamente a sessão.',
        '/init `setar <sessão>` - Seta sessão como ativa na sala.',
        '/init `copiar <sessão> <novasessão>` - Copia sessão para nova.',
        '',
        '*Sessão Ativa*',
        '/init `add` - Adiciona/Atualiza seu personagem do beyond na sessão.',
        '/init `add <nome> <mod>` - Adiciona PJ/criatura.',
        '       `-h <hp>` - Seta HP da criatura',
        '       `-c <ca>` - Seta CA da criatura',
        '       `-d <N>` - Duplica a criatura N vezes',
        '/init `rem <nomes...>` - Remove criatura da sessão.',
        '/init `hp <nome> <+/-hp>` - Aumenta ou reduz HP do alvo.',
        '/init `ca <nome> <CA>` - Altera CA do alvo.',
        '/init `list` - Lista ordem de iniciativa da sessão.',
        '/init `rolar` - Rola novamente os dados de iniciativa.',
        '      `-v <nomes..>` - Citados rolam em vantagem.',
        '      `-d <nomes..>` - Citados rolam em desvantagem.',
        '/init `reset` - Reinicia pontos de HP.',
        '       `-h` - Não reseta HP.',
        '       `-c` - Não reseta CA.',
        '       `-t` - Não reseta Turnos.',
        '/init `turno` - Avança o turno da sessão.',

      ].join('\n');
      bot.sendStructedMessage(msg, help_text);
      break;
    default:
      bot.sendStructedMessage(msg, 'Parametro para /init \`não existe. Use /init \`ajuda');
      break;
  }
};

