const yargs        = require('yargs');
const initLoader   = require('./lib/index');
const getCharacter = require('../beyond/getCharacter');
const changeDice   = require('../lib/changeDice');

const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

module.exports = async (bot, msg, text = []) => {
  let [,, creature, mod] = text;
  text = text.join(' ');
  const params = yargs.parse(text);

  let hp = Number(params.h) || 0;
  let ca = Number(params.c) || 0;
  let duplicate = Number(params.n) || 1;
  mod = Number(mod);
  let plus = 0;
  if (params.v) plus = +1;
  if (params.d) plus = -1;

  if (!creature) {
    const datasheet = await getCharacter(bot, msg, msg.from.id);
    if (!datasheet) return;

    creature = datasheet.name.split(' ')[0];
    mod = Number(datasheet.skills.initiative);
    hp = datasheet.hp;
    ca = datasheet.armor;
    if (datasheet.mods.advantage.includes('initiative')) {
      plus = +1;
    } else if (datasheet.mods.disadvantage.includes('initiative')) {
      plus = -1;
    }
  }

  if (!creature) return bot.sendStructedMessage(msg, 'Erro de sintaxe. Use: `/init add <nome> <mod>`');
  else if (Number.isNaN(mod)) return bot.sendStructedMessage(msg, 'Mod deve ser um número. Use: `/init add <nome> <mod>`');
  else if (Number.isNaN(hp)) return bot.sendStructedMessage(msg, 'HP deve ser um número. Use: `/init add <nome> <mod>`');
  else if (Number.isNaN(ca)) return bot.sendStructedMessage(msg, 'CA deve ser um número. Use: `/init add <nome> <mod>`');
  else if (Number.isNaN(duplicate)) return bot.sendStructedMessage(msg, 'Duplicação deve ser um número. Use: `/init add <nome> <mod>`');

  if (duplicate < 1) duplicate = 1;

  const my_list = await initLoader.getSession(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  for (let i = 1; i <= duplicate; i++) {
    const name = i === 1 ? creature : `${creature}${i}`;
    const order = roller.roll(changeDice(`1d20${mod >= 0 ? `+${mod}` : mod}`, plus));

    const e_i = my_list.creatures.findIndex(x => x.name === name);
    if (e_i >= 0) {
      my_list.creatures[e_i] = { ...my_list.creatures[e_i], name, mod, max_hp: hp, ca, plus };
      bot.sendStructedMessage(msg, `Atualizado ${name} na lista ${my_list.name}.`);
    } else {
      my_list.creatures.push({ name, order: order.total, mod, hp, max_hp: hp, temp_ca: 0, ca, plus });
      bot.sendStructedMessage(msg, `Adicionado ${name} na lista ${my_list.name}.\nPosição: \`${order.output}\``);
    }
  }

  initLoader.save(msg.chat.id, my_list.name, my_list);
};
