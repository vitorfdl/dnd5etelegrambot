/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
const data_info = require('./info.json');

module.exports = (character, data_sheet) => {
  const profBonus = character.stats.proficiencyBonus;
  const skills = {};
  const profs = {};
  const bonuses = {};

  for (const [skill, stat] of Object.entries(data_info.skill_map)) {
    skills[skill] = character.stats[`${stat}Mod`];
  }

  for (const modtype in data_sheet.modifiers) {
    for (const mod of data_sheet.modifiers[modtype]) {
      mod.subType = mod.subType.replace('-saving-throws', 'Save');

      if (mod.type === 'half-proficiency') {
        profs[mod.subType] = Math.max(profs[mod.subType] || 0, 0.5);
      } else if (mod.type === 'proficiency') {
        profs[mod.subType] = Math.max(profs[mod.subType] || 0, 1);
      } else if (mod.type === 'expertise') {
        profs[mod.subType] = 2;
      } else if (mod.type === 'bonus') {
        if (!mod.isGranted) continue;
        if (mod.statId) {
          bonuses[mod.subType] = (bonuses[mod.subType] || 0) + character.stat_from_id(mod.statId);
        } else {
          bonuses[mod.subType] = (bonuses[mod.subType] || 0) + (mod.value || 0);
        }
      }
    }
  }

  profs.animalHandling = profs['animal-handling'];
  profs.sleightOfHand = profs['sleight-of-hand'];

  for (const skill in skills) {
    let relevantprof = profs[skill] || 0;
    let relevantbonus = bonuses[skill] || 0;

    if ('ability-checks' in profs && !skill.includes('Save')) {
      relevantprof = Math.max(relevantprof, profs['ability-checks'] || 0);
    }
    if ('ability-checks' in profs && skill.includes('Save')) {
      relevantprof = Math.max(relevantprof, profs['saving-throws'] || 0);
    }
    if ('ability-checks' in bonuses && !skill.includes('Save')) {
      relevantbonus += bonuses['ability-checks'] || 0;
    }
    if ('saving-checks' in bonuses && skill.includes('Save')) {
      relevantbonus += bonuses['saving-throws'] || 0;
    }

    skills[skill] = Math.floor(
      skills[skill] + (profBonus * relevantprof) + relevantbonus,
    );
  }

  const ignored_ids = [];
  for (const charval of data_sheet.characterValues) {
    if (String(charval.valueId) in data_info.houserule_skills && !ignored_ids.includes(charval.valueId)) {
      const skill_name = data_info.houserule_skills[charval.valueId];
      if (charval.typeId === 23) { // .. override
        skills[skill_name] = charval.value;
        ignored_ids.push(charval.valueId);  // this must be the final value so we stop looking
      } else if (charval.typeId === 24) {  // PROBABLY skill magic bonus
        skills[skill_name] += charval.value;
      } else if (charval.typeId === 25) {  // PROBABLY skill misc bonus
        skills[skill_name] += charval.value;
      } else if (charval.typeId === 26) {  // proficiency stuff
        const relevantprof = profs[skill_name] || 0;
        skills[skill_name] -= relevantprof * profBonus;
        if (charval.value === 0) { // no prof, don't need to do anything
          continue;
        } else if (charval.value === 1) {
          skills[skill_name] += profBonus;// 2
        } else if (charval.value === 2) {  // half, round up
          skills[skill_name] += Math.ceil(profBonus / 2);
        } else if (charval.value === 3) { // full
          skills[skill_name] += profBonus;
        } else if (charval.value === 4) { // double
          skills[skill_name] += profBonus * 2;
        }
      }
    }
  }

  ['strength', 'dexterity', 'constitution', 'wisdom', 'intelligence', 'charisma'].forEach((stat) => {
    skills[stat] = character.stats[`${stat}Mod`];
  });

  character.skills = skills;

  return character;
};
