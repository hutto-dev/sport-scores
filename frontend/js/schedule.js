document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get("teamId") || "8"; // Default to '8' if no teamId is provided

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found!");
    window.location = "/frontend/login.html"; // Redirect to login if no token
    return;
  }

  fetch(`http://localhost:3000/games/team/${teamId}/games`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Response Headers:", response.headers);
      console.log(
        "Response Content Type:",
        response.headers.get("content-type")
      );
      return response.json();
    })
    .then((data) => {
      console.log("Data Object:", data);
      const scheduleBoxes = document.querySelectorAll(".schedule-box");

      data.forEach((game, index) => {
        if (index < scheduleBoxes.length) {
          const scheduleBox = scheduleBoxes[index];

          // Handle cases where abbreviation might be undefined
          const awayAbbreviation =
            game.away_team_abbreviation || game.away_team_name || "default";
          const homeAbbreviation =
            game.home_team_abbreviation || game.home_team_name || "default";

          // Away Team
          scheduleBox.querySelector(
            ".away-logo img"
          ).src = `../css/images/logo-${awayAbbreviation.toLowerCase()}.png`;
          scheduleBox.querySelector(".away-name").textContent =
            game.away_team_name || "Unknown Team";
          scheduleBox.querySelector(".away-score").textContent =
            game.away_score || "TBD";

          // Home Team
          scheduleBox.querySelector(
            ".home-logo img"
          ).src = `../css/images/logo-${homeAbbreviation.toLowerCase()}.png`;
          scheduleBox.querySelector(".home-name").textContent =
            game.home_team_name || "Unknown Team";
          scheduleBox.querySelector(".home-score").textContent =
            game.home_score || "TBD";

          // Game Info
          scheduleBox.querySelector(".info-date").textContent = `Date: ${
            game.date || "TBD"
          }`;
          scheduleBox.querySelector(
            ".info-location"
          ).textContent = `Location: ${game.location || "TBD"}`;
          scheduleBox.querySelector(".info-status").textContent = `Status: ${
            game.home_score !== null && game.away_score !== null
              ? "Final"
              : game.date
              ? "Scheduled"
              : "TBD"
          }`;
        }
      });

      // Handle team name for dynamic title if it's part of the game object or if you have an alternative method to get it
      if (data.length > 0) {
        document.getElementById("dynamicTitle").textContent =
          data[0].home_team_name || data[0].away_team_name || "Unknown Team";
      } else {
        console.log("No games found to set the team name.");
        document.getElementById("dynamicTitle").textContent =
          "No Games Scheduled";
      }

      // Hide unused schedule boxes if there are fewer games than boxes
      for (let i = data.length; i < scheduleBoxes.length; i++) {
        scheduleBoxes[i].style.display = "none";
      }
    })
    .catch((error) => {
      console.error("Error fetching schedule:", error);
    });
});
