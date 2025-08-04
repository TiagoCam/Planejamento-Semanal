import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './PDFGenerator.css';

const PDFGenerator = ({ formData }) => {
  const pdfRef = useRef();
  const [logoError, setLogoError] = useState(false);

  const generatePDF = async () => {
    const element = pdfRef.current;
    
    try {
      // Aguardar um pouco para garantir que todas as imagens carregaram
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        removeContainer: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4'); // Formato horizontal A4
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calcular quantas páginas serão necessárias
      const pageHeight = pdfHeight * (canvas.width / pdfWidth);
      const totalPages = Math.ceil(imgHeight / pageHeight);
      
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        
        const yOffset = -(pageHeight * i);
        const ratio = pdfWidth / imgWidth;
        
        pdf.addImage(
          imgData, 
          'PNG', 
          0, 
          yOffset * ratio, 
          imgWidth * ratio, 
          imgHeight * ratio
        );
      }
      
      const fileName = `Planejamento_Semana_${formData.weekStart || 'XX'}_a_${formData.weekEnd || 'XX'}_${formData.month || 'Mes'}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const isFormValid = formData.weekStart && formData.weekEnd && formData.month;

  // Função para dividir conteúdo em páginas
  const splitContentIntoPages = (content, maxCharsPerPage = 1000) => {
    if (!content || content.trim() === '') {
      return [''];  // Retorna array com string vazia para manter pelo menos uma página
    }
    
    if (content.length <= maxCharsPerPage) {
      return [content];
    }
    
    const pages = [];
    let currentPage = '';
    const words = content.split(' ');
    
    for (const word of words) {
      const testPage = currentPage + (currentPage ? ' ' : '') + word;
      if (testPage.length > maxCharsPerPage) {
        if (currentPage) {
          pages.push(currentPage);
          currentPage = word;
        } else {
          pages.push(word);
          currentPage = '';
        }
      } else {
        currentPage = testPage;
      }
    }
    
    if (currentPage) {
      pages.push(currentPage);
    }
    
    return pages.length > 0 ? pages : [''];
  };

  // Dividir conteúdo em páginas
  const rodaPages = splitContentIntoPages(formData.rodaInicial || '');
  const dirigidaPages = splitContentIntoPages(formData.atividadeDirigida || '');
  const livrePages = splitContentIntoPages(formData.atividadeLivreEscolha || '');
  const diversificadaPages = splitContentIntoPages(formData.atividadeDiversificada || '');

  // Calcular o número real de páginas necessárias
  const maxPages = Math.max(
    rodaPages.length,
    dirigidaPages.length,
    livrePages.length,
    diversificadaPages.length,
    1
  );

  // Função melhorada para verificar se uma página tem conteúdo real
  const hasRealContentOnPage = (pageIndex) => {
    const rodaContent = rodaPages[pageIndex] && rodaPages[pageIndex].trim();
    const dirigidaContent = dirigidaPages[pageIndex] && dirigidaPages[pageIndex].trim();
    const livreContent = livrePages[pageIndex] && livrePages[pageIndex].trim();
    const diversificadaContent = diversificadaPages[pageIndex] && diversificadaPages[pageIndex].trim();
    
    return rodaContent || dirigidaContent || livreContent || diversificadaContent;
  };

  // Calcular páginas com conteúdo real - corrigido
  const pagesWithContent = [];
  for (let i = 0; i < maxPages; i++) {
    if (i === 0 || hasRealContentOnPage(i)) {  // Sempre inclui a primeira página
      pagesWithContent.push(i);
    }
  }

  // Se não há páginas com conteúdo, pelo menos uma página
  const actualPages = pagesWithContent.length > 0 ? pagesWithContent.length : 1;

  const HeaderComponent = () => (
    <div className="pdf-header">
      <div className="pdf-title">
        <h1>
          PLANEJAMENTO DA SEMANA {formData.weekStart || 'XX'} à {formData.weekEnd || 'XX'} de {formData.month || '[mês]'}
        </h1>
      </div>
      <div className="pdf-logo">
        {!logoError ? (
          <img 
            src="/src/assets/logo.png"
            alt="Logo Cidade de São Paulo - Educação" 
            className="logo-image"
            onLoad={() => console.log('Logo carregado com sucesso')}
            onError={(e) => {
              console.log('Erro ao carregar logo:', e);
              setLogoError(true);
            }}
          />
        ) : (
          <div className="logo-placeholder">
            <div className="logo-text">
              <div className="logo-line1">CIDADE DE</div>
              <div className="logo-line2">SÃO PAULO</div>
              <div className="logo-line3">EDUCAÇÃO</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="pdf-generator" lang="pt-BR">
      <div className="pdf-preview" ref={pdfRef}>
        {pagesWithContent.map((pageIndex, displayIndex) => (
          <div key={pageIndex} className="pdf-page" lang="pt-BR">
            <HeaderComponent />
            
            <div className="pdf-table">
              <table>
                <thead>
                  <tr>
                    <th>RODA INICIAL</th>
                    <th>ATIVIDADE DIRIGIDA</th>
                    <th>ATIVIDADE DE LIVRE ESCOLHA DA CRIANÇA</th>
                    <th>ATIVIDADE DIVERSIFICADA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="content-cell" lang="pt-BR">
                        {rodaPages[pageIndex] || ''}
                      </div>
                    </td>
                    <td>
                      <div className="content-cell" lang="pt-BR">
                        {dirigidaPages[pageIndex] || ''}
                      </div>
                    </td>
                    <td>
                      <div className="content-cell" lang="pt-BR">
                        {livrePages[pageIndex] || ''}
                      </div>
                    </td>
                    <td>
                      <div className="content-cell" lang="pt-BR">
                        {diversificadaPages[pageIndex] || ''}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <div className="pdf-controls">
        <button 
          onClick={generatePDF}
          disabled={!isFormValid}
          className="generate-pdf-btn"
        >
          📄 Salvar em PDF
        </button>
        {!isFormValid && (
          <p className="validation-message">
            Preencha a semana e o mês para gerar o PDF
          </p>
        )}
      </div>
    </div>
  );
};

export default PDFGenerator;