const initLoader = require('./lib/index');
const getCharacter = require('../beyond/getCharacter');

const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

module.exports = async (bot, msg, text) => {
  // /init add name creature mod hp CA
  let no_hp = false;
  if (text.find(x => x === '--nohp')) {
    text = text.filter(x => x !== '--nohp');
    no_hp = true;
  }

  let [,, sessao, creature, mod, hp, ca, duplicate] = text;
  if (!sessao) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init add <sessão> <nome> <mod> <hp> <CA> <DuplicarN>');

  if (creature && creature === 'pg') {
    const datasheet = await getCharacter(bot, msg, msg.from.id);
    if (!datasheet) return;

    creature = datasheet.name.split(' ')[0];
    mod = Number(datasheet.skills.initiative);
    hp = datasheet.hp;
    ca = datasheet.armor;
  }

  if (!creature) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init add <sessão> <nome> <mod> <hp> <CA> <DuplicarN>');
  else if (Number.isNaN(Number(mod))) return bot.sendMessage(msg.chat.id, `O Mod: ${mod} não é um número.`);

  if (!hp) hp = 0;
  if (!ca) ca = 0;
  duplicate = duplicate ? Number(duplicate) : 1;

  if (duplicate < 1) duplicate = 1;

  const my_list = await initLoader.load(msg.chat.id, sessao);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${sessao} não encontrado.`);

  for (let i = 1; i <= duplicate; i++) {
    const name = i === 1 ? creature : `${creature}${i}`;
    const order = roller.roll(`1d20+${Number(mod)}`);

    const e_i = my_list.creatures.findeIndex(x => x.name === name);
    if (e_i >= 0) {
      my_list.creatures[e_i] = { ...my_list.creatures[e_i], name, mod: Number(mod), max_hp: Number(hp), ca: Number(ca), no_hp };
      bot.sendMessage(msg.chat.id, `Atualizado ${name} na lista ${sessao}.`);
    } else {
      my_list.creatures.push({ name, order: order.total, mod: Number(mod), hp: Number(hp), max_hp: Number(hp), temp_ca: 0, ca: Number(ca), no_hp });
      bot.sendMessage(msg.chat.id, `Adicionado ${name} na lista ${sessao}.\n Posição: ${order.output}`);
    }
  }

  initLoader.save(msg.chat.id, sessao, my_list);
};
