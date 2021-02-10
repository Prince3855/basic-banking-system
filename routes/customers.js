const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

let asyncErrorHandler = (fn) =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

/* GET customers page. */
router.get('/', asyncErrorHandler(
    async function(req, res, next) {

        let customers = await Customer.find();
        res.render('customers', { customers });
    }
));

/* GET profile page. */
router.get('/:id', asyncErrorHandler(
    async function(req, res, next) {
        let customer = await Customer.findById(req.params.id);
        res.render('detail', { customer });
    }
));


module.exports = router;
