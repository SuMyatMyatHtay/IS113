const express = require("express");
const router = express.Router();

// ADD YOUR CODE BELOW

router.get('/watchlist', (req, res) => {
  const user = JSON.parse(decodeURIComponent(req.query.data));
  res.render('watchlist', { user });
});


// END OF ADDING YOUR CODE

module.exports = router;