// fetch('url address') "request data at this API endpoint"
// .then() "when the data comes back successfully, then do this with it"

fetch(
  "https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&format=json"
)
  .then(function (response) {
    // parse the response into JSON
    return response.json();
  })
  // jsonData represents the same thing as 'response' but parsed
  .then(function (jsonData) {
    console.log(jsonData);
    // work with the data from the API
  });

// fetch(url)
//   .then(function(response){
//     return response.json();
//   })
//   .then(function(jsonResponse){
//     console.log(jsonResponse);
//   })

// 1. grab a list of stars from the exoplanet API database
// 2. turn them into html elements on the page
// 3. user chooses a star
// 4. populate the page with the planets of that star
// 5. user chooses a planet or a different star (if different star go back to 4)
// 6. once user chooses planet display list of planet properties (name, distance to star, size, possible atmosphere) in a slick info-box
// 7. user can click out or choose another planet
