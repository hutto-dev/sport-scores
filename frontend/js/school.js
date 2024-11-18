document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const schoolId = urlParams.get("schoolId");

  if (!schoolId) {
    console.error("No school ID provided");
    return;
  }

  const token = localStorage.getItem("token");

  fetch(`http://localhost:3000/school/${schoolId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((schoolData) => {
      document.getElementById("schoolName").textContent = schoolData.name;

      const teamsDiv = document.getElementById("teams");
      schoolData.teams.forEach((team) => {
        const teamLink = document.createElement("a");
        teamLink.href = `schedule.html?schoolId=${schoolId}&teamId=${team.id}`;
        teamLink.textContent = team.name;
        teamsDiv.appendChild(teamLink);
        teamsDiv.appendChild(document.createElement("br")); // New line after each team
      });
    })
    .catch((error) => console.error("Error fetching school data:", error));
});
