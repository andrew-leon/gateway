// 1. Query the Scryfall API for one random card of each major type

// 2. For the relevant cards (creature & planeswalker) grab additional information to be used in explanation text

// 3. Display cards on page using object url as img src, 
//and card name/type as alt text

const mtgApp = {};

// initializes all data; called in mtgApp.init()
mtgApp.initData = () => {
  // array of card types to display
  mtgApp.cardTypes = [
    "Land",
    "Creature",
    "Artifact",
    "Enchantment",
    "Planeswalker",
    mtgApp.randPick("Instant", "Sorcery")
  ];

  // dictionary of card objects, populated at runtime
  mtgApp.cards = {};

  // API endpoint
  mtgApp.url = new URL("https://api.scryfall.com/cards/random");
};

// initializes all functions; called in mtgApp.init()
mtgApp.initFuncs = () => {

  /**
   * @function mtgApp.generateQuery
   * Generates a query string for a given card type (e.g. "Land").
   * The query string is formatted using the Scryfall API docs
   * (https://scryfall.com/docs/syntax) to filter in the following ways:
   * 
   *  - only cards matching the given card type, and no other type
   *  - no cards with multiple faces 
   * 
   * @param {string} type a specified type from mtgApp.cardTypes[]
   * @return a formated query string
   */
  mtgApp.generateQuery = (type) => {

    // include only cards with given type
    let query = `t:${type.toLowerCase()} `;

    // exclude all other card types
    // (this excludes multiple-type cards)
    for (let cardType of mtgApp.cardTypes) {
      if (cardType != type) {
        query += `-t:${cardType.toLowerCase()} `;
      }
    }

    // a list of types of multi-faced cards
    const multiFacedTypes = [
      "split",
      "flip",
      "transform",
      "meld",
    ];

    // exclude all types of multi-faced cards
    for (let cardType of multiFacedTypes) {
      query += `-is:${cardType} `;
    }

    // exclude funny cards
    query += `-is:funny`;

    return query;
  };

  /**
   * @function mtgApp.randPick
   * uses Math.random() to randomly pick from the given inputs
   * @param  {...any} inputs one or more inputs
   * @return any one of the inputs, with equal probability
   */
  mtgApp.randPick = (...inputs) => {
    const randInt = Math.floor(Math.random() * inputs.length);
    return inputs[randInt];
  };

  /**
   * @function mtgApp.fetchRandomCard
   * fetches a random card of the specified type
   * @param {string} type a specified type from mtgApp.cardTypes[]
   */
  mtgApp.fetchRandomCard = (type) => {
    // generate request parameter from type
    mtgApp.url.search = new URLSearchParams({
      q: mtgApp.generateQuery(type),
    });

    fetch(mtgApp.url)
    .then((response) => response.json())
    .then((card) => mtgApp.cards[type] = card);
  };
};

// main init function
mtgApp.init = () => {
  mtgApp.initFuncs();
  mtgApp.initData();
};

mtgApp.init();

mtgApp.cardTypes.forEach((type) => mtgApp.fetchRandomCard(type));