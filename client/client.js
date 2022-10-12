import { genName, genBio } from "/getApeJS";

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
  // GrabpastApes elem
  const pastApes = document.querySelector('#pastApes');

  if (response.status === 200) {
    // Parse to json asynchronously
    const obj = await response.json();

    pastApes.innerHTML = '';

    // Create an array of received apes
    const receivedApes = [];
    
    for (const nameKey of Object.keys(obj.sightings)) {
    const ape = obj.sightings[`${nameKey}`];
    receivedApes.push(ape);
    }

    // Only display a max of 7 apes
    let maxApes = 7;
    if (receivedApes.length < 7) {
      maxApes = receivedApes.length;
    }

    // Get the most recent ones
    for (let i=receivedApes.length-1; i>receivedApes.length-maxApes-1; i--) {
      let sketchStr = ``;
      sketchStr += `<img src="/getImage?type=fur&index=${receivedApes[i].looks[0]}">`;
      sketchStr += `<img src="/getImage?type=skin&index=${receivedApes[i].looks[1]}">`;
      sketchStr += `<img src="/getImage?type=outline">`;
      sketchStr += `<img src="/getImage?type=face&index=${receivedApes[i].looks[2]}">`;
  
      let summaryStr = ``;
      summaryStr += `<p class="sumName">${receivedApes[i].name} - ${receivedApes[i].looks[3]}<p>`;
      summaryStr += `<p class="sumBio">${receivedApes[i].bio}</p>`
      
      pastApes.innerHTML += `<section class="sighting"><div class="sketch">${sketchStr}</div><div class="summary">${summaryStr}</div></section>`;
    }
  }
};

// Use fetch to send POST request asynchronously
const sendPost = async (infoForm) => {
  // Grab info from entryForm elems
  const entryAction = infoForm.getAttribute('action');
  const entryMethod = infoForm.getAttribute('method');
  const nameField = infoForm.querySelector('#nameField');
  const bioField = infoForm.querySelector('#bioField');

  // Construct string for body values
  let looksVal = '';
  looksVal += grabChkdRadVal(infoForm.querySelector('#furField'));
  looksVal += grabChkdRadVal(infoForm.querySelector('#skinField'));
  looksVal += grabChkdRadVal(infoForm.querySelector('#faceField'));
  looksVal += grabChkdRadVal(infoForm.querySelector('#sexField'));

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
const requestUpdate = async () => {
  // Grab URL and method from form elems
  const url = '/getApes';
  const method = 'get';
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
  const infoForm = document.querySelector('#infoForm');
  const getForm = document.querySelector('#getForm');

  // Create addApe function
  // Also cancel built-in HTML form action
  const addApe = (e) => {
    e.preventDefault();
    sendPost(infoForm);
    return false;
  };

  // Handle getApes request
  // Also cancel built-in HTML form action
  const getApes = (e) => {
    e.preventDefault();
    requestUpdate();
    return false;
  };

  // Add event listeners
  infoForm.addEventListener('submit', addApe);
  getForm.addEventListener('submit', getApes);

  // Grab elems
  const nameBtn = infoForm.querySelector('#randName');
  const bioBtn = infoForm.querySelector('#randBio');
  const nameField = infoForm.querySelector('#nameField');
  const bioField = infoForm.querySelector('#bioField');

  // Add event listeners
  // For some reason image clicks count as submits
  // Counteract that by returning false
  nameBtn.addEventListener('click', () => {
    nameField.value = genName();
    return false;
  });
  bioBtn.addEventListener('click', () => {
    bioField.value = genBio();
    return false;
  });

  const furImg = infoForm.querySelector('#furImg');
  const skinImg = infoForm.querySelector('#skinImg');
  const faceImg = infoForm.querySelector('#faceImg');

  const furOpts = infoForm.querySelector("#furField").querySelectorAll("input[type='radio']");
  const skinOpts = infoForm.querySelector("#skinField").querySelectorAll("input[type='radio']");
  const faceOpts = infoForm.querySelector("#faceField").querySelectorAll("input[type='radio']");

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
