// 1. Query the Scryfall API for one random card of each major type

// 2. For the relevant cards (creature & planeswalker) grab additional information to be used in explanation text

// 3. Display cards on page using object url as img src, and card name/type as alt text

const mtgApp = {};

mtgApp.initData = () => {

  // array of card types to display
  mtgApp.cardTypes = [
    "Land",
    "Creature",
    "Artifact",
    "Enchantment",
    "Planeswalker",
    mtgApp.instantOrSorcery()
  ];

  // dictionary of card objects to be populated at runtime from API
  mtgApp.cards = {};

  // API endpoints
  mtgApp.apiUrls = {
    random: 'https://api.scryfall.com/cards/random',
    named: 'https://api.scryfall.com/cards/named',
    bulk: 'https://api.scryfall.com/bulk-data'
  }
};

mtgApp.initFuncs = () => {
  /**
   * @function mtgApp.instantOrSorcery
   * picks between "Instant" and "Sorcery" at random
   * @return {String} either "Instant" or "Sorcery" (50% odds)
   */
  mtgApp.instantOrSorcery = () => {
    const rand = Math.random();
    if (rand >= 0.5) {
      return "Instant";
    }
    return "Sorcery";
  };

  /**
   * tests whether card's type line matches type, and no other supertype
   * @function mtgApp.matchesCardType
   * @param  {String} typeLine  a card's full type line
   * @param  {String} type      a specific type from the cardTypes array
   * @return {boolean}          true if "typeLine" has only the supertype
   *                            specified by "type"
   */
  mtgApp.matchesCardType = (typeLine, type) => {
      const typeRegex = new RegExp(
        `^([(Legendary)(Tribal)] )?${type}( — .+)?$`
      );
      return typeRegex.test(typeLine);
  };

  /* TODO: IMPROVE fetchRandomCard()
  
    make it search for multiple categories at once

    1. get random card
    2. check if it fills any empty categories (types)
    3. if it does, mark that category as filled
    4. repeat steps 1-3 until all categories filled or MAXLOOPS

    optionally: look into slowing our own requests (add 50ms or so)
  */

  /**
   * @function mtgApp.fetchRandomCard
   * queries random mtg cards until it gets one of the specified type
   * @param {String} type can be one of the following words:
   * land, creature, artifact, enchantment, planeswalker, instant, sorcery
   */
  mtgApp.fetchRandomCard = async (type) => {

    // attempt no more than MAX_LOOPS number of fetches
    const MAX_LOOPS = 100;
    let finished = false;
    for (i = 0; !finished && i < MAX_LOOPS; i++) {

      // fetch random card object
      await fetch(mtgApp.apiUrls.random)
      .then((response) => {
        return response.json();
      })
      .then((card) => {
        // if this card is legal and of the specified type, display it and finish the loop
        if (
          mtgApp.matchesCardType(card.type_line, type) && 
          card.legalities.commander === "legal"
        ) {
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

  /**
   * @function mtgApp.displayCard
   * displays a card object on the page
   * @param {Object} card an object representing a card from MtG
   */
  mtgApp.displayCard = (card) => {
    console.log(card, card.type_line);
  };
};

mtgApp.init = () => {
  mtgApp.initFuncs();
  mtgApp.initData();
};

mtgApp.init();

// for (let type of mtgApp.cardTypes) {
//   mtgApp.fetchRandomCard(type);
// };

fetch(mtgApp.apiUrls.bulk)
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
  });