const token = localStorage.getItem("token");

if (!token) {
  console.error("No token found!");
  // Handle no token scenario, maybe redirect to login page
  window.location = "/frontend/login.html"; // Redirect to login if no token
}

fetch("http://localhost:3000/games/team/8/games", {
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
    return response.json();
  })
  .then((data) => {
    const scheduleBoxes = document.querySelectorAll(".schedule-box");

    data.forEach((game, index) => {
      if (index < scheduleBoxes.length) {
        const scheduleBox = scheduleBoxes[index];

        // Away Team
        scheduleBox.querySelector(
          ".away-logo img"
        ).src = `../css/images/logo-${game.away_team_name
          .split(" ")
          .join("")
          .toLowerCase()}.png`; // Assuming the image filename is based on team name
        scheduleBox.querySelector(".away-name").textContent =
          game.away_team_name;
        scheduleBox.querySelector(".away-score").textContent =
          game.away_score || "TBD";

        // Home Team
        scheduleBox.querySelector(
          ".home-logo img"
        ).src = `../css/images/logo-${game.home_team_name
          .split(" ")
          .join("")
          .toLowerCase()}.png`; // Similar assumption for home team
        scheduleBox.querySelector(".home-name").textContent =
          game.home_team_name;
        scheduleBox.querySelector(".home-score").textContent =
          game.home_score || "TBD";

        // Game Info
        scheduleBox.querySelector(
          ".info-date"
        ).textContent = `Date: ${game.date}`;
        scheduleBox.querySelector(
          ".info-location"
        ).textContent = `Location: ${game.location}`;
        scheduleBox.querySelector(".info-status").textContent = `Status: ${
          game.home_score !== null && game.away_score !== null
            ? "Final"
            : "Scheduled"
        }`;
      }
    });

    // Hide any remaining boxes if there are fewer games than boxes
    for (let i = data.length; i < scheduleBoxes.length; i++) {
      scheduleBoxes[i].style.display = "none";
    }
  })
  .catch((error) => {
    console.error("Error fetching schedule:", error);
    // Optionally, show an error message to the user in your HTML
  });
