import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import BarsIndex from './components/bars/BarsIndex';
import EventsIndex from './components/events/EventsIndex';
import SocialIndex from './components/social/SocialIndex';
import BeersIndex from './components/beers/BeersIndex';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bars" element={<BarsIndex />} />
        <Route path="/social" element={<SocialIndex />} />
        <Route path="/bars/:id/events" element={<EventsIndex />} />
        <Route path="/beers" element={<BeersIndex />} />
      </Routes>
    </Router>
  );
}

export default App;
