const router        = require('express').Router();
const scrapeRoutes  = require('./scrapeRoutes');


router.use('/scrape', scrapeRoutes);


module.exports = router;