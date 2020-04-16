const express = require("express");
const logger = require("morgan");

const PORT = process.env.PORT || 3002;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://themicro.market"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const routes = require("./routes");
app.use(routes);

app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});
