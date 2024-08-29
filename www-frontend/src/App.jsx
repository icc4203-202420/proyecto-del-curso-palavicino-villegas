import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import BarsIndex from './components/bars/BarsIndex';
import SocialIndex from './components/social/SocialIndex';
import BeersIndex from './components/beers/BeersIndex';

function App() {
  return (




    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bars" element={<BarsIndex />} />
        <Route path="/social" element={<SocialIndex />} />
        <Route path="/beers" element={<BeersIndex />} />
        {/* <Route path="/bar/:id/events" element={<EventsIndex />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
