const GoogleSpreadsheet = require('google-spreadsheet');
const promisify         = require('util').promisify;
const auth              = require('../../auth.json');

// POS_RE = re.compile(r"([A-Z]+)(\d+)")
const IGNORED_SPELL_VALUES = ['MAX', 'SLOTS', 'CANTRIPS', '1ST LEVEL', '2ND LEVEL', '3RD LEVEL', '4TH LEVEL', '5TH LEVEL',
  '6TH LEVEL', '7TH LEVEL', '8TH LEVEL', '9TH LEVEL', '\u25c9',
  'You can hide each level of spells individually by hiding the rows (on the left).'];

const SKILL_MAP = [
  ['I25', 'acrobatics', 'F25'], ['I26', 'animalHandling', 'F26'], ['I27', 'arcana', 'F27'],
  ['I28', 'athletics', 'F28'], ['I22', 'charismaSave', 'F22'], ['I19', 'constitutionSave', 'F19'],
  ['I29', 'deception', 'F29'], ['I18', 'dexteritySave', 'F18'], ['I30', 'history', 'F30'],
  ['V12', 'initiative', 'V11'], ['I31', 'insight', 'F31'], ['I20', 'intelligenceSave', 'F20'],
  ['I32', 'intimidation', 'F32'], ['I33', 'investigation', 'F33'], ['I34', 'medicine', 'F34'],
  ['I35', 'nature', 'F35'], ['I36', 'perception', 'F36'], ['I37', 'performance', 'F37'],
  ['I38', 'persuasion', 'F38'], ['I39', 'religion', 'F39'], ['I40', 'sleightOfHand', 'F40'],
  ['I41', 'stealth', 'F41'], ['I17', 'strengthSave', 'F17'], ['I42', 'survival', 'F42'],
  ['I21', 'wisdomSave', 'F21'], ['C13', 'strength', null], ['C18', 'dexterity', null],
  ['C23', 'constitution', null], ['C33', 'wisdom', null], ['C28', 'intelligence', null],
  ['C38', 'charisma', null],
];

function letter2num(letters, zbase = true) {
  letters = letters.toUpperCase().split('');
  let res = 0;
  const weight = letters.length - 1;
  letters.forEach((ch, i) => {
    res += (ch.charCodeAt() - 64) * 26 ** (weight - i);
  });

  if (!zbase) return res;
  return res - 1;
}

function getSkills(character) {
  return SKILL_MAP.reduce((final, [cell, skill, advcell]) => {
    final[skill] =  Number(character.cell(cell).value);
    return final;
  }, {});
}

function getStats(character) {
  const stats = {
    image: '',
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
  };

  ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach((stat, i) => {
    const index = 15 + (i * 5);
    stats[stat] = Number(character.cell(`C${String(index)}`).value);
    stats[`${stat}Mod`] = Number(character.cell(`C${String(index - 2)}`).value);
  });

  return stats;
}

function authenticate(doc) {
  return new Promise((resolve, reject) => {
    doc.useServiceAccountAuth(auth, (err, res) => { return err ? reject(err) : resolve(res); });
  });
}


function docInfo(doc) {
  return new Promise((resolve, reject) => {
    doc.getInfo((err, res) => { return err ? reject(err) : resolve(res); });
  });
}


async function getCharacter(url) {
  const [, sheet_id] = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const doc = new GoogleSpreadsheet(sheet_id);
  await authenticate(doc);
  const info = await docInfo(doc);
  const sheet = info.worksheets[0];
  const cells = await promisify(sheet.getCells)({
    'min-row': 1,
    'max-row': 82,
    'min-col': 1,
    'max-col': 43,
    'return-empty': true,
  });

  const character = {
    sheet: cells,
    cell: function _(pos) {
      const _pos = pos.match(/([A-Z]+)(\d+)/);
      const col = letter2num(_pos[1]) + 1;
      const row = Number(_pos[2]);
      return this.sheet.find(x => x.col === col && x.row === row);
    },
  };

  let hp;
  try {
    hp = Number(character.cell('U16').value);
  } catch (e) {
    throw 'Não foi possível ler sua ficha de personagem.';
  }
  const character_sheet = {
    name: character.cell('C6').value || 'Sem Nome',
    hp,
    levels: { level: Number(character.cell('AL6').value) },
    armor: Number(character.cell('R12').value),
    skills: getSkills(character),
    stats: getStats(character),
    mods: { advantage: [], disadvantage: [] },
  };

  return character_sheet;
}

module.exports = getCharacter;
