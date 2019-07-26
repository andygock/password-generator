import list from './words/index';

// read has string from location.hash and apply parameters to input elements
const getParamsFromHash = () => {
  const hash = location.hash;
  // console.log(hash);

  let words;
  let passphrases;
  let wordlist;

  // 1x hash parameter
  [[, words] = []] = [...hash.matchAll(/^#\/([0-9]+)$/g)];
  if (words !== undefined) {
    // set numeric input elements
    document.getElementById('numberOfWords').value = parseInt(words, 10);
  }

  // 2x hash parameters
  [[, words, passphrases] = []] = [
    ...hash.matchAll(/^#\/([0-9]+)\/([0-9]+)$/g),
  ];
  if (words !== undefined && passphrases !== undefined) {
    // set numeric input elements
    document.getElementById('numberOfWords').value = parseInt(words, 10);
    document.getElementById('numberOfPassphrases').value = parseInt(
      passphrases,
      10
    );
  }

  // 3x hash parameters
  [[, words, passphrases, wordlist] = []] = [
    ...hash.matchAll(/^#\/([0-9]+)\/([0-9]+)\/([a-zA-Z\-]+)$/g),
  ];
  if (
    words !== undefined &&
    passphrases !== undefined &&
    wordlist !== undefined
  ) {
    // set numeric input elements
    document.getElementById('numberOfWords').value = parseInt(words, 10);
    document.getElementById('numberOfPassphrases').value = parseInt(
      passphrases,
      10
    );

    // set value and check property of the <input> radio element
    const wordlistRadio = document.getElementById(wordlist);
    if (wordlistRadio) {
      wordlistRadio.checked = true;
      wordlistRadio.value = wordlist;
    } else {
      // no such word list
      alert(`No such word list: "${wordlist}"`);
    }
  }
};

// generate cryptographically secure random number between min and max inclusive
const random = (min, max) => {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0] / (0xffffffff + 1);
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(randomNumber * (maxInt - minInt + 1)) + minInt;
};

// generate passwords and render in DOM
const generate = ({ initial } = {}) => {
  const listSelected = document.querySelector('input[name="wordlist"]:checked')
    .value;

  // obtain word list
  let words = [];
  switch (listSelected) {
    case 'eff-long':
      words = list.long.split('|');
      break;

    case 'eff-short1':
      words = list.short1.split('|');
      break;

    case 'eff-short2':
      words = list.short2.split('|');
      break;

    // case 'eff-startrek':
    //   words = list.startrek.split('|');
    //   break;

    // case 'eff-starwars':
    //   words = list.starwars.split('|');
    //   break;

    // case 'eff-harrypotter':
    //   words = list.harrypotter.split('|');
    //   break;

    // case 'eff-gameofthrones':
    //   words = list.gameofthrones.split('|');
    //   break;

    default:
      // use 'eff-long' equivalent
      words = list.long.split('|');
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
  ).innerHTML = `<p>These passwords have ${entropyBits} <a href='https://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength'>bits of entropy</a> each. Dictionary size of ${
    words.length
  } words.</p>`;

  // update location.hash - but not when generate() runs on initial page load
  if (!initial) {
    const hash = `#/${numberOfWords}/${numberOfPassphrases}/${listSelected}`;
    // location.hash = `#/${numberOfWords}/${numberOfPassphrases}/${listSelected}`;
    if (location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }
};

// set default params, only if there is no location.hash
const setDefaultParameters = () => {
  // number of words = 6
  document.getElementById('numberOfWords').value = 6;

  // number of passphrases = 20
  document.getElementById('numberOfPassphrases').value = 20;

  // wordlist = 'eff-long'
  document.querySelectorAll(`input[type='radio']#eff-long`)[0].checked = true;
};

document.addEventListener('DOMContentLoaded', () => {
  // set default parameters if there is no hash
  if (location.hash === '') {
    setDefaultParameters();
  }

  // history entry changes e.g user clicks back or forward button
  // should not trigger, as we use history.replaceState() instead of history.pushState()
  // leave here in case we decide to push states later on
  onpopstate = (e) => {
    // update params from the hash
    getParamsFromHash();

    // regenerate passphrases
    generate();
  };

  // get and apply paramters from location.hash, if any
  getParamsFromHash();

  // generate passwords on initial page load
  generate({ initial: true });

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

  // hand clicking of 'reset to defaults' button
  document.getElementById('reset').addEventListener('click', (e) => {
    e.preventDefault();

    // set default parameters and regenerate passphrases
    setDefaultParameters();
    generate();

    // remove existing hash
    history.pushState(null, '', ' ');
  });
});
