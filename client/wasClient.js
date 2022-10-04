// ----------------------------
// - - - - - APE DATA - - - - -
// ----------------------------

const preCon = ['b', 'f', 'g', 'h', 'j', 'k', 'm', 'p', 'r', 't', 'w', 'y', 'z', 'ch'];
const vowel = ['a', 'e', 'i', 'o', 'u'];
const sufCon = ['h', 'l', 'm', 'n'];

const bioA = ['Never ', 'A little ', 'A bit ', 'Partially ', 'Somewhat ', 'Kind of ', 'Sometimes ', 'Occasionally ', 'Frequently ', 'Always ', 'Permanently ', 'Eternally ', 'Tends to be ', 'Extremely ', 'Strangely ', 'Oddly ', 'Weirdly '];
const bioB = ['friendly', 'hungry', 'angry', 'cheerful', 'curious', 'annoyed', 'chatty', 'stoic', 'intense', 'excited', 'jolly', 'goofy', 'weird', 'creative'];

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

// ----------------------------------
// - - - - - FORM FUNCTIONS - - - - -
// ----------------------------------

// Get value from a set of radio buttons
const grabChkdRadVal = (elem) => {
  const options = elem.querySelectorAll('input[type="radio"]');
  for (const rad of options) {
    if (rad.checked) {
      return rad.value;
    }
  }
};

// Handle response asynchronously
const handleResponse = async (response, parseResponse) => {
  // Grab content elem
  const content = document.querySelector('#content');

  // Write something based on status
  switch (response.status) {
    case 200:
      // Parse to json asynchronously
      const obj = await response.json();

      content.innerHTML = '';

      for (const nameKey of Object.keys(obj.sightings)) {
        const ape = obj.sightings[`${nameKey}`];

        let sketchStr = "";
        sketchStr += `<img src="/getImage?type=fur&index=${ape.looks[0]}">`;
        sketchStr += `<img src="/getImage?type=skin&index=${ape.looks[1]}">`;
        sketchStr += `<img src="/getImage?type=outline">`;
        sketchStr += `<img src="/getImage?type=face&index=${ape.looks[2]}">`;

        content.innerHTML += `<section class="sighting"><div class="sketch">${sketchStr}</div><p>${ape.name}</p><p>${ape.looks[3]}</p><p>${ape.bio}</p></section>`;
      }
      break;
    case 201:
      content.innerHTML = '<b>Created</b>';
      break;
    case 204:
      content.innerHTML = '<b>Updated (No Content)</b>';
      break;
    case 400:
      content.innerHTML = '<b>Bad Request</b>';
      break;
    case 404:
      content.innerHTML = '<b>Resource Not Found</b>';
      break;
    default:
      content.innerHTML = 'Error code not implemented by client.';
      break;
  }
};

// Use fetch to send POST request asynchronously
const sendPost = async (entryForm) => {
  // Grab info from entryForm elems
  const entryAction = entryForm.getAttribute('action');
  const entryMethod = entryForm.getAttribute('method');
  const nameField = entryForm.querySelector('#nameField');
  const bioField = entryForm.querySelector('#bioField');

  // Construct string for body values
  let looksVal = '';
  looksVal += grabChkdRadVal(entryForm.querySelector('#furField'));
  looksVal += grabChkdRadVal(entryForm.querySelector('#skinField'));
  looksVal += grabChkdRadVal(entryForm.querySelector('#faceField'));
  looksVal += grabChkdRadVal(entryForm.querySelector('#sexField'));

  // Generate name and bio if necessary
  if (nameField.value === '') {
    nameField.value = genName();
  }
  if (bioField.value === '') {
    bioField.value = genBio();
  }

  // Build data string in FORM-URLENCODED
  const formData = `looks=${looksVal}&name=${nameField.value}&bio=${bioField.value}`;

  // Make fetch request and await response
  const response = await fetch(
    entryAction,
    {
      method: entryMethod,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formData,
    },
  );

  // Handle the response
  handleResponse(response, entryMethod === 'post');
};

// Send GET request asynchronously
const requestUpdate = async (userForm) => {
  // Grab URL and method from form elems
  const url = userForm.querySelector('#urlField').value;
  const method = userForm.querySelector('#methodSelect').value;

  // Await fetch response
  // Use URL and method to attach headers
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
    },
  });

  // Handle the response
  handleResponse(response, method === 'get');
};

const init = () => {
  // Grab entryForm and userForm elem
  const entryForm = document.querySelector('#entryForm');
  const userForm = document.querySelector('#userForm');

  // Create addApe function
  // Also cancel built-in HTML form action
  const addApe = (e) => {
    e.preventDefault();
    sendPost(entryForm);
    return false;
  };

  // Handle getApes request
  // Also cancel built-in HTML form action
  const getApes = (e) => {
    e.preventDefault();
    requestUpdate(userForm);
    return false;
  };

  // Add event listeners
  entryForm.addEventListener('submit', addApe);
  userForm.addEventListener('submit', getApes);

  // Grab elems
  const nameBtn = entryForm.querySelector('#randName');
  const bioBtn = entryForm.querySelector('#randBio');
  const nameField = entryForm.querySelector('#nameField');
  const bioField = entryForm.querySelector('#bioField');

  // Add event listeners
  nameBtn.addEventListener('click', () => {
    nameField.value = genName();
  });
  bioBtn.addEventListener('click', () => {
    bioField.value = genBio();
  });

  const furImg = entryForm.querySelector('#furImg');
  const skinImg = entryForm.querySelector('#skinImg');
  const faceImg = entryForm.querySelector('#faceImg');

  const furOpts = entryForm.querySelector("#furField").querySelectorAll("input[type='radio']");
  const skinOpts = entryForm.querySelector("#skinField").querySelectorAll("input[type='radio']");
  const faceOpts = entryForm.querySelector("#faceField").querySelectorAll("input[type='radio']");

  for (let radBtn of furOpts) {
    radBtn.addEventListener('click', () => {
      furImg.src = `/getImage?type=fur&index=${radBtn.value}`;
    });
  }
  for (let radBtn of skinOpts) {
    radBtn.addEventListener('click', () => {
      skinImg.src = `/getImage?type=skin&index=${radBtn.value}`;
    });
  }
  for (let radBtn of faceOpts) {
    radBtn.addEventListener('click', () => {
      faceImg.src = `/getImage?type=face&index=${radBtn.value}`;
    });
  }
};

window.onload = init;
