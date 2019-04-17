const initLoader = require('./lib/index');

module.exports = async (bot, msg, [,,nome,ca]) => {
  // /init add name creature mod hp CA
  if (!ca || !nome) return bot.sendMessage(msg.chat.id, 'Erro de sintaxe. Use: /init setca <nome> <+/-ca>');
  else if (Number.isNaN(ca)) return bot.sendMessage(msg.chat.id, 'O CA a ser modificado precisa ser um número!');
  ca = Number(ca);

  const my_list = await initLoader.load(msg.chat.id);
  if (!my_list) return bot.sendStructedMessage(msg, 'Você deve setar uma sessão como ativa. Use `/init setar <sessao>`.');

  const monster = my_list.creatures.find(x => x.name.toLowerCase() === nome.toLowerCase());
  if (!monster) return bot.sendMessage(msg.chat.id, `Criatura ${nome} não encontrado na sessão ${my_list.name}.`);

  monster.temp_ca += ca;

  initLoader.save(msg.chat.id, my_list.name, my_list);
  bot.sendMessage(msg.chat.id, `CA de ${nome} agora é \`${monster.ca + monster.temp_ca}\`[${monster.ca}]`);
};

