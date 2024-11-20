document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const teamId = urlParams.get("teamId") || "None";
  console.log("URL teamId:", teamId);

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found!");
    window.location = "/frontend/login.html";
    return;
  }

  const teamIdToName = {
    1: "Charles Town Varsity Girls Basketball",
    2: "Harpers Ferry Varsity Girls Basketball",
    3: "Shepherdstown Varsity Girls Basketball",
    4: "Wildwood Varsity Girls Basketball",
    5: "Hedgesville Varsity Girls Basketball",
    6: "North Varsity Girls Basketball",
    7: "Mountain Ridge Varsity Girls Basketball",
    8: "Musselman Varsity Girls Basketball",
    9: "CTMS Varsity Girls Basketball",
    10: "Spring Mills Varsity Girls Basketball",
    // ... Add more mappings as needed
  };

  let teamName = teamIdToName[teamId] || "Unknown Team";
  document.querySelector("#dynamicTitle").textContent = teamName;

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
      return response.json();
    })
    .then((data) => {
      const scheduleBoxes = document.querySelectorAll(".schedule-box");

      if (data.length > 0) {
        console.log("Resolved team name:", teamName);

        data.forEach((game, index) => {
          if (index < scheduleBoxes.length) {
            const scheduleBox = scheduleBoxes[index];
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
            // Format date to mm/dd/yy
            if (game.date) {
              const date = new Date(game.date);
              const formattedDate = `${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}/${date
                .getDate()
                .toString()
                .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
              scheduleBox.querySelector(
                ".info-date"
              ).textContent = `${formattedDate}`;
            } else {
              scheduleBox.querySelector(".info-date").textContent = "Date: TBD";
            }

            scheduleBox.querySelector(".info-location").textContent = `${
              game.location || "TBD"
            }`;
            scheduleBox.querySelector(".info-status").textContent = `${
              game.home_score !== null && game.away_score !== null
                ? "Scheduled"
                : game.date
                ? "Scheduled"
                : "TBD"
            }`;
          }
        });

        for (let i = data.length; i < scheduleBoxes.length; i++) {
          scheduleBoxes[i].style.display = "none";
        }
      } else {
        document.querySelector("#dynamicTitle").textContent =
          "No Games Scheduled";
      }
    })
    .catch((error) => {
      console.error("Error fetching schedule:", error);
    });
});
