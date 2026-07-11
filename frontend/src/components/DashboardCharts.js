import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function DashboardCharts({ dashboard }) {
  return (
    <Row className="g-4">
      <Col lg={6}>
        <Card className="glass-card h-100">
          <Card.Body>
            <h5 className="fw-bold mb-3">Expense by Category</h5>
            <div className="chart-placeholder">
              {dashboard?.expenseCategories?.map((item) => (
                <div key={item.category} className="d-flex justify-content-between mb-2">
                  <span>{item.category}</span>
                  <strong>${item.total}</strong>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={6}>
        <Card className="glass-card h-100">
          <Card.Body>
            <h5 className="fw-bold mb-3">Monthly Expense Trend</h5>
            <div className="chart-placeholder">
              {dashboard?.monthlyExpenses?.map((item) => (
                <div key={item.month} className="d-flex justify-content-between mb-2">
                  <span>{item.month}</span>
                  <strong>${item.total}</strong>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default DashboardCharts;
