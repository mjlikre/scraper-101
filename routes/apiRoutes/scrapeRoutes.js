const router = require('express').Router();
const scrapeController = require("./../../controllers/scrapeCrontroller")

router.route("/pop")
    .post(scrapeController.pop)

module.exports = router