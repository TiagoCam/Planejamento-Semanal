import React, { useRef, useState, forwardRef } from 'react';
import logoImage from '../assets/logo.png'; // Importar a imagem diretamente
import './PDFGenerator.css';

const PDFGenerator = forwardRef(({ formData }, ref) => {
  const [logoError, setLogoError] = useState(false);

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
            src={logoImage} // Usar a imagem importada
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
      <div className="pdf-preview" ref={ref}>
        {pagesWithContent.slice(0, 10).map((pageIndex, displayIndex) => ( // Limitar a 10 páginas
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
    </div>
  );
});

PDFGenerator.displayName = 'PDFGenerator';

export default PDFGenerator;