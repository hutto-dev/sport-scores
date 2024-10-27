// WORKS!
/* fetch("http://localhost:3000/api/schedule")
  .then((response) => response.json())
  .then((data) => {
    const scheduleContainer = document.getElementById("schedule-container");

    // Check if the data is empty
    if (data.length === 0) {
      scheduleContainer.innerHTML = "<p>No games scheduled.</p>";
      return;
    }

    // Iterate through the schedule data and create HTML elements for each game
    data.forEach((game) => {
      const gameDiv = document.createElement("div");
      gameDiv.className = "game-square"; // Add a class for styling
      gameDiv.innerHTML = `
       <h3>${game.opponent}</h3>
       <p>Date: ${game.game_date}</p>
       <p>Location: ${game.location}</p>
     `;
      scheduleContainer.appendChild(gameDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching schedule:", error);
  }); */

// this works too but for games
fetch("http://localhost:3000/api/game")
  .then((response) => response.json())
  .then((data) => {
    const gameContainer = document.getElementById("game-container");

    // Check if the data is empty
    if (data.length === 0) {
      gameContainer.innerHTML = "<p>No games scheduled.</p>";
      return;
    }

    // Iterate through the game data and create HTML elements for each game

    data.forEach((game) => {
      const gameDiv = document.createElement("div");
      gameDiv.className = "game-square"; // Add a class for styling
      gameDiv.innerHTML = `
       <p>Away Team: ${game.away_team_name}</p>
        <p>Home Team: ${game.home_team_name}</p>
       <p>Date: ${game.game_date}</p>
       <p>Time: ${game.game_time}</p>
       <P> ${game.status}</p>
     `;
      gameContainer.appendChild(gameDiv);
    });
  })
  .catch((error) => {
    console.error("Error fetching schedule:", error);
  });
