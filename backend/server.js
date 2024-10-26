// I'm doing this first but i dont know if this is right. Started node.js and express with help of chatgpt...then this

// assigning express app (require is a node.js function used to load modules)
const express = require("express");

// assigning body-parser that helps break down code into readable json code
const bodyParser = require("body-parser");

// assigning all Routes ?
const allRoutes = require("./routes");

// assigning cors which is that get,post, thing i think ?
const cors = require("cors");

// grabbing config only from dotenv to use
const { config } = require("dotenv");

//loads environment vars from .env
config();

// start the app and listen for requests on the port
const app = express();
const port = process.env.PORT || 3000;

// if the port isn't on test mode, run on assigned port or 3000 by default
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Running on port ${port}`));
}

// using cors library to prevent annoying cors issues
app.use(cors());

// allows us to get the info requested in json format - very important for post requests so we can read it!
app.use(bodyParser.json());

// lets us load all our routes and start making requests
app.use(allRoutes);

module.exports = { app };
