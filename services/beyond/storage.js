const fs = require('fs');
const mkdirp = require('mkdirp');

async function save(param) {
  if (!fs.existsSync('./data/')) {
    await mkdirp.sync('./data/');
  }

  param = JSON.stringify(param);
  fs.writeFile('./data/players.json', param, console.log);
  return true;
}

async function load() {
  if (!fs.existsSync('./data/')) {
    await mkdirp.sync('./data/');
  }

  if (!fs.existsSync('./data/players.json')) {
    return {};
  }

  let rawdata;
  try {
    rawdata = fs.readFileSync('./data/players.json');
  } catch (e) {
    console.log(e);
    return;
  }

  return JSON.parse(rawdata);
}

module.exports = { save, load };
