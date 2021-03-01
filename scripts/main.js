// 1. Query the Scryfall API for one random card of each major type

// 2. For the relevant cards (creature & planeswalker) grab additional information to be used in explanation text

// 3. Display cards on page using object url as img src,
//and card name/type as alt text

/* LINKS
Scryfall main page: 
  https://scryfall.com/

Scryfall API docs: 
  https://scryfall.com/docs/api

Scryfall API docs for our endpoint: 
  https://scryfall.com/docs/api/cards/random

Scryfall docs for advanced search syntax
  https://scryfall.com/docs/syntax
*/

// the name of the app
const gateway = {};

// initializes all data; called in gateway.init()
gateway.initData = () => {

  // randomly resolves to "Instant" or "Sorcery" on page-load
  const spell = gateway.randPick("Instant", "Sorcery");

  // array of card types to display
  gateway.cardTypes = [
    "Land",
    "Creature",
    "Artifact",
    "Enchantment",
    "Planeswalker",
    spell
  ];

  // array of promises; populated at runtime
  gateway.promises = [];

  // dictionary of card objects; populated at runtime
  gateway.cards = {};
  /* example card object (this one would be at gateway.cards.Creature):
  {
    name: "Squee, the Immortal"
    type: "Legendary Creature — Goblin"
    image:  "https://c1.scryfall.com/file/scryfall-cards/normal/front/a/3/a3974c62-a524-454e-9ce7-2c23b704e5cb.jpg?1562740600"
  }
  */

  // API endpoint
  gateway.url = new URL("https://api.scryfall.com/cards/random");

  // selector cache
  gateway.selCache = {
    // card preview list
    cardPrevList: document.querySelector(".cardPrevList"),

    // dropdown icon
    chevron: document.querySelector('.fa-chevron-left')
  }
};

// initializes all functions; called in gateway.init()
gateway.initFuncs = () => {

  /**
   * @function gateway.buildFilterQuery()
   * Generates a query string for a given card type (e.g. "Land").
   * The query string is formatted using Scryfall's advanced search syntax 
   * (https://scryfall.com/docs/syntax) to filter the random card request 
   * in the following ways:
   *
   *  - only cards matching the given card type, and no other type
   *  - no cards with multiple faces
   *  - no "funny" cards
   *
   * @param {string} type A specified type from gateway.cardTypes[]
   * @return A formated query string
   */
  gateway.buildFilterQuery = (type) => {

    // include only cards with given type, e.g. "t:land"
    let query = `t:${type.toLowerCase()} `;

    // exclude all other card types, e.g. "-t:creature"
    // (this excludes multiple-type cards)
    for (let cardType of gateway.cardTypes) {
      if (cardType != type) {
        query += `-t:${cardType.toLowerCase()} `;
      }
    }

    // a list of types of multi-faced cards
    const multiFacedTypes = ["split", "flip", "transform", "meld"];

    // exclude all types of multi-faced cards
    for (let cardType of multiFacedTypes) {
      query += `-is:${cardType} `;
    }

    // exclude funny cards
    query += `-is:funny `;

    return query;
  };

  /**
   * @function gateway.randPick()
   * Uses Math.random() to randomly pick from the given arguments.
   * @param  {...any} args One or more arguments
   * @return Any of the arguments, with equal probability
   */
  gateway.randPick = (...args) => {

    const randInt = Math.floor(Math.random() * args.length);
    return args[randInt];
  };

  /**
   * @function gateway.fetchRandomCard()
   * Fetches a random card of the specified type, and writes it to 
   * the gateway.cards object.
   * @param {string} type A specified type from gateway.cardTypes[]
   * @return A promise which resolves to a JSON representation of a 
   * card of the specified type.
   */
  gateway.fetchRandomCard = async (type) => {

    gateway.url.search = new URLSearchParams({
      // generate request parameter from type
      q: gateway.buildFilterQuery(type),
    });

    const promiseData = await fetch(gateway.url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      });

    return promiseData;
  };

  /**
   * @function gateway.displayCard()
   * Dynamically generates an html representation of an MTG card, generating 
   * alt text from card name and type
   * @param {object} type A specified type from gateway.cardTypes[]
   */
  gateway.displayCard = (type) => {

    // is type a "spell"? (in the colloquial sense)
    const typeIsSpell = 
      type == "Instant" || 
      type == "Sorcery";

    // match "Instant" & "Sorcery" types to section id "Spell"
    const id = typeIsSpell ? "Spell" : type;
    
    // does "type" start with a vowel?
    const typeVowelStart =
      type == "Artifact" ||
      type == "Enchantment" ||
      type == "Instant";
    
    // match indefinite article for grammatical correctness
    const indefArticle = typeVowelStart ? "an" : "a";

    const card = gateway.cards[type];

    // display "preview" image ("pick a card" section)
    const prevImage = document.createElement('img');

    prevImage.src = card.image;
    prevImage.alt = `preview of ${card.name}: ${indefArticle} ${type} card`;

    // display "main" image ("explain" sections)
    const mainImage = document.createElement('img');
    mainImage.src = card.image;
    mainImage.alt = `${card.name}: an example of ${indefArticle} ${type} card`;

    prevImage.classList.add(id);

    const li = document.createElement('li');
    li.appendChild(prevImage);

    const list = document.querySelector(".cardPrevList");

    list.appendChild(li);

    // query image container in matching article
    const imgContainer = document.querySelector(`#${id} .lrgImgContainer`);

    imgContainer.appendChild(mainImage);
  }
};

// main init function
gateway.init = () => {
  gateway.initFuncs();
  gateway.initData();
  /* 
  GOAL: make promises come in a specific order
  CHALLENGE: promises take ??? time to resolve
  SOLUTION: 
    1. shove promises in an array 
    2. do Promise.all(array)
  */

  // populates promise array with API responses (converted to json)
  for (let type, i = 0; i < gateway.cardTypes.length; i++) {
    type = gateway.cardTypes[i];

    // ensures that promises are inserted into array in specific order
    // (specifically lands at 0, creatures at 1, artifacts at 2, etc)
    gateway.promises[i] = gateway.fetchRandomCard(type);
  }

  // resolve promises and convert data to card object 
  // (see gateway.cards comment)
  Promise.all(gateway.promises).then(cardsArray => {

    for (let type, card, i = 0; i < cardsArray.length; i++) {

      // the card we're currently on
      card = cardsArray[i];

      // the type that this card should be
      // guaranteed by specific ordering of gateway.promises
      type = gateway.cardTypes[i];

      // e.g. gateway.cards["Land"]
      gateway.cards[type] = {
        name: card.name,
        type: card.type_line,
        image: card.image_uris.normal
      };

      // display card (in order of type: land, then creature, etc)
      gateway.displayCard(type);
    }
  }).catch(error => console.error(error.message));

  // Event Listeners

  // adds scrolling behaviour
  gateway.selCache.cardPrevList.addEventListener('click', (event) => {

    // check if event.target is an image
    if (event.target.tagName == "IMG") {

      // get type (from img class)
      const type = event.target.className;

      // get target section to scroll to
      const section = document.querySelector('#' + type);

      // scroll to section
      section.scrollIntoView({ behavior: "smooth" });
    }
  });

  gateway.selCache.chevron.addEventListener('click', (event) => {
    event.target.classList.toggle('active');
  });

};

gateway.init();