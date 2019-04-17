const TagoDevice = require('tago/device');
const tago = new TagoDevice(process.env.TAGO);

async function save(chat_id, name, param) {
  name = name.toLowerCase();
  await tago.remove({ variable: 'init_session', serie: chat_id, value: name, qty: 100 });
  await tago.insert({ variable: 'init_session', serie: chat_id, value: name, metadata: param });

  return true;
}

async function load(chat_id, name) {
  const [data] = await tago.find({ variable: 'init_session', serie: chat_id, value: name, qty: 1 });
  if (!data) return;

  return data.metadata;
}

async function namelist(chat_id) {
  const data = await tago.find({ variable: 'init_session', serie: chat_id, qty: 200 });
  if (!data.length) return;

  return data.map(x => x.metadata.name);
}

async function newDoc(chat_id, name) {
  const [data] = await tago.find({ variable: 'init_session', serie: chat_id, value: name, qty: 1 });
  if (data) return false;

  await save(chat_id, name, { name, creatures: [], turn: 0 });
  return true;
}

async function remove(chat_id, name) {
  tago.remove({ variable: 'init_session', serie: chat_id, value: name, qty: 100 });
  return true;
}

async function getSession(chat_id) {
  const [cur_session] = await tago.remove({ variable: 'current_session', serie: chat_id, qty: 1 });
  if (!cur_session) throw 'Não foi setado uma sessão.';

  return load(chat_id, cur_session.value);
}
async function changeSession(chat_id, name) {
  await tago.remove({ variable: 'current_session', serie: chat_id, qty: 100 });
  await tago.insert({ variable: 'current_session', serie: chat_id, value: name });

  return true;
}


module.exports = { newDoc, save, load, namelist, remove, getSession, changeSession };
