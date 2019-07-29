import 'core-js/es/array/from';
import 'core-js/es/number/is-nan';
import list from './words/index';

// very crude matchAll() implementation which works only for this use-case
const matchAll = (s, pattern) => {
  const matches = s.match(pattern);

  if (matches !== null && typeof matches === 'array') {
    return matches.slice(0, 3);
  } else {
    return [undefined, undefined, undefined];
  }
};

// read has string from location.hash and apply parameters to input elements
const getParamsFromHash = () => {
  const { hash } = window.location;

  let words;
  let passphrases;
  let wordlist;

  // 1x hash parameter
  [[, words] = []] = [...matchAll(hash, /^#\/([0-9]+)$/g)];
  if (words !== undefined) {
    // set numeric input elements
    document.getElementById('numberOfWords').value = parseInt(words, 10);
  }

  // 2x hash parameters
  [[, words, passphrases] = []] = [
    ...matchAll(hash, /^#\/([0-9]+)\/([0-9]+)$/g),
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
    ...matchAll(hash, /^#\/([0-9]+)\/([0-9]+)\/([a-zA-Z\-]+)$/g),
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

  // note: msCrypto is for IE11
  const crypto = window.crypto || window.msCrypto;
  if (!crypto) {
    console.error('Web Cryptography API not available');
    return;
  }

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
  // document.getElementById('output').innerHTML = passList.join('\n');

  // clear current output contents
  document.getElementById('output').innerHTML = '';

  passList.forEach((pass) => {
    // add password as new output line
    const line = document.createElement('div');
    document.getElementById('output').appendChild(line).innerHTML = pass;

    // user clicking on a passphrase line, will copy the passphrase to clipboard
    line.addEventListener('click', () => {
      // copy passphrase to textarea so we can copy to clipboard
      const target = document.getElementById('clipboard');
      target.value = pass;
      target.select();
      document.execCommand('copy');

      // highlight line
      line.className += ' copied';

      // inform user that the line was copied (this perhaps is better done using a snackbar or something)
      line.innerHTML = `${pass} *COPIED!*`;

      // after prescribed time, clear the 'copied' notice
      setTimeout(() => {
        line.innerHTML = pass;
      }, 400);

      // after prescribed time, remove the highlight styling
      setTimeout(() => {
        line.className = 'cleared';
      }, 2000);
    });
  });

  document.getElementById(
    'message'
  ).innerHTML = `<p>These passwords have ${entropyBits} <a href='https://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength'>bits of entropy</a> each. Dictionary size of ${
    words.length
  } words.</p>`;

  // update window.location.hash - but not when generate() runs on initial page load
  if (!initial) {
    const hash = `#/${numberOfWords}/${numberOfPassphrases}/${listSelected}`;
    // window.location.hash = `#/${numberOfWords}/${numberOfPassphrases}/${listSelected}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }
};

// set default params, only if there is no window.location.hash
const setDefaultParameters = () => {
  // number of words = 6
  document.getElementById('numberOfWords').value = 6;

  // number of passphrases = 20
  document.getElementById('numberOfPassphrases').value = 20;

  // wordlist = 'eff-long'
  document.querySelectorAll(`input[type='radio']#eff-long`)[0].checked = true;
};

document.addEventListener('DOMContentLoaded', () => {
  // check for web cryptography API
  const crypto = window.crypto || window.msCrypto;
  if (!crypto) {
    console.error('Web Cryptography API not available');
    document.getElementById(
      'output'
    ).innerHTML = `<p>Your web browser does not support Web Cryptography API. Please use a secure modern browser such as <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a></p>`;
    return;
  }

  // set default parameters if there is no hash
  if (window.location.hash === '') {
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

  // get and apply paramters from window.location.hash, if any
  getParamsFromHash();

  // generate passwords on initial page load
  generate({ initial: true });

  // add listeners to "generate" button, clicking will generate again
  document.getElementById('generate').addEventListener('click', generate);

  // changing the word list will also regenerate
  Array.from(document.querySelectorAll("input[type='radio']")).forEach((e) => {
    e.addEventListener('change', generate);
  });

  // changing number of words or passphrases will also regenerate
  Array.from(document.querySelectorAll("input[type='number']")).forEach((e) => {
    e.addEventListener('change', generate);
  });

  // hand clicking of 'reset to defaults' button
  document.getElementById('reset').addEventListener('click', (e) => {
    e.preventDefault();

    // unfocus the anchor
    e.target.blur();

    // set default parameters and regenerate passphrases
    setDefaultParameters();
    generate();

    // remove existing hash
    history.pushState(null, '', ' ');
  });

  // handler of  -/+ button clicks
  const buttonsSpinner = Array.from(document.querySelectorAll('.spin'));
  buttonsSpinner.forEach((button) => {
    button.addEventListener('click', (e) => {
      // remove focus after clicking
      e.target.blur();

      // get target <input> element and value, this is the value we want to decrease or increase
      const targetInput = document.getElementById(e.target.dataset.target);
      const currentNumber = parseInt(targetInput.value, 10);

      // don't continue if there is no number
      if (Number.isNaN(currentNumber)) return;

      // increase or decrease number
      if (e.target.dataset.action === 'dec') {
        targetInput.value = currentNumber - 1;
      }
      if (e.target.dataset.action === 'inc') {
        targetInput.value = currentNumber + 1;
      }

      // regenerate passphrases
      generate();
    });
  });
});
