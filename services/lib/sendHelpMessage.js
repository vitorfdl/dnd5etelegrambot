module.exports = function sendHelpMessage(bot, text_array, msg) {
  text_array =

  bot.sendMessage(
    msg.chat.id,
    text_array.join('\n'),
    { parse_mode: 'MARKDOWN', disable_notification: true },
  );
};

