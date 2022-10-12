// ----------------------------
// - - - - - APE DATA - - - - -
// ----------------------------

const preCon = ['b', 'f', 'g', 'h', 'j', 'k', 'm', 'p', 'r', 't', 'w', 'y', 'z', 'ch'];
const vowel = ['a', 'e', 'i', 'o', 'u'];
const sufCon = ['h', 'l', 'm', 'n'];

const bioA = ['Never ', 'A little ', 'A bit ', 'Partially ', 'Somewhat ', 'Kind of ', 'Sometimes ', 'Occasionally ', 'Frequently ', 'Always ', 'Permanently ', 'Eternally ', 'Tends to be ', 'Extremely ', 'Strangely ', 'Oddly ', 'Weirdly ', 'Just the right amount of '];
const bioB = ['friendly', 'hungry', 'angry', 'cheerful', 'curious', 'annoyed', 'chatty', 'stoic', 'intense', 'excited', 'jolly', 'goofy', 'weird', 'creative', 'paranoid', 'strong', 'relaxed', 'political', 'confused', 'intelligent', 'focused'];

// ---------------------------------
// - - - - - APE FUNCTIONS - - - - -
// ---------------------------------

// Gets a random element from an array
const randElem = (array) => array[Math.floor(Math.random() * array.length)];

// Generates a random syllable
const genSyllable = () => {
  // Declare empty string
  let syllable = '';

  // 10% chance to NOT have a beginning consonant
  if (Math.random() < 0.9) {
    syllable += randElem(preCon);
  }

  // Always have a vowel
  syllable += randElem(vowel);

  // 60% chance to NOT have an ending consonant
  if (Math.random() < 0.4) {
    syllable += randElem(sufCon);
  }

  // Return generated string
  return syllable;
};

// Generates a random name
const genName = () => {
  // Declare some variables
  let name = '';
  let goodToGo = false;

  // Run generation loop
  while (!goodToGo) {
    // Declare name with two random syllables
    name = genSyllable() + genSyllable();

    // 20% chance to add a vowel at the beginning
    if (Math.random() < 0.2) {
      name = randElem(vowel) + name;
    }

    // Check for bad words
    if (name != 'rape' && name != 'anal') {
      // Capitalize the first char
      name = name.charAt(0).toUpperCase() + name.slice(1);

      goodToGo = true;
    }
  }

  // Return generated name
  return name;
};

// Generates a random bio
const genBio = () => `${randElem(bioA) + randElem(bioB)}.`;

export {
    genName,
    genBio,
};