const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db.js"); // Adjust path if necessary

// Function to login a user
async function loginUser(req, res) {
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Query the user by username, also retrieve school_id
    const query =
      "SELECT user_id, username, password_hash, school_id FROM users WHERE username = $1";
    const result = await db.query(query, [username]);
    const user = result.rows[0];

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token with school ID
    const token = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        schoolId: user.school_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(200)
      .json({ message: "Login successful", token, schoolId: user.school_id }); // Return schoolId along with token
  } catch (err) {
    console.error("Error logging in:", err.message || err); // Improved logging
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { loginUser };
