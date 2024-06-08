// Footer.js
import React from 'react';
import logo from '../images/investment_port.jpg';

const Footer = () => {
    return (
      <footer style={{ backgroundColor: '#f8f9fa', padding: '10px 0', position: 'absolute', bottom: '0', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '50px', marginRight: '10px' }} />
          <h3>InvestmentPortfolio</h3>
        </div>
      </footer>
    );
  };
  
  export default Footer;