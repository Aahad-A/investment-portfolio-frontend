import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const UserPortfolios = ({ userId }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

//   useEffect(() => {
//     fetch(`/api/portfolios/user/${userId}`)
//       .then(response => response.json())
//       .then(data => {
//         setPortfolios(data);
//       })
//       .catch(error => {
//         console.error('There was an error fetching the portfolios!', error);
//       });
//   }, [userId]);

    useEffect(() => {
        // Hard-coded data for demonstration purposes
        const hardCodedPortfolios = [
        {
            portfolioId: 1,
            name: 'Tech Portfolio',
            investments: [
            {
                investmentId: 1,
                name: 'Apple Inc.',
                ticker: 'AAPL',
                quantity: 10,
                purchasePrice: 150,
            },
            {
                investmentId: 2,
                name: 'Microsoft Corp.',
                ticker: 'MSFT',
                quantity: 5,
                purchasePrice: 200,
            },
            ],
        },
        {
            portfolioId: 2,
            name: 'Health Portfolio',
            investments: [
            {
                investmentId: 3,
                name: 'Johnson & Johnson',
                ticker: 'JNJ',
                quantity: 8,
                purchasePrice: 160,
            },
            {
                investmentId: 4,
                name: 'Pfizer Inc.',
                ticker: 'PFE',
                quantity: 15,
                purchasePrice: 40,
            },
            ],
        },
        ];

        // Set the hard-coded data
        setPortfolios(hardCodedPortfolios);
    }, []);

    const handlePurchase = (investmentId) => {
        // Implement API call to purchase more quantity
        fetch('/api/portfolios/investment/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ investmentId, quantity: parseFloat(quantity), price: parseFloat(price) }),
        })
          .then(response => response.json())
          .then(data => {
            // Update the investment in state
            setPortfolios(prevPortfolios => prevPortfolios.map(portfolio => ({
              ...portfolio,
              investments: portfolio.investments.map(investment =>
                investment.investmentId === data.investmentId ? data : investment
              ),
            })));
            setSelectedInvestment(null);
            setQuantity('');
            setPrice('');
          });
      };
    
      const handleSell = (investmentId) => {
        // Implement API call to sell quantity
        fetch('/api/portfolios/investment/sell', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ investmentId, quantity: parseFloat(quantity), price: parseFloat(price) }),
        })
          .then(response => response.json())
          .then(data => {
            // Update the investment in state
            setPortfolios(prevPortfolios => prevPortfolios.map(portfolio => ({
              ...portfolio,
              investments: portfolio.investments.map(investment =>
                investment.investmentId === data.investmentId ? data : investment
              ),
            })));
            setSelectedInvestment(null);
            setQuantity('');
            setPrice('');
          });
      };

  return (
    <Container>
      <Row>
        {portfolios.map(portfolio => (
          <Col key={portfolio.portfolioId} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{portfolio.name}</Card.Title>
                <Card.Text>
                  <strong>Investments:</strong>
                  <ul>
                    {portfolio.investments.map(investment => (
                      <li key={investment.investmentId}>
                        {investment.name} ({investment.ticker}): {investment.quantity} shares @ ${investment.purchasePrice} each
                        <Button variant="link" onClick={() => setSelectedInvestment(investment)}>Manage</Button>
                      </li>
                    ))}
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {selectedInvestment && (
        <div className="mt-4">
          <h3>Manage Investment: {selectedInvestment.name} ({selectedInvestment.ticker})</h3>
          <Form>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </Form.Group>
            <Button variant="primary" onClick={() => handlePurchase(selectedInvestment.investmentId)}>Purchase</Button>
            <Button variant="danger" onClick={() => handleSell(selectedInvestment.investmentId)}>Sell</Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default UserPortfolios;