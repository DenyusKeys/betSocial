const fetch = require("node-fetch");

    async function getBaseballGames() {
      const url = "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=20250805";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();
        return result; // return data so it can be used in render
      } catch (error) {
        console.error("Fetch error:", error.message);
        return null; // fallback in case of error
      }
    }

module.exports = getBaseballGames;