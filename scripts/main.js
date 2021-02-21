// 1. Query the Scryfall API for one random card of each of the following types
// 	- Land
// 	- Creature
// 	- Artifact
// 	- Enchantment
// 	- Planeswalker
// 	- Instant or Sorcery

const mtgApp = {};

mtgApp.urls = {
  random: 'https://api.scryfall.com/cards/random?q=',
  named: 'https://api.scryfall.com/cards/named?fuzzy='
};

/**
 * queries random mtg cards until it gets one of the specified type
 * @param {string} type can be one of the following words:
 * land, creature, artifact, enchantment, planeswalker, instant, sorcery
 */
mtgApp.fetchRandomCard = async (type) => {

  // start a loop
  const MAX_LOOPS = 100;
  let finished = false;
  for (i = 0; !finished && i < MAX_LOOPS; i++) {
    // fetch random card object
    // set request parameter q=type
    await fetch(mtgApp.urls.random)
    .then((response) => {
      return response.json();
    })
    .then((card) => {
      // if card is of desired type, exit loop
      if (card.type_line.includes(type) && card.legalities.commander === "legal") {
        mtgApp.displayCard(card);
        console.log(card.type_line);
        finished = true;
      };
    });
  };
};

mtgApp.displayCard = (card) => {

  console.log(card);
}

cardTypes = [
  "Land",
  "Creature",
  "Artifact",
  "Enchantment",
  "Planeswalker",
  "Instant",
  "Sorcery"
];

for (let type of cardTypes) {
  mtgApp.fetchRandomCard(type);
}

// boop
/* mtgApp.url = new URL ('https://api.scryfall.com/cards/named');
mtgApp.url.search = new URLSearchParams({
    exact: `island`,
});

fetch(mtgApp.url)
  .then((response) => {
    return response.json();
  })
    .then((result) => {
      console.log(result);
    })
 */

// 2. For the relevant cards (creature & planeswalker) grab additional information to be used in accompanying paragraph

// 3. Display cards on page using objects url property as img src and card name and type as alt text
