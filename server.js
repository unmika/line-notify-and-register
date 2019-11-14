const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(8000, () => {
  console.log("Start server at port 8000");
});

app.post("/sendMessage", (req, res) => {
  axios
    .post("https://notify-api.line.me/api/notify", `message=${req.body.msg}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer urs9r4mRDjzFEwTCET3Ive9XOI0s8kBHPRWYZNWv4qG"
      }
    })
    .then(response => {
      console.log(response);
    });
  res.send("OK");
});
