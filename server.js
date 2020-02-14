const express = require("express");
const logger = require("morgan");

const axios = require("axios");
const cheerio = require("cheerio");


const PORT = process.env.PORT || 3002;


const app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.lotterycritic.com/lottery-results/arizona/#results").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    let data = []
    // Now, we grab every h2 within an article tag, and do the following:
    $("table.lotteryResultsTable tbody tr").each(function(i, element) {
      // Save an empty result object
        var result = {
            name: "",
            winningNumbers : [],
            nextDrawDate : ""
        }
        // Add the text and href of every link, and save them as properties of the result object
        result.name = $(this)
            .children("td.lotteryResultsTable-game")
            .children('a')
            .text();
        
        $(this)
            .children("td.lotteryResultsTable-result")
            .children('dl')
            .children('div.lotteryResultsTable-regular')
            .children('dd').each(function(i, element){
                result.winningNumbers.push($(this).text())
            });  

        result.nextDrawDate = $(this)
            .children("td.lotteryResultsTable-details")
            .children('dl')
            .children('div.lotteryResultsTable-details-dates')
            .children('div.lotteryResultsTable-details-nextDraw')
            .children('dd')
            .children('time')
            .text(); 
        result.lastDrawDate = $(this)
            .children("td.lotteryResultsTable-details")
            .children('dl')
            .children('div.lotteryResultsTable-details-dates')
            .children('div.lotteryResultsTable-details-lastDraw')
            .children('dd')
            .children('time')
            .text()
        
    //   result.link = $(this)
    //     .children("a")
    //     .attr("href");
      // Create a new Article using the `result` object built from scrapin
      data.push(result)
    });

    // Send a message to the client
    res.json({data: data});
  });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT );
});
