import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './PDFGenerator.css';

const PDFControls = ({ formData, pdfRef }) => {
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

  // Função para dividir conteúdo em páginas - melhorada para evitar páginas infinitas
  const splitContentIntoPages = (content, maxCharsPerPage = 800) => {
    if (!content || content.trim() === '') {
      return [''];
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
          // Se uma palavra é muito longa, força a quebra
          pages.push(word.substring(0, maxCharsPerPage));
          currentPage = word.substring(maxCharsPerPage);
        }
      } else {
        currentPage = testPage;
      }
    }
    
    if (currentPage) {
      pages.push(currentPage);
    }
    
    // Limitar o número máximo de páginas para evitar loops infinitos
    return pages.slice(0, 10); // Máximo 10 páginas
  };

  // Dividir conteúdo em páginas
  const rodaPages = splitContentIntoPages(formData.rodaInicial || '');
  const dirigidaPages = splitContentIntoPages(formData.atividadeDirigida || '');
  const livrePages = splitContentIntoPages(formData.atividadeLivreEscolha || '');
  const diversificadaPages = splitContentIntoPages(formData.atividadeDiversificada || '');

  // Calcular o número real de páginas necessárias - limitado
  const maxPages = Math.min(
    Math.max(
      rodaPages.length,
      dirigidaPages.length,
      livrePages.length,
      diversificadaPages.length,
      1
    ),
    10 // Máximo 10 páginas
  );

  // Função melhorada para verificar se uma página tem conteúdo real
  const hasRealContentOnPage = (pageIndex) => {
    const rodaContent = rodaPages[pageIndex] && rodaPages[pageIndex].trim();
    const dirigidaContent = dirigidaPages[pageIndex] && dirigidaPages[pageIndex].trim();
    const livreContent = livrePages[pageIndex] && livrePages[pageIndex].trim();
    const diversificadaContent = diversificadaPages[pageIndex] && diversificadaPages[pageIndex].trim();
    
    return rodaContent || dirigidaContent || livreContent || diversificadaContent;
  };

  // Calcular páginas com conteúdo real - limitado
  const pagesWithContent = [];
  for (let i = 0; i < maxPages; i++) {
    if (i === 0 || hasRealContentOnPage(i)) {
      pagesWithContent.push(i);
    }
  }

  // Garantir pelo menos uma página e máximo 10
  const actualPages = Math.min(Math.max(pagesWithContent.length, 1), 10);

  return (
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
      <p className="page-info">
        Páginas geradas: {actualPages} (máximo: 10)
      </p>
    </div>
  );
};

export default PDFControls;