const express = require('express');
const {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboard,
  getReports,
  searchTransactions,
} = require('../controllers/transactionController');

const router = express.Router();

router.get('/transactions', getTransactions);
router.get('/transactions/:id', getTransactionById);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.get('/dashboard', getDashboard);
router.get('/reports', getReports);
router.get('/search', searchTransactions);

module.exports = router;
