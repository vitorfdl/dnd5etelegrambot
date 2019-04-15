const initLoader = require('./lib/index');

const Roll = require('rpg-dice-roller');
const roller = new Roll.DiceRoller();

module.exports = async (bot, msg, text) => {
  // /init add name creature mod hp CA
  let no_hp = false;
  if (text.find(x => x === '--nohp')) {
    text = text.filter(x => x !== '--nohp');
    no_hp = true;
  }

  if (!text[2]) return bot.sendMessage(msg.chat.id, `Erro de sintaxe. Use: /init add <sessão> <nome> <mod> <hp> <CA> <DuplicarN>`);
  else if (!text[3]) return bot.sendMessage(msg.chat.id, `Erro de sintaxe. Use: /init add <sessão> <nome> <mod> <hp> <CA> <DuplicarN>`);
  else if (!text[4] || isNaN(Number(text[4]))) return bot.sendMessage(msg.chat.id, `O Mod: ${text[4]} não é um número.`);

  if (!text[5]) text[5] = 0;
  if (!text[6]) text[6] = 0;
  text[7] = text[7] ? Number(text[7]) : 1;

  if (text[7] < 1) text[7] = 1;
  console.log(text[7]);

  const my_list = await initLoader.load('test', text[2]);
  if (!my_list) return bot.sendMessage(msg.chat.id, `Sessão de Iniciativa ${text[2]} não encontrado.`);

  for (let i = 1; i <= text[7]; i++) {
    const name = i == 1 ? text[3] : `${text[3]}${i}`;
    const order = roller.roll(`1d20+${Number(text[4])}`);
    my_list.creatures.push({ name, order: order.total, mod: Number(text[4]), hp: Number(text[5]), max_hp: Number(text[5]), ca: Number([text[6]]), no_hp });
    bot.sendMessage(msg.chat.id, `Adicionado ${name} na lista ${text[2]}.`);
  }

  initLoader.save('test', text[2], my_list);
}