// CreatePortfolio.js
import React from 'react';
import { Form, Button } from 'react-bootstrap';

const CreatePortfolioForm = ({ newPortfolioName, setNewPortfolioName, handleCreatePortfolio }) => {
  return (
    <Form>
      <Form.Group controlId="portfolioName">
        <Form.Label>Portfolio Name</Form.Label>
        <Form.Control
          type="text"
          value={newPortfolioName}
          onChange={e => setNewPortfolioName(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleCreatePortfolio}>
        Create Portfolio
      </Button>
    </Form>
  );
};

export default CreatePortfolioForm;