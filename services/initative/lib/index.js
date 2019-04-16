const fs = require('fs');
const mkdirp = require('mkdirp');

function _fixPath(path) {
  return path < 0 ? path * -1 : path;
}

async function save(path, name, param) {
  path = _fixPath(path);
  param = JSON.stringify(param);
  fs.writeFile(`./data/${path}/${name}.json`, param, console.log);
  return true;
}

async function load(path, name) {
  path = _fixPath(path);

  console.log('here');
  let rawdata;
  try {
    rawdata = fs.readFileSync(`./data/${path}/${name}.json`);
  } catch (e) {
    return {};
  }

  return JSON.parse(rawdata);
}

async function namelist(path) {
  path = _fixPath(path);
  let files;
  try {
    files = await fs.readdirSync(`./data/${path}/`);
  } catch (e) {
    return;
  }
  return files.map((x, i) => `${i + 1} - ${x}`.replace('.json', '')).join('\n');
}

async function newDoc(path, name) {
  path = _fixPath(path);
  if (!fs.existsSync(`./data/${path}/`)) {
    await mkdirp.sync(`./data/${path}/`);
  }

  await save(path, name, { name, creatures: [] });
  return true;
}

async function remove(path, name) {
  path = _fixPath(path);
  if (!fs.existsSync(`./data/${path}/${name}.json`)) {
    return null;
  }

  fs.unlink(`./data/${path}/${name}.json`, console.log);
  return true;
}

module.exports = { newDoc, save, load, namelist, remove };
