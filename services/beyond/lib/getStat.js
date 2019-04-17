/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
const data_info  = require('./info.json');
const getObjects = require('./_getObjects');

module.exports = (character, data_sheet) => {
  const ignored = [];
  const calculated_stats = {};
  const set_calculated_stats = [];
  const has_stat_bonuses = [];
  character.prof = [];

  character.stat_from_id = (_id) => {
    const mod_list = ['strengthMod', 'dexterityMod', 'constitutionMod', 'intelligenceMod', 'wisdomMod', 'charismaMod'];
    return character.stats[mod_list[_id - 1]];
  };

  for (const modtype in data_sheet.modifiers) {
    for (const mod of data_sheet.modifiers[modtype]) {
      if (mod.id.includes('armor') || mod.id.includes('weapon')) {
        const [found] = getObjects(data_sheet.inventory, 'id', mod.componentId);
        if (found && !found.equipped) continue;
      }
      const subtype = mod.subType;
      if (mod.statId) {
        has_stat_bonuses.push({ subtype, type: mod.type, stat: mod.statId });
      }

      if (mod.type === 'bonus') {
        if (mod.type in set_calculated_stats) continue;
        calculated_stats[subtype] = (calculated_stats[subtype] || 0) + (mod.value || 0);
      } else if (mod.type === 'damage') {
        calculated_stats[`${subtype}-damage`] = (set_calculated_stats[`${subtype}-damage`] || 0) + (mod.value || 0);
      } else if (mod.type === 'set') {
        if (subtype in set_calculated_stats && calculated_stats[subtype] > (mod.value || 0)) continue;
        calculated_stats[subtype] = (mod.value || 0);
        set_calculated_stats.push(subtype);
      } else if (mod.type === 'ignore') {
        calculated_stats[subtype] = 0;
        ignored.push(subtype);
      //
      }

      if (mod.type === 'proficiency') {
        if (subtype === 'simple-weapons') {
          character.prof = character.prof.concat(data_info.weapons_simple);
        } else if (subtype === 'martial-weapons') {
          character.prof = character.prof.concat(data_info.weapons_martial);
        }
        character.prof.push(mod.friendlySubtypeName);
      }
    }
  }

  for (const mod in has_stat_bonuses) {
    const subtype = mod.subType;
    if (ignored.includes(subtype)) continue;
    const stat_mod = character.stat_from_id(mod.stat);

    if (mod.type === 'bonus') {
      calculated_stats[subtype] = (calculated_stats[subtype] || 0) + stat_mod;
    } else if (mod.type === 'damage') {
      calculated_stats[`${subtype}-damage`] = (calculated_stats[`${subtype}-damage`] || 0) + stat_mod;
    } else if (mod.type === 'set') {
      calculated_stats[subtype] = stat_mod;
    }
  }

  character.calculated_stats = calculated_stats;
  character.set_calculated_stats = set_calculated_stats;

  character._getStat = (stat, base = 0) => {
    if (character.set_calculated_stats.includes(stat)) {
      return character.calculated_stats[stat] || 0;
    }
    const bonus = character.calculated_stats[stat];
    return (base || 0) + (bonus || 0);
  };

  for (const [i, val] of ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].entries()) {
    const base = data_sheet.stats.find(x => x.id === i + 1).value;
    const bonus = data_sheet.bonusStats.find(x => x.id === i + 1).value;
    const override = data_sheet.overrideStats.find(x => x.id === i + 1).value;
    character.stats[val] = override || character._getStat(`${val}-score`, base + bonus);
    character.stats[`${val}Mod`] = Math.floor((Number(character.stats[val]) - 10) / 2);
  }

  const level = character.levels.level;
  character.hit_points_per_level = character.stats.constitutionMod * level;
  character.hp = data_sheet.overrideHitPoints || data_sheet.baseHitPoints + (character._getStat('hit-points-per-level', character.stats.constitutionMod) * level);


  return character;
};
