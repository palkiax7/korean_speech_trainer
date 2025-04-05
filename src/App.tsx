import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Alphabet from './pages/Alphabet';
import Practice from './pages/Practice';
import Progress from './pages/Progress';
import Profile from './pages/Profile';

function App() {
  useEffect(() => {
    fetch('http://127.0.0.1:5000/your-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'hello from frontend' }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Backend says:', data);
      })
      .catch((err) => console.error('Error from backend:', err));
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alphabet" element={<Alphabet />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
