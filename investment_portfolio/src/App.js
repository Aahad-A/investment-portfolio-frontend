// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Drafts from './Drafts';
// import CardDisplay from './CardDisplay';
import Navigation from './components/Navigation.js';
import Login from './Login';
import LandingPage from './LandingPage';
import UserPortfolios from './userPortfolio.js';
import StockData from './StockData.js';
// import NewItem from './NewItem';


function App() {
  return (
    <Router>
      <Navigation/>
      <Routes>
        {/* <Route path="/" element={<CardDisplay/>} /> */}
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/portfolios" element={<UserPortfolios/>} />
        <Route path="/stocks" element={<StockData/>} />
      </Routes>
    </Router>
  );
}

export default App;