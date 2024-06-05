import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Cookies from "js-cookie";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const graphData = {
  AAPL: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "AAPL",
        data: [150, 160, 170, 165, 180, 190, 200],
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  },
  MSFT: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "MSFT",
        data: [220, 230, 240, 235, 250, 260, 270],
        fill: false,
        backgroundColor: "rgb(153, 102, 255)",
        borderColor: "rgba(153, 102, 255, 0.2)",
      },
    ],
  },
};

const UserPortfolios = ({ userId }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedGraphData, setSelectedGraphData] = useState(null);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [newInvestmentName, setNewInvestmentName] = useState("");
  const [newInvestmentTicker, setNewInvestmentTicker] = useState("");
  const [newInvestmentQuantity, setNewInvestmentQuantity] = useState("");
  const [newInvestmentPurchasePrice, setNewInvestmentPurchasePrice] =
    useState("");
  const [handleCreatePortfolioAndInvestment] = useState("");

  const handleViewGraph = (ticker) => {
    setSelectedGraphData(graphData[ticker]);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:5196/portfolios")
      .then((response) => response.json())
      .then((data) => setPortfolios(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handlePurchase = (investmentId) => {
    // Implement API call to purchase more quantity
    fetch("http://127.0.0.1:5196/purchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Cookies.get("base64"),
      },
      body: JSON.stringify({
        investmentId,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the investment in state
        setPortfolios((prevPortfolios) =>
          prevPortfolios.map((portfolio) => ({
            ...portfolio,
            investments: portfolio.investments.map((investment) =>
              investment.investmentId === data.investmentId ? data : investment
            ),
          }))
        );
        setSelectedInvestment(null);
        setQuantity("");
        setPrice("");
      });
  };

  const handleSell = (investmentId) => {
    // Implement API call to sell quantity
    fetch("http://127.0.0.1:5196/sell", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        investmentId,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the investment in state
        setPortfolios((prevPortfolios) =>
          prevPortfolios.map((portfolio) => ({
            ...portfolio,
            investments: portfolio.investments.map((investment) =>
              investment.investmentId === data.investmentId ? data : investment
            ),
          }))
        );
        setSelectedInvestment(null);
        setQuantity("");
        setPrice("");
      });
  };
  const handleCreatePortfolio = () => {
    fetch('http://127.0.0.1:5196/portfolios', {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
        "Authorization": "Basic " + Cookies.get('base64')
      },
      body: JSON.stringify({ name: newPortfolioName }),
    })
      .then(response => response.json())
      .then(data => {
        setPortfolios(prevPortfolios => [...prevPortfolios, data]);
        setNewPortfolioName('');
      })
      .catch(error => console.error('Error:', error));
  };
  
  const handleAddInvestment = (portfolioId, newInvestment) => {
    fetch('http://127.0.0.1:5196/investments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Basic " + Cookies.get('base64')
      },
      body: JSON.stringify({ ...newInvestment, portfolioId }),
    })
      .then(response => response.json())
      .then(data => {
        setPortfolios(prevPortfolios => prevPortfolios.map(portfolio => {
          if (portfolio.portfolioId === portfolioId) {
            return { ...portfolio, investments: [...portfolio.investments, data] };
          } else {
            return portfolio;
          }
        }));
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <Container>
      <Row>
        {portfolios.map((portfolio) => (
          <Col key={portfolio.portfolioId} md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{portfolio.name}</Card.Title>
                <Card.Text>
                  <strong>Investments:</strong>
                  <ul>
                    {portfolio.investments.map((investment) => (
                      <li key={investment.investmentId}>
                        {investment.name} ({investment.ticker}):{" "}
                        {investment.quantity} shares @ $
                        {investment.purchasePrice} each
                        <Button
                          variant="link"
                          onClick={() => setSelectedInvestment(investment)}
                        >
                          Manage
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleViewGraph(investment.ticker)}
                        >
                          View Graph
                        </Button>
                      </li>
                    ))}
                  </ul>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Create New Portfolio</Card.Title>
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
              <hr />
              <Card.Title>Add New Investment</Card.Title>
              <Form>
                <Form.Group controlId="investmentName">
                  <Form.Label>Investment Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newInvestmentName}
                    onChange={e => setNewInvestmentName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="investmentTicker">
                  <Form.Label>Investment Ticker</Form.Label>
                  <Form.Control
                    type="text"
                    value={newInvestmentTicker}
                    onChange={e => setNewInvestmentTicker(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="investmentQuantity">
                  <Form.Label>Investment Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={newInvestmentQuantity}
                    onChange={e => setNewInvestmentQuantity(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="investmentPurchasePrice">
                  <Form.Label>Investment Purchase Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={newInvestmentPurchasePrice}
                    onChange={e => setNewInvestmentPurchasePrice(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" onClick={() => handleAddInvestment(newPortfolioName, {
                  name: newInvestmentName,
                  ticker: newInvestmentTicker,
                  quantity: newInvestmentQuantity,
                  purchasePrice: newInvestmentPurchasePrice
                })}>
                  Add Investment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {selectedInvestment && (
        <div className="mt-4">
          <h3>
            Manage Investment: {selectedInvestment.name} (
            {selectedInvestment.ticker})
          </h3>
          <Form>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={() => handlePurchase(selectedInvestment.investmentId)}
            >
              Purchase
            </Button>
            <Button
              variant="danger"
              onClick={() => handleSell(selectedInvestment.investmentId)}
            >
              Sell
            </Button>
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
