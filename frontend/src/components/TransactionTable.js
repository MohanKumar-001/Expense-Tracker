import React from 'react';
import { Card, Table, Form, Button, Row, Col } from 'react-bootstrap';
import { FaSearch, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];

function TransactionTable({ transactions, filters, setFilters, onSearch, onExport, onDelete, onEdit }) {
  return (
    <Card className="glass-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <h5 className="mb-0 fw-bold">Transactions</h5>
          <Button variant="outline-light" onClick={onExport}>
            <FaDownload className="me-2" />Export CSV
          </Button>
        </div>

        <Row className="g-2 mb-3">
          <Col md={3}>
            <Form.Control placeholder="Search title" value={filters.title} onChange={(e) => setFilters({ ...filters, title: e.target.value })} />
          </Col>
          <Col md={2}>
            <Form.Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
              <option value="">All Categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
          </Col>
          <Col md={2}>
            <Form.Control type="month" value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} />
          </Col>
          <Col md={1}>
            <Button className="w-100" onClick={onSearch}><FaSearch /></Button>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped hover className="align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.title}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.transaction_date}</td>
                  <td>
                    <Button size="sm" variant="outline-info" className="me-2" onClick={() => onEdit({ ...transaction, id: transaction.id })}>
                      <FaEdit />
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => onDelete(transaction.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TransactionTable;
