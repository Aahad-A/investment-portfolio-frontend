// AddInvestmentForm.js
import React from 'react';
import { Form } from 'react-bootstrap';

const AddInvestmentForm = ({ portfolios, selectedPortfolio, setSelectedPortfolio, newInvestmentName, setNewInvestmentName, newInvestmentTicker, setNewInvestmentTicker, newInvestmentQuantity, setNewInvestmentQuantity, newInvestmentPurchasePrice, setNewInvestmentPurchasePrice }) => {
  return (
    <Form>
      <Form.Group controlId="portfolioSelection">
        <Form.Label>Select Portfolio</Form.Label>
        <Form.Control
          as="select"
          value={selectedPortfolio}
          onChange={(e) => setSelectedPortfolio(e.target.value)}
        >
          {portfolios.map((portfolio, index) => (
            <option key={index} value={portfolio.portfolioId}>
              {portfolio.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="investmentName">
        <Form.Label>Investment Name</Form.Label>
        <Form.Control
          type="text"
          value={newInvestmentName}
          onChange={(e) => setNewInvestmentName(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="investmentTicker">
        <Form.Label>Investment Ticker</Form.Label>
        <Form.Control
          type="text"
          value={newInvestmentTicker}
          onChange={(e) => setNewInvestmentTicker(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="investmentQuantity">
        <Form.Label>Investment Quantity</Form.Label>
        <Form.Control
          type="number"
          value={newInvestmentQuantity}
          onChange={(e) => setNewInvestmentQuantity(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="investmentPurchasePrice">
        <Form.Label>Investment Purchase Price</Form.Label>
        <Form.Control
          type="number"
          value={newInvestmentPurchasePrice}
          onChange={(e) =>
            setNewInvestmentPurchasePrice(e.target.value)
          }
        />
      </Form.Group>
    </Form>
  );
};

export default AddInvestmentForm;