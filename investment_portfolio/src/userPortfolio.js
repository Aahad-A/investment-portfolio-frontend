import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Modal } from "react-bootstrap";
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
import CreatePortfolioForm from "./components/CreatePorfolio";
import AddInvestmentForm from "./components/AddInvestment";

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
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [showCreatePortfolioModal, setShowCreatePortfolioModal] =
    useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const handleCloseCreatePortfolioModal = () =>
    setShowCreatePortfolioModal(false);
  const handleShowCreatePortfolioModal = () =>
    setShowCreatePortfolioModal(true);
  const handleCloseAddInvestmentModal = () => setShowAddInvestmentModal(false);
  const handleShowAddInvestmentModal = () => setShowAddInvestmentModal(true);
  const handleCloseManageInvestmentModal = () => setSelectedInvestment(null);

  const handleViewGraph = (ticker) => {
    setSelectedGraphData(graphData[ticker]);
  };

  const deletePortfolio = async (portfolioId) => {
    console.log(portfolioId)
    try {
      const response = await fetch(`http://127.0.0.1:5196/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Refresh the page or update the state to remove the deleted portfolio
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
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
    fetch("http://127.0.0.1:5196/portfolios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Cookies.get("base64"),
      },
      body: JSON.stringify({ name: newPortfolioName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPortfolios((prevPortfolios) =>
          prevPortfolios ? [...prevPortfolios, data] : [data]
        );
        setNewPortfolioName("");
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleAddInvestment = (portfolioId, newInvestment) => {
    console.log("portfolioId:", portfolioId);
    console.log("newInvestment:", newInvestment);

    fetch("http://127.0.0.1:5196/investments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Cookies.get("base64"),
      },
      body: JSON.stringify({ ...newInvestment, portfolioId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPortfolios((prevPortfolios) =>
          prevPortfolios.map((portfolio) => {
            if (portfolio.portfolioId === portfolioId) {
              return {
                ...portfolio,
                investments: [...portfolio.investments, data],
              };
            } else {
              return portfolio;
            }
          })
        );
        // Clear the form
        setNewInvestmentName("");
        setNewInvestmentTicker("");
        setNewInvestmentQuantity("");
        setNewInvestmentPurchasePrice("");
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Container>
      <div className="d-flex justify-content-between mb-5">
      <Button variant="primary" onClick={handleShowCreatePortfolioModal}style={{ paddingLeft: '10px' }}>
        {" "}
        Create Portfolio
      </Button>
      
      <Button variant="primary" onClick={handleShowAddInvestmentModal}style={{ paddingLeft: '10px' }}>
        {" "}
        Add Investment to Portfolio
      </Button>
      </div>

      <Row>
        {portfolios &&
          portfolios.map((portfolio) => (
            <Col key={portfolio.portfolioId} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{portfolio.name}
                
                  <Button variant="danger" onClick={() => deletePortfolio(portfolio.portfolioId)} style={{ marginLeft: '10px' }}>
                  Delete Portfolio
                 </Button>
              
                  </Card.Title>
                  <Card.Text>
                    <strong>Investments:</strong>
                    <ul>
                      {portfolio.investments &&
                        portfolio.investments.map((investment) => (
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
      <Modal
        show={showCreatePortfolioModal}
        onHide={handleCloseCreatePortfolioModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Portfolio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreatePortfolioForm
            newPortfolioName={newPortfolioName}
            setNewPortfolioName={setNewPortfolioName}
            handleCreatePortfolio={handleCreatePortfolio}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddInvestmentModal}
        onHide={handleCloseAddInvestmentModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Investment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddInvestmentForm
            portfolios={portfolios}
            selectedPortfolio={selectedPortfolio}
            setSelectedPortfolio={setSelectedPortfolio}
            newInvestmentName={newInvestmentName}
            setNewInvestmentName={setNewInvestmentName}
            newInvestmentTicker={newInvestmentTicker}
            setNewInvestmentTicker={setNewInvestmentTicker}
            newInvestmentQuantity={newInvestmentQuantity}
            setNewInvestmentQuantity={setNewInvestmentQuantity}
            newInvestmentPurchasePrice={newInvestmentPurchasePrice}
            setNewInvestmentPurchasePrice={setNewInvestmentPurchasePrice}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddInvestmentModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              handleAddInvestment(selectedPortfolio, {
                name: newInvestmentName,
                ticker: newInvestmentTicker,
                quantity: newInvestmentQuantity,
                purchasePrice: newInvestmentPurchasePrice,
              })
            }
          >
            Add Investment
          </Button>
        </Modal.Footer>
      </Modal>
      {selectedInvestment && (
        <Modal
          show={selectedInvestment !== null}
          onHide={handleCloseManageInvestmentModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Investment: {selectedInvestment.name} (
              {selectedInvestment.ticker})
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            </Form>
          </Modal.Body>
          <Modal.Footer>
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
          </Modal.Footer>
        </Modal>
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
