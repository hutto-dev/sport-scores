/* 
Retrieving data (SELECT)
const result = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
console.log(result.rows); // this will give you the rows matching the query

inserting data (INSERT)
await db.query(
  "INSERT INTO users (name, email) VALUES ($1, $2)",
  [name, email]
);

Updating data (UPDATE)
await db.query(
  "UPDATE users SET email = $1 WHERE id = $2",
  [newEmail, userId]
);

Deleting Data (DELETE)
await db.query("DELETE FROM users WHERE id = $1", [userId]);
*/

// in production we would use an actual database
// this object will act as temporary storage for our user object

// REVISED CODE FROM CHAT GPT

// userController.js
const db = require("../database/db");

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length) {
      res.status(200).send({ user: result.rows[0] });
    } else {
      res.status(404).send({ error: "No user found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
};

const createUser = async (req, res) => {
  const { id, name, email } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *",
      [id, name, email]
    );
    res.status(201).send({ user: result.rows[0] });
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
};

const updateUser = async (req, res) => {
  const { id, name, email } = req.body;

  try {
    const result = await db.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );
    if (result.rows.length) {
      res.status(200).send({ user: result.rows[0] });
    } else {
      res.status(404).send({ error: "No user found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
};

const removeUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount > 0) {
      res.status(200).send({ message: `User with id: ${id} removed` });
    } else {
      res.status(404).send({ error: "No user found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  removeUser,
};

/*

const EPHEMERAL_DB = {};

const getUser = (req, res, next) => {
  const { id } = req.params;

  if (EPHEMERAL_DB[id]) {
    // a 200 response is sent when things have gone successfully
    res.status(200).send({ user: { id, ...EPHEMERAL_DB[id] } });
  } else {
    // a 400 request means a request has been made that cannot be carried out
    // basically this an error on the user part and their query needs to be modified
    res.status(400).send({ error: "No user found" });
  }
};

const updateUser = (req, res, next) => {
  const { id, name, email } = req.body;

  if (EPHEMERAL_DB[id]) {
    EPHEMERAL_DB[id] = {
      ...EPHEMERAL_DB[id],
      ...{
        name: name || EPHEMERAL_DB[id].name,
        email: email || EPHEMERAL_DB[id].email,
      },
    };
    res.status(200).send({ user: { id, ...EPHEMERAL_DB[id] } });
  } else {
    res.status(400).send({ error: "No user found" });
  }
};

const removeUser = (req, res, next) => {
  const { id } = req.params;

  if (EPHEMERAL_DB[id]) {
    delete EPHEMERAL_DB[id];
    res.status(200).send({ message: `User with id: ${id} removed` });
  } else {
    res.status(400).send({ error: "No user found" });
  }
};

const createUser = (req, res, next) => {
  const { id, name, email } = req.body;

  EPHEMERAL_DB[id] = { name, email };

  res.status(200).send({ user: { id, ...EPHEMERAL_DB[id] } });
};

module.exports = {
  getUser,
  updateUser,
  removeUser,
  createUser,
};
*/
