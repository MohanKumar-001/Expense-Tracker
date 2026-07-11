import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaWallet, FaChartLine } from 'react-icons/fa';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="navbar-glass shadow-sm sticky-top">
      <Container>
        <Navbar.Brand href="#" className="fw-bold text-white">
          <FaWallet className="me-2" /> Expense Tracker System
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="#" className="text-white-50">Dashboard</Nav.Link>
          <Nav.Link href="#" className="text-white-50">Transactions</Nav.Link>
          <Nav.Link href="#" className="text-white-50">Reports</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
