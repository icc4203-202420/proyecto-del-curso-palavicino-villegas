import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';

function App() {
  return (




    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/beers" element={<BeersIndex />} /> */}
        {/* <Route path="/bars" element={<BarsIndex />} /> */}
        {/* <Route path="/bar/:id/events" element={<EventsIndex />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
