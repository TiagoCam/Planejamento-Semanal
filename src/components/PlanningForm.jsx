import React, { useState, useRef } from 'react';
import PDFGenerator from './PDFGenerator';
import PDFControls from './PDFControls';
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

  const pdfRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  // Gerar array de dias de 1 a 31
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="planning-container">
      <div className="form-section">
        <h2>Configurar Planejamento Semanal</h2>
        
        <div className="date-inputs">
          <div className="input-group">
            <label htmlFor="weekStart">de:</label>
            <select
              id="weekStart"
              name="weekStart"
              value={formData.weekStart}
              onChange={handleInputChange}
            >
              <option value="">dia</option>
              {days.map((day) => (
                <option key={day} value={day.toString().padStart(2, '0')}>
                  {day.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="weekEnd">à:</label>
            <select
              id="weekEnd"
              name="weekEnd"
              value={formData.weekEnd}
              onChange={handleInputChange}
            >
              <option value="">dia</option>
              {days.map((day) => (
                <option key={day} value={day.toString().padStart(2, '0')}>
                  {day.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="input-group">
            <label htmlFor="month">Mês:</label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
            >
              <option value="">selecione o mês</option>
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
        <PDFGenerator formData={formData} ref={pdfRef} />
      </div>

      {/* PDF Controls moved to be the last element in all devices */}
      <div className="pdf-controls-container">
        <PDFControls formData={formData} pdfRef={pdfRef} />
      </div>
    </div>
  );
};

export default PlanningForm;