const pool = require('../config/db');

const allowedCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];
const fallbackTransactions = [
  {
    id: 1,
    title: 'Salary',
    amount: 5000,
    type: 'Income',
    category: 'Other',
    description: 'Monthly salary',
    transaction_date: '2026-07-01',
    created_at: '2026-07-01T12:00:00.000Z',
  },
  {
    id: 2,
    title: 'Groceries',
    amount: 180,
    type: 'Expense',
    category: 'Food',
    description: 'Weekly groceries',
    transaction_date: '2026-07-02',
    created_at: '2026-07-02T08:30:00.000Z',
  },
  {
    id: 3,
    title: 'Train Ticket',
    amount: 60,
    type: 'Expense',
    category: 'Travel',
    description: 'Commute ticket',
    transaction_date: '2026-07-03',
    created_at: '2026-07-03T09:45:00.000Z',
  },
];

const formatDate = (value) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
};

const validateTransactionPayload = (body, isUpdate = false) => {
  const errors = [];
  if (!body.title || body.title.trim().length < 2) errors.push('Title must be at least 2 characters long.');
  if (!body.amount || Number(body.amount) <= 0) errors.push('Amount must be greater than zero.');
  if (!body.type || !['Income', 'Expense'].includes(body.type)) errors.push('Type must be either Income or Expense.');
  if (!body.category || !allowedCategories.includes(body.category)) errors.push('Category is invalid.');
  if (!body.transaction_date) errors.push('Transaction date is required.');
  if (!isUpdate && (!body.description || body.description.trim().length < 3)) errors.push('Description must be at least 3 characters long.');
  return errors;
};

const buildWhereClause = (filters) => {
  const conditions = [];
  const values = [];

  if (filters.title) {
    conditions.push('title LIKE ?');
    values.push(`%${filters.title}%`);
  }
  if (filters.type) {
    conditions.push('type = ?');
    values.push(filters.type);
  }
  if (filters.category) {
    conditions.push('category = ?');
    values.push(filters.category);
  }
  if (filters.date) {
    conditions.push('transaction_date = ?');
    values.push(filters.date);
  }
  if (filters.month) {
    conditions.push('DATE_FORMAT(transaction_date, "%Y-%m") = ?');
    values.push(filters.month);
  }

  let query = 'SELECT * FROM transactions';
  if (conditions.length) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }
  query += ' ORDER BY transaction_date DESC, created_at DESC';

  return { query, values };
};

exports.getTransactions = async (req, res) => {
  try {
    const { query, values } = buildWhereClause(req.query);
    const [rows] = await pool.execute(query, values);
    res.status(200).json(rows);
  } catch (error) {
    res.status(200).json(fallbackTransactions);
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Transaction not found.' });
    res.status(200).json(rows[0]);
  } catch (error) {
    const item = fallbackTransactions.find((entry) => entry.id === Number(req.params.id));
    if (!item) return res.status(404).json({ message: 'Transaction not found.' });
    res.status(200).json(item);
  }
};

exports.createTransaction = async (req, res) => {
  const errors = validateTransactionPayload(req.body);
  if (errors.length) return res.status(400).json({ message: errors[0] });

  const payload = {
    title: req.body.title.trim(),
    amount: Number(req.body.amount),
    type: req.body.type,
    category: req.body.category,
    description: req.body.description ? req.body.description.trim() : '',
    transaction_date: formatDate(req.body.transaction_date),
  };

  try {
    const [result] = await pool.execute(
      'INSERT INTO transactions (title, amount, type, category, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)',
      [payload.title, payload.amount, payload.type, payload.category, payload.description, payload.transaction_date],
    );
    res.status(201).json({ id: result.insertId, ...payload, created_at: new Date().toISOString() });
  } catch (error) {
    const newEntry = { id: Date.now(), ...payload, created_at: new Date().toISOString() };
    fallbackTransactions.unshift(newEntry);
    res.status(201).json(newEntry);
  }
};

