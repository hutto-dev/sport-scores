// authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database/db"); // Adjust path if necessary

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await db.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT if credentials are correct
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { loginUser };
