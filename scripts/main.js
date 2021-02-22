const mtgApp = {};

// 1. Query the Scryfall API for one random card of each major type
mtgApp.cardTypes = [
  "Land",
  "Creature",
  "Artifact",
  "Enchantment",
  "Planeswalker",
  "Instant",
  "Sorcery"
];

mtgApp.urls = {
  random: 'https://api.scryfall.com/cards/random',
  // named: 'https://api.scryfall.com/cards/named?fuzzy='
};

/**
 * queries random mtg cards until it gets one of the specified type
 * @param {string} type can be one of the following words:
 * land, creature, artifact, enchantment, planeswalker, instant, sorcery
 */
mtgApp.fetchRandomCard = async (type) => {

  // attempt no more than MAX_LOOPS number of fetches
  const MAX_LOOPS = 100;
  let finished = false;
  for (i = 0; !finished && i < MAX_LOOPS; i++) {

    // fetch random card object
    await fetch(mtgApp.urls.random)
    .then((response) => {
      return response.json();
    })
    .then((card) => {
      // if this card is legal and of the specified type, display it and finish the loop
      if (card.type_line.includes(type) && card.legalities.commander === "legal") {
        mtgApp.displayCard(card);
        finished = true;
      };
    });
  };

  // if we (somehow) failed to find the appropriate card in 100 attempts...
  if (!finished) {
    // add an image from a pre-selected local card cache?
  }
};

mtgApp.displayCard = (card) => {
  console.log(card);
};

for (let type of mtgApp.cardTypes) {
  mtgApp.fetchRandomCard(type);
};

// 2. For the relevant cards (creature & planeswalker) grab additional information to be used in explanation text

// 3. Display cards on page using object url as img src, and card name/type as alt text