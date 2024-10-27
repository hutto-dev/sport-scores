document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  console.log("loginform:", loginForm);
  if (loginForm) {
    // Check if loginForm exists
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Login failed:", error);
          alert(error.error || "Login failed!");
          return;
        }

        const data = await response.json();
        console.log("Login successful:", data);

        // Redirect to dashboard
        window.location.href = "userDashboard.html"; // Change to your dashboard page
      } catch (error) {
        console.error("Error during login:", error);
      }
    });
  } else {
    console.error("Login form not found!");
  }
});
