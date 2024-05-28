import Nav from 'react-bootstrap/Nav'


function Navigation() {
    return(
        <Nav variant="pills" defaultActiveKey="/">
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="login" href="/login">Login</Nav.Link>
        </Nav.Item>
        {/* <Nav.Item>
          <Nav.Link eventKey="newItem" href="/newItem">New Recipe</Nav.Link>
        </Nav.Item> */}
        {/* <Nav.Item>
          <Nav.Link eventKey="disabled" disabled>Disabled</Nav.Link>
        </Nav.Item> */}
      </Nav>
    );
}
export default Navigation;