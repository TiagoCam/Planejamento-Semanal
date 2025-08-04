import React, { useState } from 'react';
import PDFGenerator from './PDFGenerator';
import './PlanningForm.css';

const PlanningForm = () => {
  const [formData, setFormData] = useState({
    weekStart: '',
    weekEnd: '',
    month: '',
    rodaInicial: '',
    atividadeDirigida: '',
    atividadeLivreEscolha: '',
    atividadeDiversificada: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="planning-container">
      <div className="form-section">
        <h2>Configurar Planejamento Semanal</h2>
        
        <div className="date-inputs">
          <div className="input-group">
            <label htmlFor="weekStart">Semana de:</label>
            <input
              type="number"
              id="weekStart"
              name="weekStart"
              value={formData.weekStart}
              onChange={handleInputChange}
              placeholder="01"
              min="1"
              max="31"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="weekEnd">à:</label>
            <input
              type="number"
              id="weekEnd"
              name="weekEnd"
              value={formData.weekEnd}
              onChange={handleInputChange}
              placeholder="07"
              min="1"
              max="31"
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="month">Mês:</label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
            >
              <option value="">Selecione o mês</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="content-inputs">
          <div className="input-group">
            <label htmlFor="rodaInicial">RODA INICIAL:</label>
            <textarea
              id="rodaInicial"
              name="rodaInicial"
              value={formData.rodaInicial}
              onChange={handleInputChange}
              placeholder="Descreva as atividades da roda inicial..."
              rows="4"
            />
          </div>

          <div className="input-group">
            <label htmlFor="atividadeDirigida">ATIVIDADE DIRIGIDA:</label>
            <textarea
              id="atividadeDirigida"
              name="atividadeDirigida"
              value={formData.atividadeDirigida}
              onChange={handleInputChange}
              placeholder="Descreva as atividades dirigidas..."
              rows="4"
            />
          </div>

          <div className="input-group">
            <label htmlFor="atividadeLivreEscolha">ATIVIDADE DE LIVRE ESCOLHA DA CRIANÇA:</label>
            <textarea
              id="atividadeLivreEscolha"
              name="atividadeLivreEscolha"
              value={formData.atividadeLivreEscolha}
              onChange={handleInputChange}
              placeholder="Descreva as atividades de livre escolha..."
              rows="4"
            />
          </div>

          <div className="input-group">
            <label htmlFor="atividadeDiversificada">ATIVIDADE DIVERSIFICADA:</label>
            <textarea
              id="atividadeDiversificada"
              name="atividadeDiversificada"
              value={formData.atividadeDiversificada}
              onChange={handleInputChange}
              placeholder="Descreva as atividades diversificadas..."
              rows="4"
            />
          </div>
        </div>
      </div>

      <div className="preview-section">
        <PDFGenerator formData={formData} />
      </div>
    </div>
  );
};

export default PlanningForm;