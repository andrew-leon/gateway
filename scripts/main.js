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
  // array of card types to display
  gateway.cardTypes = [
    "Land",
    "Creature",
    "Artifact",
    "Enchantment",
    "Planeswalker",
    gateway.randPick("Instant", "Sorcery"),
  ];

  // dictionary of card objects; populated at runtime
  gateway.cards = {};

  // API endpoint
  gateway.url = new URL("https://api.scryfall.com/cards/random");
};

// initializes all functions; called in gateway.init()
gateway.initFuncs = () => {
  /**
   * @function gateway.buildFilterQuery
   * Generates a query string for a given card type (e.g. "Land").
   * The query string is formatted using Scryfall's advanced search syntax 
   * (see "LINKS" section above) to filter the random card request 
   * in the following ways:
   *
   *  - only cards matching the given card type, and no other type
   *  - no cards with multiple faces
   *  - no "funny" cards
   *
   * @param {string} type a specified type from gateway.cardTypes[]
   * @return a formated query string
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
   * @function gateway.randPick
   * uses Math.random() to randomly pick from the given arguments
   * @param  {...any} args one or more arguments
   * @return any argument, with equal probability
   */
  gateway.randPick = (...args) => {
    const randInt = Math.floor(Math.random() * args.length);
    return args[randInt];
  };

  /**
   * @function gateway.fetchRandomCard
   * fetches a random card of the specified type
   * @param {string} type a specified type from gateway.cardTypes[]
   */
  gateway.fetchRandomCard = (type) => {
    gateway.url.search = new URLSearchParams({
      // generate request parameter from type
      q: gateway.buildFilterQuery(type),
    });

    fetch(gateway.url)
      .then((response) => response.json())
      .then((card) => (gateway.cards[type] = card));
  };
};

// main init function
gateway.init = () => {
  gateway.initFuncs();
  gateway.initData();
};

gateway.init();

gateway.cardTypes.forEach((type) => gateway.fetchRandomCard(type));
