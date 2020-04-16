const express = require("express");
const logger = require("morgan");



const PORT = process.env.PORT || 3002;


const app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const routes = require("./routes");
app.use(routes);





app.listen(PORT, function() {
  console.log("App running on port " + PORT );
});