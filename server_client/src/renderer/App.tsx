import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AdvancedEditor } from './AdvancedEditor';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdvancedEditor />} />
      </Routes>
    </Router>
  );
}
