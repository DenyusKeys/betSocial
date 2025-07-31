// A dictionary mapping each sport to list of teams
const teamsBySport = {
    Baseball: [
    // American League - East
    "Baltimore Orioles",
    "Boston Red Sox",
    "New York Yankees",
    "Tampa Bay Rays",
    "Toronto Blue Jays",

    // American League - Central
    "Chicago White Sox",
    "Cleveland Guardians",
    "Detroit Tigers",
    "Kansas City Royals",
    "Minnesota Twins",

    // American League - West
    "Houston Astros",
    "Los Angeles Angels",
    "Oakland Athletics",
    "Seattle Mariners",
    "Texas Rangers",

    // National League - East
    "Atlanta Braves",
    "Miami Marlins",
    "New York Mets",
    "Philadelphia Phillies",
    "Washington Nationals",

    // National League - Central
    "Chicago Cubs",
    "Cincinnati Reds",
    "Milwaukee Brewers",
    "Pittsburgh Pirates",
    "St. Louis Cardinals",

    // National League - West
    "Arizona Diamondbacks",
    "Colorado Rockies",
    "Los Angeles Dodgers",
    "San Diego Padres",
    "San Francisco Giants"
  ],
  Basketball: [
    // Eastern Conference - Atlantic Division
    "Boston Celtics",
    "Brooklyn Nets",
    "New York Knicks",
    "Philadelphia 76ers",
    "Toronto Raptors",

    // Eastern Conference - Central Division
    "Chicago Bulls",
    "Cleveland Cavaliers",
    "Detroit Pistons",
    "Indiana Pacers",
    "Milwaukee Bucks",

    // Eastern Conference - Southeast Division
    "Atlanta Hawks",
    "Charlotte Hornets",
    "Miami Heat",
    "Orlando Magic",
    "Washington Wizards",

    // Western Conference - Northwest Division
    "Denver Nuggets",
    "Minnesota Timberwolves",
    "Oklahoma City Thunder",
    "Portland Trail Blazers",
    "Utah Jazz",

    // Western Conference - Pacific Division
    "Golden State Warriors",
    "Los Angeles Clippers",
    "Los Angeles Lakers",
    "Phoenix Suns",
    "Sacramento Kings",

    // Western Conference - Southwest Division
    "Dallas Mavericks",
    "Houston Rockets",
    "Memphis Grizzlies",
    "New Orleans Pelicans",
    "San Antonio Spurs"
  ],
  Hockey: [
    // Eastern Conference - Atlantic Division
    "Boston Bruins",
    "Buffalo Sabres",
    "Detroit Red Wings",
    "Florida Panthers",
    "Montreal Canadiens",
    "Ottawa Senators",
    "Tampa Bay Lightning",
    "Toronto Maple Leafs",

    // Eastern Conference - Metropolitan Division
    "Carolina Hurricanes",
    "Columbus Blue Jackets",
    "New Jersey Devils",
    "New York Islanders",
    "New York Rangers",
    "Philadelphia Flyers",
    "Pittsburgh Penguins",
    "Washington Capitals",

    // Western Conference - Central Division
    "Arizona Coyotes",
    "Chicago Blackhawks",
    "Colorado Avalanche",
    "Dallas Stars",
    "Minnesota Wild",
    "Nashville Predators",
    "St. Louis Blues",
    "Winnipeg Jets",

    // Western Conference - Pacific Division
    "Anaheim Ducks",
    "Calgary Flames",
    "Edmonton Oilers",
    "Los Angeles Kings",
    "San Jose Sharks",
    "Seattle Kraken",
    "Vancouver Canucks",
    "Vegas Golden Knights"
  ],
  Football: [
    // AFC East
    "Buffalo Bills",
    "Miami Dolphins",
    "New England Patriots",
    "New York Jets",

    // AFC North
    "Baltimore Ravens",
    "Cincinnati Bengals",
    "Cleveland Browns",
    "Pittsburgh Steelers",

    // AFC South
    "Houston Texans",
    "Indianapolis Colts",
    "Jacksonville Jaguars",
    "Tennessee Titans",

    // AFC West
    "Denver Broncos",
    "Kansas City Chiefs",
    "Las Vegas Raiders",
    "Los Angeles Chargers",

    // NFC East
    "Dallas Cowboys",
    "New York Giants",
    "Philadelphia Eagles",
    "Washington Commanders",

    // NFC North
    "Chicago Bears",
    "Detroit Lions",
    "Green Bay Packers",
    "Minnesota Vikings",

    // NFC South
    "Atlanta Falcons",
    "Carolina Panthers",
    "New Orleans Saints",
    "Tampa Bay Buccaneers",

    // NFC West
    "Arizona Cardinals",
    "Los Angeles Rams",
    "San Francisco 49ers",
    "Seattle Seahawks"
  ]
};

function showTeams() {
    const sportSelected = document.getElementById("sport"); //Grabs the sport dropdown list
    const teamSelected = document.getElementById("team"); //Grabs the team dropdown list
    const sport = sportSelected.value;  //Get selected sport

    //Clear current team options
    teamSelected.innerHTML = '';

    //If sport has team options, populate the dropdown
    if(teamsBySport[sport]) {
        teamsBySport[sport].forEach(team => { 
            const option = document.createElement("option"); //Create option element for dropdown
            option.value = team;                             //Set the value
            option.textContent = team;                       //Show the team text
            teamSelected.appendChild(option);                //Add option to drowdown list
        });
    }
}

//Run function when profile loads
//window.onload = showTeams;

// Attach event listener after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sport").addEventListener("change", showTeams); //When the sport changes, fires the showTeams()
  showTeams(); // Initialize on page load
});