import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import {Line} from 'react-chartjs-2';
import {Chart, CategoryScale, LinearScale, PointElement, LineElement} from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const graphData = {
  AAPL: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'AAPL',
        data: [150, 160, 170, 165, 180, 190, 200],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  },
  MSFT: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'MSFT',
        data: [220, 230, 240, 235, 250, 260, 270],
        fill: false,
        backgroundColor: 'rgb(153, 102, 255)',
        borderColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  },
};

const UserPortfolios = ({ userId }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [selectedGraphData, setSelectedGraphData] = useState(null);
  
  const handleViewGraph = (ticker) => {
    setSelectedGraphData(graphData[ticker]);
  };

  useEffect(() => {
    fetch('http://127.0.0.1:5196/portfolios')
      .then(response => response.json())
      .then(data => setPortfolios(data))
      .catch(error => console.error('Error:', error));
  }, []);

    const handlePurchase = (investmentId) => {
        // Implement API call to purchase more quantity
        fetch('http://127.0.0.1:5196/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": "Basic " + Cookies.get('base64')
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
        fetch('http://127.0.0.1:5196/sell', {
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
                        <Button variant="link" onClick={() => handleViewGraph(investment.ticker)}>View Graph</Button>
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
      {selectedGraphData && (
        <div className="mt-4">
          <h3>Graph: {selectedGraphData.datasets[0].label}</h3>
          <Line data={selectedGraphData} options={{ responsive: true }} />
        </div>
      )}
    </Container>
  );
};

export default UserPortfolios;