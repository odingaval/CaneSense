import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyFieldScreen from './screens/MyFieldScreen';
import ReportProblemScreen from './screens/ReportProblemScreen';
import ResultScreen from './screens/ResultScreen';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <header className="bg-canesense-green text-white p-4 shadow-md sticky top-0 z-50">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-wide">Canesense</h1>
            <div className="text-sm font-medium opacity-80">Advisor</div>
          </div>
        </header>
        <main className="max-w-md mx-auto p-4 pb-20">
          <Routes>
            <Route path="/" element={<MyFieldScreen />} />
            <Route path="/report/:fieldId" element={<ReportProblemScreen />} />
            <Route path="/result" element={<ResultScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
