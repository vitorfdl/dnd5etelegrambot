const TagoDevice = require('tago/device');
const tago = new TagoDevice(process.env.TAGO);

async function save(id, url, name) {
  await tago.remove({ variables: ['user_url', 'user_name'], serie: id, qty: 100 });
  await tago.insert([{ variable: 'user_url', serie: id, value: url }, { variable: 'user_name', serie: id, value: name }]);
  return true;
}

async function load(id, usr_name) {
  const [url, name] = await tago.find({ variable: ['user_url', 'user_name'], serie: id, qty: 1 });
  if (!url) return false;

  if (!name || name.value !== usr_name) {
    await tago.remove({ variable: 'user_name', serie: id, qty: 5 });
    await tago.insert({ variable: 'user_name', serie: id, value: usr_name });
  }

  return url ? url.value : null;
}

async function remove(id) {
  await tago.remove({ variables: ['user_url', 'user_name'], serie: id, qty: 100 });
  return true;
}


async function getUser(name) {
  const [user_id] = await tago.find({ variable: 'user_name', value: name, qty: 1 });
  return user_id ? user_id.serie : null;
}


module.exports = { save, load, remove, getUser };
