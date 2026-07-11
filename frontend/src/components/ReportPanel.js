import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

function ReportPanel({ reports }) {
  return (
    <Card className="glass-card h-100">
      <Card.Body>
        <h5 className="fw-bold mb-3">Reports</h5>
        <ListGroup variant="flush">
          <ListGroup.Item className="bg-transparent text-white">Total Monthly Spending: ${reports?.totalMonthlySpending || 0}</ListGroup.Item>
          <ListGroup.Item className="bg-transparent text-white">Highest Expense Category: {reports?.highestExpenseCategory?.category || 'Other'}</ListGroup.Item>
          <ListGroup.Item className="bg-transparent text-white">Daily Expense Report: {reports?.dailyExpenseReport?.length || 0} entries</ListGroup.Item>
          <ListGroup.Item className="bg-transparent text-white">Monthly Expense Report: {reports?.monthlyExpenseReport?.length || 0} months</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default ReportPanel;
