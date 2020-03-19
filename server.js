const express = require("express");
const logger = require("morgan");
// const axios = require("axios");
const PORT = process.env.PORT || 3002;
const request = require("request");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



app.post("/", async (req, res) => {
  const options = {
    method: "POST",
    url: "https://api.shipengine.com/v1/rates",
    headers: {
      Host: process.env.Host,
      "API-Key": process.env.API_Key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rate_options: { carrier_ids: ["se-196101", "se-196102"] },
      service_codes:["ups_next_day_air_early_am", "fedex_priority_overnight"],
      shipment: {
        validate_address: "no_validation",
        ship_to: {
          name: "Amanda Miller",
          phone: "555-555-5555",
          address_line1: "2133 Parker Street Unit 1",
          city_locality: "Berkeley",
          state_province: "CA",
          postal_code: "94704",
          country_code: "US",
          address_residential_indicator: "yes"
        },
        ship_from: {
          company_name: "Example Corp.",
          name: "John Doe",
          phone: "111-111-1111",
          address_line1: "1508 Walnut Street",
          city_locality: "Berkeley",
          state_province: "CA",
          postal_code: "94704",
          country_code: "US",
          address_residential_indicator: "no"
        },
        packages: [{ weight: { value: 1, unit: "ounce" } }],
      }
    })
  };
  try {
    request(options, (err, data) => {
      if (err) throw err;
      else {
        const dataBody = JSON.parse(data.body);
        console.log(dataBody.rate_response.rates);
        res.send(dataBody.rate_response.rates);
      }
    });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});
app.get("/carriers", async (req, res) => {
  var options = {
    method: "GET",
    url: "https://api.shipengine.com/v1/carriers",
    headers: {
      Host: "api.shipengine.com",
      "API-Key": process.env.API_Key
    }
  };
  try {
    request(options, function(error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      res.send(response.body + "this is body");
    });
  } catch (e) {
    res.send(e + "this is error");
  }
});

app.get("/rates", async(req, res) => {
  
  var options = {
    'method': 'POST',
    'url': 'https://api.shipengine.com/v1/shipments/se-2102034/rates',
    'headers': {
      'Host': 'api.shipengine.com',
      'API-Key': process.env.API_Key
    }
  };
  request(options, function (error, response) { 
    if (error) {
      console.log(error)
      return res.send(error)
    }
    console.log(response.body);
    res.send(response.body)
  });
})

app.get("/sample", async (req, res) => {

  var options = {
    'method': 'GET',
    'url': 'https://api.shipengine.com/v1/carriers',
    'headers': {
      'API-Key': process.env.API_Key
    }
  };
  request(options, function (error, response) { 
    if (error) {
      console.log(error)
      return res.send(error)
    }
    console.log(response.body);
    res.send(response.body)
  });

})

app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
