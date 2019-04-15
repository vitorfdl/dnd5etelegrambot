const fs = require('fs');
const mkdirp = require('mkdirp');

async function save(path, name, param) {
  param = JSON.stringify(param);
  fs.writeFile(`./data/${path}/${name}.json`, param, console.log);
  return true;
}

async function load(path, name) {
  let rawdata;
  try {
    rawdata = fs.readFileSync(`./data/${path}/${name}.json`);
  } catch (e) {
    console.log(e);
    return;
  }

  return JSON.parse(rawdata);
}

async function namelist(path) {
  const files = await fs.readdirSync(`./data/${path}/`);

  return files.map((x, i) => `${i+1} - ${x}`.replace('.json', '')).join('\n');
}

async function newDoc(path, name) {
  if (!fs.existsSync(`./data/${path}/`)) {
    await mkdirp.sync(`./data/${path}/`);
  }

  await save(path, name, { name, creatures: []});
  return true;
}

async function remove(path, name) {
  if (!fs.existsSync(`./data/${path}/${name}.json`)) {
    return null;
  }

  fs.unlink(`./data/${path}/${name}.json`, console.log);
  return true;
}

module.exports = { newDoc, save, load, namelist, remove };