import list from './words/index';

// generate cryptographically secure random number between min and max inclusive
const random = (min, max) => {
  const randomBuffer = new Uint32Array(1);
  window.crypto.getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0] / (0xffffffff + 1);
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(randomNumber * (maxInt - minInt + 1)) + minInt;
};

// generate passwords and render in DOM
const generate = () => {
  const listSelected = document.querySelector('input[name="wordlist"]:checked')
    .value;

  // obtain word list
  let words = [];
  switch (listSelected) {
    case 'eff-long':
      words = list.eff.long.split('|');
      break;

    case 'eff-short-1':
      words = list.eff.short1.split('|');
      break;

    case 'eff-short-2':
      words = list.eff.short2.split('|');
      break;

    default:
      // use 'eff-long' equivalent
      words = list.eff.long.split('|');
      break;
  }

  // calculate useful stats
  const numberOfWords = document.getElementById('numberOfWords').value;
  const numberOfPassphrases = document.getElementById('numberOfPassphrases')
    .value;
  const entropyBits = Math.floor(
    Math.log(words.length ** numberOfWords) / Math.log(2)
  );

  // generate a set of passphrases
  const passList = [];
  for (let i = 0; i < numberOfPassphrases; i += 1) {
    // generate a passphrase
    let pass = '';
    for (let j = 0; j < numberOfWords; j += 1) {
      // generate a word
      const randomIndex = random(0, words.length - 1);
      const word = words[randomIndex];
      pass += ` ${word}`;
    }
    passList.push(pass.trim());
  }

  // write the output to DOM
  document.getElementById('output').innerHTML = passList.join('\n');
  document.getElementById(
    'message'
  ).innerHTML = `<p>These passwords have ${entropyBits} <a href='https://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength'>bits of entropy</a> each.`;
};

document.addEventListener('DOMContentLoaded', () => {
  // generate passwords on page load
  generate();

  // add listeners to "generate" button, clicking will generate again
  document.getElementById('generate').addEventListener('click', generate);

  // changing the word list will also regenerate
  document.querySelectorAll("input[type='radio']").forEach((e) => {
    e.addEventListener('change', generate);
  });

  // changing number of words or passphrases will also regenerate
  document.querySelectorAll("input[type='number']").forEach((e) => {
    e.addEventListener('change', generate);
  });
});
