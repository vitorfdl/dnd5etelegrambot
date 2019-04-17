const feat_list = require('./data/feats.json');
const classFeat_list = require('./data/classfeats.json');
const stringSimilarity = require('string-similarity');
const yargs = require('yargs');

async function classFeat(bot, msg, feat_name) {
  const feat = classFeat_list.find((x) => {
    const x_name = x.name.toLowerCase();
    return x_name.includes(feat_name);
  });

  if (!feat) return;

  const text = [
    `*${feat.name}*`,
    feat.text,
  ];
  bot.sendStructedMessage(msg, text);

  return true;
}

module.exports = async (bot, msg) => {
  let feat_name = msg.text.split(' ').slice(1).join(' ').toLowerCase();
  const params = yargs.parse(feat_name);
  feat_name = params._.join(' ');

  const similar = [];
  const feat = feat_list.find((x) => {
    const x_name = x.name.toLowerCase();
    if (stringSimilarity.compareTwoStrings(x_name, feat_name) >= 0.75) similar.push(`   _${x.name}_`);
    return x_name === feat_name;
  });

  if (!feat) {
    if (params.c && await classFeat(bot, msg, feat_name)) return;
    let text = [`Não foi possível encontrar a caracteristica ${feat_name}.`];
    if (similar[0]) text = text.concat(['Você quis dizer?']).concat(similar);
    return bot.sendStructedMessage(msg, text);
  }

  const text = [
    `*${feat.name}* _[${feat.source}]_`,
    '*Pré-requisito*',
    `\`${feat.prerequisite}\``,
    '',
    feat.desc,
  ];
  return bot.sendStructedMessage(msg, text);
};

