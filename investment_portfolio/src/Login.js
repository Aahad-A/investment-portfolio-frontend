import hero from './images/hero.jpg';
import './Login.css';
import {Form, Button, FormGroup} from "react-bootstrap";
import Cookies from 'js-cookie';


function Authenticate(e)
{
    fetch('http://127.0.0.1:5196/login',
        {
            method: "POST",
            headers: 
            {
                "Content-type" : "application/json",
                "Authorization": "Basic " + btoa(e.target.elements.username.value + ":" + e.target.elements.password.value)

            },
            body: JSON.stringify(
                {
                    username: e.target.elements.username.value,
                    password: e.target.elements.password.value
                }
            )
        }
    )
    .then(response => {
            if (response.ok) { // Check if response went through
                alert('Login successful!');
                return response.text();
                
            } else {
                
                throw new Error('Network response was not ok.');
                
            }
        })
    .then(data => { 
            console.log(data);
            let dataObj = JSON.parse(data);
            Cookies.set('auth', data, { expires: 7 }); // The cookie will expire after 7 days
            Cookies.set('base64', btoa(dataObj.username+":"+dataObj.password), { expires: 7 });
        })
    .catch(error => {
        alert('login failed!')
        console.log('There has been a problem with your fetch operation: ', error.message);
        })
}


function NewUser(e){
    fetch('http://127.0.0.1:5196/newUser',{
            method: "POST",
            headers: {
                "Content-type" : "application/json",

            },
            body: JSON.stringify(
                {
                    username: e.target.elements.new_username.value,
                    password: e.target.elements.new_password.value,
                }
            )
        })
        .then(response => response.text())
        .then(data => { 
            alert('Account Creation Successful!');
            console.log(data);
    })
}

function Login() {
  return (
    <div className="hero" style={{ backgroundImage: `url(${hero})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-md-6 text-center text-white">
            <h1>Welcome to Investment Portfolio Manager</h1>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="text-center mb-4">Login</h2>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    Authenticate(e);
                    e.target.reset();
                  }}
                >
                  <FormGroup className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" required />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" required />
                  </FormGroup>
                  <Button variant="primary" type="submit" className="w-100">
                    Login
                  </Button>
                </Form>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="text-center mb-4">New User</h2>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    NewUser(e);
                    e.target.reset();
                  }}
                >
                  <FormGroup className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="new_username" required />
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="new_password" required />
                  </FormGroup>
                  <Button variant="primary" type="submit" className="w-100">
                    Create User
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;