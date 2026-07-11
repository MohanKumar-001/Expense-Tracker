import React from 'react';
import { Card } from 'react-bootstrap';

function SummaryCard({ title, amount, icon, accent }) {
  return (
    <Card className={`summary-card border-0 shadow-sm bg-${accent} text-white`}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <p className="mb-1 small text-white-50">{title}</p>
          <h4 className="fw-bold">{amount}</h4>
        </div>
        <div className="fs-3">{icon}</div>
      </Card.Body>
    </Card>
  );
}

export default SummaryCard;
