const express = require("express");
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/", (req, res) => {
  res.send("connected to BE");
});

app.get("/auth/slack", (req, res) => {
  const url = `https://slack.com/oauth/v2/authorize?scope=identity.basic&client_id=${process.env.SLACK_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`;
  try {
    res.redirect(url);
  } catch (error) {
    console.log(error);
  }
});

app.get("/auth/slack/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post("https://slack.com/api/oauth.v2.access", {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI,
    });
    const { access_token } = response.data.authed_user;
    // Here you can use the access token to get user information and handle login
    // Redirect to the frontend with the necessary information or tokens

    console.log(response);

    res.status(200).json(response);
    //
  } catch (error) {
    res.status(500).send("Authentication Failed");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
