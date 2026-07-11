CREATE DATABASE IF NOT EXISTS expense_tracker_db;
USE expense_tracker_db;

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type ENUM('Income', 'Expense') NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO transactions (title, amount, type, category, description, transaction_date) VALUES
('Salary', 5000.00, 'Income', 'Other', 'Monthly salary', '2026-07-01'),
('Groceries', 180.00, 'Expense', 'Food', 'Weekly groceries', '2026-07-02'),
('Train Ticket', 60.00, 'Expense', 'Travel', 'Commute ticket', '2026-07-03');
