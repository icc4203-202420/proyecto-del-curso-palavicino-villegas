import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import BarsIndex from './components/bars/BarsIndex';
import EventsIndex from './components/events/EventsIndex';

function App() {
  return (
    



    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bars" element={<BarsIndex />} />
        {/* <Route path="/beers" element={<BeersIndex />} /> */}
        <Route path="/bars/:id/events" element={<EventsIndex />} />
      </Routes>
    </Router>
  );
}

export default App;
