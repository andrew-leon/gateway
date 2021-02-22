// I got tired of copy-pasting "—" over and over
// on an unrelated note, doesn't it look like a face? kinda cute tbh
const dash = "—";

/**
 * returns true if a card has exactly one supertype, and it is of the specified type
 * intended to avoid multiple supertypes, e.g. "Artifact Creature"
 * @param {string} typeLine a card's full type line
 * @param {string} type a specific type from the cardTypes array
 */
function matchesCardType(typeLine, type) {

    /* Regex Breakdown
    ^               beginning of string
    (Legendary )    the substring "Legendary "
    ?               means "occuring 0 or 1 times"
    .               means "any character"
    +               means "occuring 1 or more times"
    $               end of string

    this regular expression will match a string that:
    - begins with "Legendary ${type}", or just "${type}", followed by...
    - the end of the string, with optionally...
    - " — " followed by at least one character

    */
    const typeRegex = new RegExp(`^(Legendary )?${type}( ${dash} .+)?$`);

    return typeRegex.test(typeLine);
};

// shitty "unit testing" for matchesCardType

const type = "Land";
const tests = [

    {str:`Land`,res:true},
    {str:`Land ${dash} Basic Forest`,res:true},
    {str:`Land ${dash} Island`,res:true},
    {str:`Legendary Land`,res:true},
    {str:`Legendary Land ${dash} Swamp`,res:true},
    {str:`Artifact Land`,res:false},
    {str:`Artifact Land ${dash} Plains`,res:false},
    {str:`Legendary Artifact Land`,res:false},
    {str:`Land Creature`, res:false}
];

let result;

for (let test of tests) {
    result = matchesCardType(test.str, type);
    console.log(
`test: ${test.str}
result: ${result}`
    );
    if (result !== test.res) console.log("!!!");
}