async function fetchGameData(gameId) {
  try {
    const response = await fetch(`http://localhost:3000/api/game/${gameId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Update the HTML with the fetched data
    document.getElementById("home-team").textContent =
      data.home_team_name || "N/A";
    document.getElementById("away-team").textContent =
      data.away_team_name || "N/A";
    document.getElementById("score").textContent = data.score || "N/A";
    document.getElementById("date").textContent = data.date || "N/A";
  } catch (error) {
    console.error("Error fetching game:", error);
    // Handle the error appropriately
  }
}

// Fetch game data for game ID 1 on page load
fetchGameData(1);
