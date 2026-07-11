import React, { useEffect, useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other'];
const emptyForm = {
  title: '',
  amount: '',
  type: 'Expense',
  category: 'Food',
  description: '',
  transaction_date: '',
};

function TransactionForm({ onSubmit, selectedTransaction, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedTransaction) {
      setFormData({
        title: selectedTransaction.title || '',
        amount: selectedTransaction.amount || '',
        type: selectedTransaction.type || 'Expense',
        category: selectedTransaction.category || 'Food',
        description: selectedTransaction.description || '',
        transaction_date: selectedTransaction.transaction_date || '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [selectedTransaction]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.transaction_date) {
      setError('Please fill in the title, amount, and date.');
      return;
    }
    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    setError('');
    await onSubmit({ ...formData, id: selectedTransaction?.id });
    setFormData(emptyForm);
  };

  return (
    <Card className="glass-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">{selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}</h5>
          <FaPlus />
        </div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control name="title" value={formData.title} onChange={handleChange} placeholder="Salary / Groceries" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="transaction_date" value={formData.transaction_date} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control name="description" value={formData.description} onChange={handleChange} placeholder="Short description" />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="d-flex gap-2">
                <Button type="submit" className="btn-gradient flex-grow-1">{selectedTransaction ? 'Update Transaction' : 'Save Transaction'}</Button>
                {selectedTransaction && (
                  <Button variant="outline-light" onClick={onCancelEdit}>Cancel</Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default TransactionForm;
