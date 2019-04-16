const initLoader = require('./lib/index');

module.exports = async (msg) => {
  const text = msg.text.split(' ');

  if (!text[2]) return;

  await initLoader.newDoc(msg.chat.id, text[2]);
  msg.sendMessage(msg.chat.id, `Sessão de Iniciativa criado: ${text[2]}`);
}