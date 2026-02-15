import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><h1>Bem-vindo ao Atheneum Edu</h1></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
