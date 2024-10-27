fetch("http://localhost:3000/api/game")
  .then((response) => response.json())
  .then((data) => {
    const gameContainer = document.querySelector("game-container");

    // Check if the data is empty
    if (data.length === 0) {
      gameContainer.innerHTML = "<p>No games scheduled.</p>";
      return;
    }

    /* works!

    data.forEach((game) => {
      const scheduleBox = document.querySelectorAll(".schedule-box");
      const teamsSection = document.querySelector(".teams-section");
      const awaySection = document.querySelector(".away-section");
      const homeSection = document.querySelector(".home-section");
      const awayScore = document.querySelector(".away-score");
      const homeScore = document.querySelector(".home-score");
      const infoSection = document.querySelector(".info-section");
      const statusSection = document.querySelector(".status-section");

      awaySection.innerHTML = `
       <p>${game.away_team_name}</p>`;

      homeSection.innerHTML = `
      <p>${game.home_team_name}</p>`;

      awayScore.innerHTML = `
      <p>${game.away_team_score}</p>`;

      homeScore.innerHTML = `
      <p>${game.home_team_score}</p>`;

      gameContainer.appendChild(scheduleBox);
    }); */

    // assigns and selects the white boxes
    const scheduleBoxes = document.querySelectorAll(".schedule-box");

    data.forEach((game, index) => {
      // Ensure we don't exceed the number of pre-defined schedule boxes
      if (index < scheduleBoxes.length) {
        const scheduleBox = scheduleBoxes[index]; // Get the corresponding schedule box

        // Select the inner sections
        const teamsSection = scheduleBox.querySelector(".teams-section");
        const awaySection = scheduleBox.querySelector(".away-section");
        const homeSection = scheduleBox.querySelector(".home-section");
        const awayScore = scheduleBox.querySelector(".away-score");
        const homeScore = scheduleBox.querySelector(".home-score");
        const infoSection = scheduleBox.querySelector(".info-section");
        const statusSection = scheduleBox.querySelector(".status-section");

        // Populate the content for each game
        awaySection.innerHTML = `<p>${game.away_team_name}</p>`;
        homeSection.innerHTML = `<p>${game.home_team_name}</p>`;
        awayScore.innerHTML = `<p>${game.away_team_score}</p>`;
        homeScore.innerHTML = `<p>${game.home_team_score}</p>`;
        infoSection.innerHTML = `
          <p>Date: ${game.game_date}</p>
          <p>Time: ${game.game_time}</p>
        `;
        statusSection.innerHTML = `<i>${game.status}</i>`;
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching schedule:", error);
  });
