const mtgApp = {};

// 1. Query the Scryfall API for one random card of each major type
mtgApp.instantOrSorcery = () => {
  const rand =  Math.floor(Math.random());
  if (rand >= 0.5) {
    return "Instant";
  }
  return "Sorcery";
};

/**
 * returns true if a card has exactly one supertype, and it is of the specified type
 * intended to avoid multiple supertypes, e.g. "Artifact Creature"
 * @param {string} typeLine a card's full type line
 * @param {string} type a specific type from the cardTypes array
 */
mtgApp.matchesCardType = (typeLine, type) => {
    const dash = "—";
    const typeRegex = new RegExp(`^(Legendary )?${type}( ${dash} .+)?$`);
    return typeRegex.test(typeLine);
};

mtgApp.cardTypes = [
  "Land",
  "Creature",
  "Artifact",
  "Enchantment",
  "Planeswalker",
  mtgApp.instantOrSorcery()
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
      if (mtgApp.matchesCardType(card.type_line, type) && card.legalities.commander === "legal") {
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