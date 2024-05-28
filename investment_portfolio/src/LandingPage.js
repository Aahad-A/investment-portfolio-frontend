import logo from './logo.svg';
import './App.css';

function LandingPage() {
  return (
    <div className="App">
      <header className="App-header bg-primary text-white py-5">
        <img src={logo} className="App-logo mb-3" alt="logo" />
        <h1>Welcome to the Investment Portfolio Manager</h1>
        <p>
          Manage and analyze your investments with real-time data and insights.
        </p>
        <a
          className="btn btn-light btn-lg mt-3"
          href="#features"
          role="button"
        >
          Learn More
        </a>
      </header>

      <section id="features" className="container my-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Track Your Investments</h5>
                <p className="card-text">
                  Add, view, and update your investments with ease, and keep track of your portfolio's performance.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Real-Time Data</h5>
                <p className="card-text">
                  Integrate with financial data APIs to fetch the latest stock and investment information.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Secure & Reliable</h5>
                <p className="card-text">
                  Enjoy secure login and data management with OAuth 2.0, ensuring your data is safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-light py-4">
        <div className="container">
          <span className="text-muted">&copy; Aahad Abubaker</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;