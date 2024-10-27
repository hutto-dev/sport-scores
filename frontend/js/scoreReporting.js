document.addEventListener("DOMContentLoaded", async () => {
  const gameSelect = document.getElementById("game");
  const scoreForm = document.getElementById("scoreForm");
  const responseMessage = document.getElementById("responseMessage");

  // Fetch all games for the dropdown
  try {
    const gamesResponse = await fetch("http://localhost:3000/games"); // Endpoint to get all games
    const games = await gamesResponse.json();

    games.forEach((game) => {
      const option = document.createElement("option");
      option.value = game.id;
      option.textContent = `${game.away_team} vs ${game.home_team}`;
      gameSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading games:", error);
  }

  // Handle form submission
  scoreForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const gameId = gameSelect.value;
    const homeScore = document.getElementById("homeScore").value;
    const awayScore = document.getElementById("awayScore").value;

    try {
      const response = await fetch("http://localhost:3000/scores/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, homeScore, awayScore }),
      });

      const data = await response.json();
      responseMessage.textContent =
        data.message || "Score reported successfully!";
    } catch (error) {
      responseMessage.textContent = "Error reporting score.";
      console.error("Error during score reporting:", error);
    }
  });
});

async function fetchGames(schoolId) {
  try {
    const response = await fetch(
      `http://localhost:3000/reports/${schoolId}/games`
    ); // Replace with the actual school ID as needed
    const games = await response.json();

    const gameSelect = document.getElementById("game");
    gameSelect.innerHTML = ""; // Clear existing options

    games.forEach((game) => {
      const option = document.createElement("option");
      option.value = game.game_id; // Use the game's ID
      option.textContent = `${game.home_team_name} vs ${game.away_team_name}`; // Display game names
      gameSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

// Call the function with the appropriate school ID
document.addEventListener("DOMContentLoaded", () => {
  const schoolId = 1; // Change this to the actual school ID
  fetchGames(schoolId);
});

document.getElementById("scoreForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent the default form submission

  const gameId = document.getElementById("game").value;
  const homeScore = document.getElementById("homeScore").value;
  const awayScore = document.getElementById("awayScore").value;

  try {
    const response = await fetch("http://localhost:3000/reports/report", {
      // Adjust the URL as necessary
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, homeScore, awayScore }),
    });

    const result = await response.json();
    document.getElementById("responseMessage").textContent = result.message;
  } catch (error) {
    console.error("Error reporting score:", error);
    document.getElementById("responseMessage").textContent =
      "Failed to report score.";
  }
});
