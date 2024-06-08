import { Nav, Navbar, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import logo from '../images/investment_port.jpg';

function Navigation() {
  return (
    <Navbar style={{background: 'white'}} expand="lg">
      <Container>
        <Navbar.Brand href="/">
        <img
            src={logo}
            width="45"
            height="45"
            className="d-inline-block align-top"
            alt="My Investment Portfolio logo"
          />
          {' '}
          My Investment Portfolio</Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" variant="pills">

            <Nav.Item>
              <Nav.Link as={NavLink} to="/" exact>
                Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item>
              <Nav.Link as={NavLink} to="/portfolios">
                Portfolios
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={NavLink} to="/stocks">
                Current Stock Data
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
