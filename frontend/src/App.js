import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Toast, ToastContainer } from 'react-bootstrap';
import { FaMoneyBillWave, FaChartPie, FaFilter, FaDownload, FaPlus } from 'react-icons/fa';
import axios from 'axios';
import NavbarComponent from './components/NavbarComponent';
import SummaryCard from './components/SummaryCard';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import DashboardCharts from './components/DashboardCharts';
import ReportPanel from './components/ReportPanel';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [filters, setFilters] = useState({ title: '', category: '', date: '', month: '', type: '' });
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, dashboardRes, reportsRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/dashboard`),
        axios.get(`${API_URL}/reports`),
      ]);
      setTransactions(transactionsRes.data);
      setDashboard(dashboardRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      setToastMessage('Unable to load data.');
      setToastVariant('danger');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      const response = payload.id
        ? await axios.put(`${API_URL}/transactions/${payload.id}`, payload)
        : await axios.post(`${API_URL}/transactions`, payload);
      setToastMessage(payload.id ? 'Transaction updated successfully.' : 'Transaction added successfully.');
      setToastVariant('success');
      setShowToast(true);
      setEditingTransaction(null);
      fetchData();
      return response.data;
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Operation failed.');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      setToastMessage('Transaction deleted successfully.');
      setToastVariant('success');
      setShowToast(true);
      fetchData();
    } catch (error) {
      setToastMessage('Delete failed.');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleSearch = async () => {
    try {
      const params = {
        title: filters.title,
        category: filters.category,
        date: filters.date,
        month: filters.month,
        type: filters.type,
      };
      const response = await axios.get(`${API_URL}/search`, { params });
      setTransactions(response.data);
    } catch (error) {
      setToastMessage('Search failed.');
      setToastVariant('danger');
      setShowToast(true);
    }
  };

  const handleExport = () => {
    const rows = transactions.map((item) => `${item.title},${item.amount},${item.type},${item.category},${item.transaction_date}`).join('\n');
    const blob = new Blob([`title,amount,type,category,date\n${rows}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
    setToastMessage('Transactions exported to CSV.');
    setToastVariant('success');
    setShowToast(true);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <NavbarComponent />
      <Container fluid className="py-4">
        <Row className="g-4 mb-4">
          <Col lg={3} md={6}>
            <SummaryCard title="Total Income" amount={`$${dashboard?.totalIncome || 0}`} icon={<FaMoneyBillWave />} accent="success" />
          </Col>
          <Col lg={3} md={6}>
            <SummaryCard title="Total Expenses" amount={`$${dashboard?.totalExpenses || 0}`} icon={<FaMoneyBillWave />} accent="danger" />
          </Col>
          <Col lg={3} md={6}>
            <SummaryCard title="Current Balance" amount={`$${dashboard?.currentBalance || 0}`} icon={<FaChartPie />} accent="info" />
          </Col>
          <Col lg={3} md={6}>
            <SummaryCard title="Recent Transactions" amount={`${dashboard?.recentTransactions?.length || 0}`} icon={<FaPlus />} accent="warning" />
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={8}>
            <TransactionForm onSubmit={handleSubmit} selectedTransaction={editingTransaction} onCancelEdit={() => setEditingTransaction(null)} />
          </Col>
          <Col lg={4}>
            <ReportPanel reports={reports} />
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={12}>
            <DashboardCharts dashboard={dashboard} />
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={12}>
            <TransactionTable
              transactions={transactions}
              filters={filters}
              setFilters={setFilters}
              onSearch={handleSearch}
              onExport={handleExport}
              onDelete={handleDelete}
              onEdit={setEditingTransaction}
            />
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg={toastVariant}>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
