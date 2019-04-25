module.exports = (dice, plus) => {
  if (plus > 0) {
    dice = dice.replace(/1d/g, '2d');
    dice += '-L';
  } else if (plus < 0) {
    dice = dice.replace(/1d/g, '2d');
    dice += '-H';
  }

  return dice;
};

