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

  // dictionary of card objects; populated at runtime
  /* Anatomy of a card object:
  {
    name: "Squee, the Immortal"
    type: "Legendary Creature — Goblin"
    image:  "https://c1.scryfall.com/file/scryfall-cards/normal/front/a/3/a3974c62-a524-454e-9ce7-2c23b704e5cb.jpg?1562740600"
  }
  */
  gateway.cards = {};

  // API endpoint
  gateway.url = new URL("https://api.scryfall.com/cards/random");
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
   */
  gateway.fetchRandomCard = async (type) => {

    gateway.url.search = new URLSearchParams({
      // generate request parameter from type
      q: gateway.buildFilterQuery(type),
    });

    let cardData;

    return await fetch(gateway.url).then((response) => response.json());
  };

  /**
   * @function gateway.displayCard()
   * Dynamically generates an html representation of an MTG card, using
   * the card's name and type line for the alt text.
   * @param {object} type A specified type from gateway.cardTypes[]
   */
  gateway.displayCard = (type) => {

    const card = gateway.cards[type];

    // create "preview" image (for "pick a card" section)
    const prevImage = document.createElement('img');
    prevImage.src = card.image;
    prevImage.alt = `${card.name}: ${card.type}`;

    // create "main" image (for explanation section)
    const mainImage = prevImage.cloneNode(true);

    // give "preview" image specific class (for css purposes)
    prevImage.classList.add('cardPrev');

    const anchor = document.createElement('a');
    anchor.href = '#'+type;
    anchor.appendChild(prevImage);

    const li = document.createElement('li');
    li.appendChild(anchor);

    const list = document.querySelector(".cardPrevList");

    list.appendChild(li);

    // replace "Instant" and "Sorcery" types with "Spell" to match section id
    const id = (type == "Instant" || type == "Sorcery")
      ? "Spell"
      : type;

    // finds the image container in the relevant article
    const imgContainer = document.querySelector(`#${id} .lrgImgContainer`);

    imgContainer.appendChild(mainImage);
  }
};

// main init function
gateway.init = () => {
  gateway.initFuncs();
  gateway.initData();
};

gateway.init();

const promises = [];
for (let type, i = 0; i < gateway.cardTypes.length; i++) {
  type = gateway.cardTypes[i];
  promises[i] = gateway.fetchRandomCard(type);
}

Promise.all(promises).then(cards => {

  for (let type, card, i = 0; i < cards.length; i++) {
    card = cards[i];
    type = gateway.cardTypes[i];
    gateway.cards[type] = {
      name: card.name,
      type: card.type_line,
      image: card.image_uris.normal
    };

    gateway.displayCard(type);
  }
});

const list = document.querySelector(".cardPrevList");
list.addEventListener('click', (event) => {
  
});