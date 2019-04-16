const initLoader = require('./lib/index');

const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

module.exports = async (bot, msg, text) => {
  if (!text[2]) return;

  const my_list = await initLoader.load(msg.chat.id, text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  if (!my_list.creatures[0]) {
    return bot.sendMessage(msg.chat.id, `Ordem de Iniciativa [${text[2]}]:\n<Vazio>`);
  }
  my_list.creatures = my_list.creatures.map((x) => {
    const roll = roller.roll(`1d20+${x.mod}`);
    return { ...x, order: roll.total, roll: roll.output };
  });
  initLoader.save(msg.chat.id, text[2], my_list);

  my_list.creatures = my_list.creatures.sort((a, b) => a.order < b.order);
  const to_channel = my_list.creatures.map(x => `${x.roll}: *${x.name}* <${x.hp}/${x.max_hp} HP> (AC ${x.ca})`).join('\n');
  return bot.sendMessage(msg.chat.id, `Nova Ordem de Iniciativa:\n${to_channel}`, { parse_mode: 'Markdown', disable_notification: true });
};

