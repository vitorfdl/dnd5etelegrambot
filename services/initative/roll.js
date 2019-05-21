const initLoader = require('./lib/index');
const changeDice = require('../lib/changeDice');
const yargs = require('yargs');
const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

function fixObject(item) {
  if (!Array.isArray(item)) item = [item];
  return item.filter(x => x).map(x => x.toLowerCase());
}

module.exports = async (bot, msg, text) => {
  const params = yargs.parse(text);
  params.v = fixObject(params.v);
  params.d = fixObject(params.d);

  const my_list = await initLoader.getSession(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  if (!my_list.creatures[0]) {
    return bot.sendMessage(msg.chat.id, `Ordem de Iniciativa [${my_list.name}]:\n<Vazio>`);
  }

  my_list.creatures = my_list.creatures.map((x) => {
    let plus = 0 + x.plus;
    if (params.v.includes(x.name.toLowerCase())) {
      plus = 1;
    } else if (params.d.includes(x.name.toLowerCase())) {
      plus = -1;
    }
    const roll = roller.roll(changeDice(`1d20${x.mod >= 0 ? `+${x.mod}` : x.mod}`, plus));
    return { ...x, order: Number(roll.total), roll: roll.output };
  }).sort((a, b) => a.order < b.order);

  initLoader.save(msg.chat.id, my_list.name, my_list);

  const to_channel = my_list.creatures.map(x => `${x.roll}: *${x.name}* <${x.hp}/${x.max_hp} HP> (AC ${x.ca})`);
  return bot.sendStructedMessage(msg, [
    `\`${my_list.name} - Rodada: ${my_list.round || 0}\``,
    '=============================',
  ].concat(to_channel));
};

