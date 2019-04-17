const feat_list = require('./data/feats.json');
const stringSimilarity = require('string-similarity');

module.exports = (bot, msg) => {
  const feat_name = msg.text.split(' ').slice(1).join(' ').toLowerCase();
  const similar = [];
  const feat = feat_list.find((x) => {
    const x_name = x.name.toLowerCase();
    if (stringSimilarity.compareTwoStrings(x_name, feat_name) >= 0.75) similar.push(`   _${x.name}_`);
    return x_name === feat_name;
  });

  if (!feat) {
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

