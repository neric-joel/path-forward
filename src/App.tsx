import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import type { AssessmentResult } from './lib/types';
import Home from './pages/Home';
import Intake from './pages/Intake';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [result, setResult] = useState<AssessmentResult | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intake" element={<Intake onComplete={setResult} />} />
        <Route
          path="/dashboard"
          element={
            result
              ? <Dashboard result={result} />
              : <Navigate to="/intake" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
