const router      = require('express').Router();
const scrapeRoutes  = require('./scrapeRoutes');
// / api prepended to these routes


router.use('/scrape', scrapeRoutes);


module.exports = router;