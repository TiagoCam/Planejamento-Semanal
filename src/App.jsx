import React from 'react';
import PlanningForm from './components/PlanningForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Sistema de Planejamento Semanal</h1>
        <h2 className="app-subtitle">CEI LAR da Benção Divina</h2>
      </header>
      <main>
        <PlanningForm />
      </main>
    </div>
  );
}

export default App;