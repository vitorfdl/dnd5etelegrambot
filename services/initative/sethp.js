const initLoader = require('./lib/index');

module.exports = async (bot, msg, [,,nome,hp]) => {
  // /init add name creature mod hp
  if (!hp || !nome) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init setca <nome> <+/-HP>');
  else if (Number.isNaN(hp)) return bot.sendMessage(msg.chat.id, 'O CA a ser modificado precisa ser um número!');
  hp = Number(hp);

  const my_list = await initLoader.load(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  const monster = my_list.creatures.find(x => x.name.toLowerCase() === nome.toLowerCase());
  if (!monster) return bot.sendMessage(msg.chat.id, `Criatura ${nome} não encontrado na sessão ${my_list.name}.`);

  monster.hp += hp;

  initLoader.save(msg.chat.id, my_list.name, my_list);
  bot.sendMessage(msg.chat.id, `HP de ${nome} agora é **${monster.hp}** (${hp >= 0 ? `+${hp}` : hp}).`);
};

