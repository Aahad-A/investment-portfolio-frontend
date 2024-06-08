import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Alert } from 'react-bootstrap';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const StockData = () => {
  const [stockSymbol, setStockSymbol] = useState('');
  const [latestPrice, setLatestPrice] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const apiKey = '5R521ZQHFCSJ5YNQ';
        
        // Fetch latest price
        const priceResponse = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`);
        const priceData = await priceResponse.json();
        setLatestPrice(priceData['Global Quote']['05. price']);

        // Fetch historical data
        const historyResponse = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`);
        const historyData = await historyResponse.json();
        const timeSeries = historyData['Time Series (Daily)'];
        const chartData = {
          labels: Object.keys(timeSeries).reverse().slice(0, 30), // Last 30 days
          datasets: [
            {
              label: stockSymbol,
              data: Object.values(timeSeries).reverse().slice(0, 30).map(day => parseFloat(day['4. close'])),
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        };
        setHistoricalData(chartData);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [stockSymbol]);

  const handleSearch = (event) => {
    event.preventDefault();
    const form = event.target;
    const newSymbol = form.elements.stockSymbol.value.trim().toUpperCase();
    setStockSymbol(newSymbol);
  };

  return (
    <Container className="mt-5">
        <Alert variant="warning">
            This data is from Alphavantage and their free plan only allows you to make 25 requests per day
        </Alert>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Form.Group controlId="stockSymbol">
                  <Form.Label>Stock Symbol</Form.Label>
                  <Form.Control type="text" placeholder="Enter stock symbol (e.g., AAPL)" />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">Search</Button>
              </Form>
              
            </Card.Body>
          </Card>
          {latestPrice && (
            <Card className="mb-4">
              <Card.Body>
                <h3>Latest Price for {stockSymbol}: ${latestPrice}</h3>
              </Card.Body>
            </Card>
          )}
          {historicalData && (
            <Card>
              <Card.Body>
                <h3>Historical Data</h3>
                <Line data={historicalData} options={{ responsive: true }} />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default StockData;