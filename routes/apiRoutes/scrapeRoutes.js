const router = require('express').Router();
const scrapeController = require("./../../controllers/scrapeCrontroller")

router.route("/pop")
    .get(scrapeController.pop)

module.exports = router