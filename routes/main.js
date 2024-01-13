const express = require('express');
const router = express.Router();
const main = require('../controllers/main');

router.route('/').get(main.renderPage);

module.exports = router;
