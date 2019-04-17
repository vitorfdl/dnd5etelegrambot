const TagoDevice = require('tago/device');
const tago = new TagoDevice(process.env.TAGO);

async function save(id, url) {
  await tago.remove({ variable: 'user_url', serie: id, qty: 100 });
  await tago.insert({ variable: 'user_url', serie: id, value: url });
  return true;
}

async function load(id) {
  const [url] = await tago.find({ variable: 'user_url', serie: id, qty: 1 });
  if (!url) return false;

  return url ? url.value : null;
}

async function remove(id) {
  await tago.remove({ variable: 'user_url', serie: id, qty: 100 });
  return true;
}

module.exports = { save, load, remove };
