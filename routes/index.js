const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const Customer = require('../models/customer');
const TransactionHistory = require('../models/transactionHistory');

let asyncErrorHandler = (fn) =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});


/* GET Transaction History page. */
router.get('/thistory', asyncErrorHandler(
  async function (req, res, next) {
    let transactions = await TransactionHistory.find().sort( { date:-1 } );
    res.render('transaction_history', { transactions });
  }
));

/* GET Transfer page. */
router.get('/transfer', function (req, res, next) {
  let sender = req.query.sender || "";
  let receiver = req.query.receiver || "";
  res.render('transfer', { sender, receiver});
});

/* POST Transfer page. */
router.post('/transfer', asyncErrorHandler(
  async function (req, res, next) {

    // find sender and receiver
    let sender = await Customer.find({ $or: [{ accountNo: req.body.sender }, { email: req.body.sender }] });
    let receiver = await Customer.find({ $or: [{ accountNo: req.body.receiver }, { email: req.body.receiver }] });
    sender = sender[0], receiver = receiver[0];
    
    // make transaction if possible
    if (sender && receiver) {
      if (req.body.amount <= 0) {
        req.session.error = "Insert Positive Amount !";
        res.redirect(`/transfer?sender=${req.body.sender}&receiver=${req.body.receiver}`);
      }
      else if (sender.balance < req.body.amount) {
        req.session.error = "Insufficient Amount !";
        res.redirect(`/transfer?sender=${req.body.sender}&receiver=${req.body.receiver}`);
      }
      else {
        let amount = Number(req.body.amount);
        sender.balance -= amount;
        receiver.balance += amount;
        
        await Customer.findByIdAndUpdate(sender._id, sender);
        await Customer.findByIdAndUpdate(receiver._id, receiver);

        // Add transaction into transaction history table
        let newTransaction = {
          transactionId : uniqid(Date.now()),
          senderName : sender.name,
          receiverName : receiver.name,
          date : new Date(),
          amount :  amount
        }

        let transaction = await TransactionHistory.create(newTransaction);
        await transaction.save();

        req.session.success = "Money Transfered Sucessfully !";
        res.redirect('/thistory');
      }
    }
    else {
      req.session.error = "Invalid Sender's Or Receiver's detail !";
      res.redirect(`/transfer?sender=${req.body.sender}&receiver=${req.body.receiver}`);
    }

  }
));

module.exports = router;
