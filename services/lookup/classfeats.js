const feat_list = require('./data/classfeats.json');

module.exports = (bot, msg) => {
  const feat_name = msg.text.split(' ').slice(1).join(' ').toLowerCase();
  const feat = feat_list.find((x) => {
    const x_name = x.name.toLowerCase();
    return x_name.includes(feat_name);
  });

  if (!feat) {
    const text = [`Não foi possível encontrar a caracteristica ${feat_name}.`];
    return bot.sendStructedMessage(msg, text);
  }

  const text = [
    `*${feat.name}*`,
    feat.text,
  ];
  return bot.sendStructedMessage(msg, text);
};

