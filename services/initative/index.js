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
const round   = require('./round');

module.exports = (bot, msg) => {
  const text = msg.text.split(' ');
  if (!text[1]) {
    return list(bot, msg, text);
  }

  switch (text[1].toLowerCase()) {
    case 'adicionar':
    case 'add':     add(bot, msg, text).catch(console.log); break;
    case 'listar':
    case 'list':    list(bot, msg, text); break;
    case 'remover':
    case 'rem':     rem(bot, msg, text); break;
    case 'reset':   reset(bot, msg, text); break;
    case 'roll':
    case 'rolar':   roll(bot, msg, text).catch(console.log); break;
    case 'criar':    newS(bot, msgw, text); break;
    case 'del':
    case 'deletar': destroy(bot, msg, text); break;
    case 'copiar':    copy(bot, msg, text); break;
    case 'hp':      sethp(bot, msg, text); break;
    case 'ca':      setca(bot, msg, text); break;
    case 'setar':
    case 'set':      setar(bot, msg, text); break;
    case 'rodada':
    case 'round':   round(bot, msg); break;
    case 'turn':
    case 'turno':   turn(bot, msg, text); break;
    case 'ajuda':
      const help_text = [
        '*Criação de Sessões*',
        '/init `list` - _Lista todas as sessões._',
        '/init `criar <sessão>` - _Inicia uma sessão com nome <sessão>_',
        '/init `deletar <sessão>` - _Deleta completamente a sessão._',
        '/init `set <sessão>` - _Seta sessão como ativa na sala._',
        '/init `copiar <sessão> <novasessão>` - _Copia sessão para nova._',
        '',
        '*Sessão Ativa*',
        '/init - _Lista ordem de iniciativa da sessão._',
        '/init `add` - _Adiciona/Atualiza seu personagem do beyond na sessão._',
        '/init `add <nome> <mod>` - _Adiciona PJ/criatura._',
        '       `-h <hp>` - _Seta HP da criatura_',
        '       `-c <ca>` - _Seta CA da criatura_',
        '       `-n <N>` - _Duplica a criatura N vezes_',
        '       `-v` - _Vantagem em rolagem_',
        '       `-d` - _Desvantagem em rolagem_',
        '       `-m` - _Criatura é um monstro (cor diferente)_',
        '/init `rem <nomes...>` - _Remove criatura da sessão._',
        '/init `hp <nome> <+/-hp>` - _Aumenta ou reduz HP do alvo._',
        '      `-f` - _Força o hp, sem soma/subtração._',
        '      `-m` - _Seta o alvo como morto._',
        '      `-i` - _Seta o alvo como incapacitado._',
        '/init `ca <nome> <CA>` - _Altera CA do alvo._',
        '/init `rolar` - _Rola novamente os dados de iniciativa._',
        '      `-v <nomes..>` - _Citados rolam em vantagem._',
        '      `-d <nomes..>` - _Citados rolam em desvantagem._',
        '/init `reset` - _Reinicia pontos de HP._',
        '       `-h` - _Não reseta HP._',
        '       `-c` - _Não reseta CA._',
        '       `-t` - _Não reseta Rodadas._',
        '/init `turno` - _Avança o turno da sessão._',
        '/init `rodada` - _Avança o rodada da sessão._',

      ].join('\n');
      bot.sendStructedMessage(msg, help_text);
      break;
    default:
      bot.sendStructedMessage(msg, 'Parametro para /init \`não existe. Use /init \`ajuda');
      break;
  }
};

