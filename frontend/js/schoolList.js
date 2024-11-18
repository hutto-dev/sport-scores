// This isn't strictly necessary for static links, but if you want to populate the list dynamically:

document.addEventListener("DOMContentLoaded", () => {
  // Assume you have an API for fetching schools
  fetch("http://localhost:3000/schools")
    .then((response) => response.json())
    .then((schools) => {
      const schoolsList = document.getElementById("schoolsList");
      schools.forEach((school) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `school.html?schoolId=${school.id}`;
        a.textContent = school.name;
        li.appendChild(a);
        schoolsList.appendChild(li);
      });
    })
    .catch((error) => console.error("Error fetching schools:", error));
});
