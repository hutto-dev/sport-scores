// Function to retrieve school ID from the JWT
function getSchoolIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.schoolId; // Assuming the token contains schoolId
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

async function fetchGames() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Token is missing. Please log in again.");
    return;
  }

  // Extract schoolId from the token
  const schoolId = getSchoolIdFromToken();
  if (!schoolId) {
    console.error("School ID missing from the token.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/games/school/${schoolId}/games`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const games = await response.json();
      console.log("Games fetched successfully:", games);
      if (games.length > 0) {
        populateGamesDropdown(games);
      } else {
        console.warn("No games available for this school.");
      }
    } else {
      const errorData = await response.json();
      console.error(
        "Failed to fetch games:",
        errorData.error || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Error fetching games:", error);
  }
}

// Call fetchGames when the dashboard loads
document.addEventListener("DOMContentLoaded", fetchGames);

// Function to format date from ISO string to MM/DD/YY
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
}

// Function to populate the games dropdown with team names
function populateGamesDropdown(games) {
  const gameSelect = document.getElementById("gameSelect");
  gameSelect.innerHTML = ""; // Clear existing options

  // Sort games by date
  games.sort((a, b) => new Date(a.date) - new Date(b.date));

  games.forEach((game) => {
    const option = document.createElement("option");
    option.value = game.game_id;

    // Use the actual team names here
    const awayTeamName = game.away_team_name || "Unknown Team";
    const homeTeamName = game.home_team_name || "Unknown Team";

    // Set the option text with formatted date and team names
    option.textContent = `${formatDate(
      game.date
    )} - ${homeTeamName} vs ${awayTeamName}`;
    gameSelect.appendChild(option);
  });
}

// Handle score submission
document
  .getElementById("scoreForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const scoreData = {
      gameId: formData.get("gameSelect"), // Get selected game ID
      homeScore: parseInt(formData.get("homeScore")), // Ensure scores are integers
      awayScore: parseInt(formData.get("awayScore")),
    };

    // Quick check for valid score inputs
    if (isNaN(scoreData.homeScore) || isNaN(scoreData.awayScore)) {
      alert("Please enter valid scores for both teams.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/games/report", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scoreData),
      });

      const responseData = await response.json();
      const messageDiv = document.getElementById("responseMessage");

      if (response.ok) {
        messageDiv.textContent =
          responseData.message || "Score reported successfully!";
        messageDiv.style.color = "green";
      } else {
        messageDiv.textContent =
          responseData.error || "Failed to submit score. Please try again.";
        messageDiv.style.color = "red";
        console.error(
          "Failed to submit score:",
          responseData.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error submitting score:", error);
      document.getElementById("responseMessage").textContent =
        "Network error. Please try again.";
      document.getElementById("responseMessage").style.color = "red";
    }
  });

// Logging token and school ID for debugging purposes
console.log("Token:", localStorage.getItem("token"));
console.log("School ID:", localStorage.getItem("schoolId"));
