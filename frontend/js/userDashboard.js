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

// Function to populate the games dropdown
function populateGamesDropdown(games) {
  const gameSelect = document.getElementById("gameSelect");
  gameSelect.innerHTML = ""; // Clear existing options

  games.forEach((game) => {
    const option = document.createElement("option");
    option.value = game.game_id; // Use your actual game ID
    option.textContent = `${game.home_team_name} vs ${game.away_team_name} on ${game.date}`;
    gameSelect.appendChild(option);
  });
}

/*
// Handle score submission
document
  .getElementById("scoreForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const scoreData = {
      gameId: formData.get("gameSelect"), // Get selected game ID
      homeScore: formData.get("homeScore"), // Get home score input
      awayScore: formData.get("awayScore"), // Get away score input
    };

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
      messageDiv.textContent = responseData.message;

      if (response.ok) {
        messageDiv.style.color = "green";
      } else {
        messageDiv.style.color = "red";
        console.error(
          "Failed to submit score:",
          responseData.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  }); */

console.log("Token:", localStorage.getItem("token"));
console.log("School ID:", localStorage.getItem("schoolId"));
