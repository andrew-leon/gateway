// 1. Query the Scryfall API for one random card of each of the following types
// 	- Land
// 	- Creature
// 	- Artifact
// 	- Enchantment
// 	- Planeswalker
// 	- Instant or Sorcery

const mtgApp = {};

mtgApp.url = new URL ('https://api.scryfall.com/cards/search');
mtgApp.url.search = new URLSearchParams({
  q: `island`
});

fetch(mtgApp.url)
  .then((response) => {
    return response.json()
  })
    .then((result) => {
      console.log(result.data);
    })


// 2. For the relevant cards (creature & planeswalker) grab additional information to be used in accompanying paragraph

// 3. Display cards on page using objects url property as img src and card name and type as alt text