exports.updateTransaction = async (req, res) => {
  const errors = validateTransactionPayload(req.body, true);
  if (errors.length) return res.status(400).json({ message: errors[0] });

  const payload = {
    title: req.body.title.trim(),
    amount: Number(req.body.amount),
    type: req.body.type,
    category: req.body.category,
    description: req.body.description ? req.body.description.trim() : '',
    transaction_date: formatDate(req.body.transaction_date),
  };

  try {
    await pool.execute(
      'UPDATE transactions SET title = ?, amount = ?, type = ?, category = ?, description = ?, transaction_date = ? WHERE id = ?',
      [payload.title, payload.amount, payload.type, payload.category, payload.description, payload.transaction_date, req.params.id],
    );
    const [rows] = await pool.execute('SELECT * FROM transactions WHERE id = ?', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    const itemIndex = fallbackTransactions.findIndex((entry) => entry.id === Number(req.params.id));
    if (itemIndex === -1) return res.status(404).json({ message: 'Transaction not found.' });
    fallbackTransactions[itemIndex] = { ...fallbackTransactions[itemIndex], ...payload };
    res.status(200).json(fallbackTransactions[itemIndex]);
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Transaction not found.' });
    res.status(200).json({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    const itemIndex = fallbackTransactions.findIndex((entry) => entry.id === Number(req.params.id));
    if (itemIndex === -1) return res.status(404).json({ message: 'Transaction not found.' });
    fallbackTransactions.splice(itemIndex, 1);
    res.status(200).json({ message: 'Transaction deleted successfully.' });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const [incomeRows] = await pool.execute("SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'Income'");
    const [expenseRows] = await pool.execute("SELECT COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'Expense'");
    const [recentRows] = await pool.execute('SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5');
    const [categoryRows] = await pool.execute("SELECT category, COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'Expense' GROUP BY category ORDER BY total DESC");
    const [monthlyRows] = await pool.execute("SELECT DATE_FORMAT(transaction_date, '%b') AS month, COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'Expense' GROUP BY MONTH(transaction_date), DATE_FORMAT(transaction_date, '%b') ORDER BY MONTH(transaction_date)");

    res.status(200).json({
      totalIncome: Number(incomeRows[0].total || 0),
      totalExpenses: Number(expenseRows[0].total || 0),
      currentBalance: Number(incomeRows[0].total || 0) - Number(expenseRows[0].total || 0),
      recentTransactions: recentRows,
      expenseCategories: categoryRows,
      monthlyExpenses: monthlyRows,
    });
  } catch (error) {
    const income = fallbackTransactions.filter((entry) => entry.type === 'Income').reduce((sum, entry) => sum + Number(entry.amount), 0);
    const expenses = fallbackTransactions.filter((entry) => entry.type === 'Expense').reduce((sum, entry) => sum + Number(entry.amount), 0);
    const categoryMap = fallbackTransactions.filter((entry) => entry.type === 'Expense').reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + Number(entry.amount);
      return acc;
    }, {});
    const monthlyMap = fallbackTransactions.filter((entry) => entry.type === 'Expense').reduce((acc, entry) => {
      const month = new Date(entry.transaction_date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + Number(entry.amount);
      return acc;
    }, {});
    res.status(200).json({
      totalIncome: income,
      totalExpenses: expenses,
      currentBalance: income - expenses,
      recentTransactions: fallbackTransactions.slice(0, 5),
      expenseCategories: Object.entries(categoryMap).map(([category, total]) => ({ category, total })),
      monthlyExpenses: Object.entries(monthlyMap).map(([month, total]) => ({ month, total })),
    });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [monthlyRows] = await pool.execute("SELECT DATE_FORMAT(transaction_date, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'Expense' GROUP BY DATE_FORMAT(transaction_date, '%Y-%m') ORDER BY month DESC LIMIT 6");
    const [highestCategoryRows] = await pool.execute("SELECT category, COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'Expense' GROUP BY category ORDER BY total DESC LIMIT 1");
    const [dailyRows] = await pool.execute("SELECT transaction_date, COALESCE(SUM(amount), 0) AS total FROM transactions WHERE type = 'Expense' GROUP BY transaction_date ORDER BY transaction_date DESC LIMIT 7");
    res.status(200).json({
      totalMonthlySpending: monthlyRows[0]?.total || 0,
      highestExpenseCategory: highestCategoryRows[0] || { category: 'Other', total: 0 },
      dailyExpenseReport: dailyRows,
      monthlyExpenseReport: monthlyRows,
    });
  } catch (error) {
    const monthlyTotal = fallbackTransactions.filter((entry) => entry.type === 'Expense').reduce((sum, entry) => sum + Number(entry.amount), 0);
    const highestExpense = fallbackTransactions.filter((entry) => entry.type === 'Expense').reduce((acc, entry) => (entry.amount > acc.amount ? entry : acc), { category: 'Other', amount: 0 });
    res.status(200).json({
      totalMonthlySpending: monthlyTotal,
      highestExpenseCategory: { category: highestExpense.category, total: highestExpense.amount },
      dailyExpenseReport: fallbackTransactions.filter((entry) => entry.type === 'Expense').slice(0, 7),
      monthlyExpenseReport: fallbackTransactions.filter((entry) => entry.type === 'Expense').map((entry) => ({ month: entry.transaction_date, total: entry.amount })),
    });
  }
};

exports.searchTransactions = async (req, res) => {
  try {
    const { query, values } = buildWhereClause(req.query);
    const [rows] = await pool.execute(query, values);
    res.status(200).json(rows);
  } catch (error) {
    const filtered = fallbackTransactions.filter((entry) => {
      const titleMatch = !req.query.title || entry.title.toLowerCase().includes(req.query.title.toLowerCase());
      const typeMatch = !req.query.type || entry.type === req.query.type;
      const categoryMatch = !req.query.category || entry.category === req.query.category;
      const dateMatch = !req.query.date || entry.transaction_date === req.query.date;
      const monthMatch = !req.query.month || entry.transaction_date.startsWith(req.query.month);
      return titleMatch && typeMatch && categoryMatch && dateMatch && monthMatch;
    });
    res.status(200).json(filtered);
  }
};
