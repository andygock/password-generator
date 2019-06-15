import fs from 'fs';

const getWordsFromDiceFile = (string) => {
  return string
    .split(/\r?\n/)
    .map((s) => {
      const fields = s.split('\t');
      return fields.length === 2 ? fields[1] : null;
    })
    .filter((s) => s);
};

getWordsFromDiceFile(
  fs.readFileSync('./word-lists/eff_large_wordlist.txt', 'utf8')
);

export default {
  eff: {
    long: getWordsFromDiceFile(
      fs.readFileSync(
        `${__dirname}/../word-lists/eff_large_wordlist.txt`,
        'utf8'
      )
    ),
    short: getWordsFromDiceFile(
      fs.readFileSync(
        `${__dirname}/../word-lists/eff_short_wordlist_1.txt`,
        'utf8'
      )
    ),
    short2: getWordsFromDiceFile(
      fs.readFileSync(
        `${__dirname}/../word-lists/eff_short_wordlist_2_0.txt`,
        'utf8'
      )
    ),
  },
};
