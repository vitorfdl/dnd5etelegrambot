const axios        = require('axios');
const GSheets      = require('../gsheets/getCharacter');
const getStat      = require('./lib/getStat');
const getLevels    = require('./lib/getLevels');
const getEquipment = require('./lib/getEquipment');
const getSkills    = require('./lib/getSkills');
const storage      = require('./lib/storage');

async function getBeyondJSON(character_id) {
  const result = await axios.get(`https://www.dndbeyond.com/character/${character_id}/json`);

  return result.data;
}


async function GetDataSheet(url) {
  const [, character_id] = url.match(/\/characters\/(\d+)/);

  const data_sheet = await getBeyondJSON(character_id).catch((e) => {
    if (e.response.status === 404) {
      throw 'Sem permissão para ver esta ficha. Você tem certeza de que mudou as permissões dela para publico?';
    } else {
      throw `Erro no Beyond: ${e.response.status} | ${e.response.reason}`;
    }
  });

  if (!data_sheet || typeof data_sheet !== 'object') throw 'Não foi possivel ler ficha registrada.';

  let character_sheet = {
    name: data_sheet.name,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      wisdom: 10,
      intelligence: 10,
      charisma: 10,
      strengthMod: 0,
      dexterityMod: 0,
      constitutionMod: 0,
      wisdomMod: 0,
      intelligenceMod: 0,
      charismaMod: 0,
      proficiencyBonus: 0,
    },
    levels: getLevels(data_sheet),
  };

  character_sheet.stats.proficiencyBonus = Math.floor(character_sheet.levels.level / 4 + 1.75);

  character_sheet = getStat(character_sheet, data_sheet);
  character_sheet = getEquipment(character_sheet, data_sheet);
  character_sheet = getSkills(character_sheet, data_sheet);

  return character_sheet;
}

// GetDataSheet('https://www.dndbeyond.com/characters/6855744').then(e => console.log(e.skills));

module.exports = async function _(bot, msg, user_id, link = null) {
  if (!link) {
    link = await storage.load(user_id);

    if (!link) {
      bot.sendMessage(msg.chat.id, 'Não existe uma ficha associada ao seu usuário.\nUse /personagem associar <beyond_link>');
      return;
    }
  }

  let data;
  if (link.match(/\/characters\/(\d+)/)) {
    data = await GetDataSheet(link).catch((e) => {
      bot.sendStructedMessage(msg, e.message);
      return null;
    });
  } else {
    data = await GSheets(link).catch((e) => {
      console.log(e);
      bot.sendStructedMessage(msg, e.message);
      return null;
    });
  }

  return data;
};
