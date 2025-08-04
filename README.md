# Sistema de Planejamento Semanal

Sistema web responsivo para gerar PDFs de planejamento semanal educacional.

## 🚀 Funcionalidades

- ✅ Interface responsiva (desktop e mobile)
- ✅ Formulário intuitivo para preenchimento
- ✅ Geração de PDF em formato A4 horizontal
- ✅ Layout fixo independente do dispositivo
- ✅ Campos editáveis para semana, mês e atividades
- ✅ Preview em tempo real do PDF
- ✅ Validação de campos obrigatórios

## 🛠️ Tecnologias

- React 18
- Vite
- jsPDF (geração de PDF)
- html2canvas (captura de tela)
- CSS Grid/Flexbox (responsividade)

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto:
```bash
npm run dev
```

3. Acesse: http://localhost:5173

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (até 768px)

## 📄 Geração de PDF

- Formato: A4 Horizontal (paisagem)
- Título à esquerda, logo à direita
- Tabela com 4 colunas de atividades
- Nome do arquivo: `Planejamento_Semana_XX_a_XX_Mes.pdf`

## 🎯 Como Usar

1. Preencha o período da semana (início e fim)
2. Selecione o mês
3. Adicione o conteúdo de cada atividade
4. Visualize o preview em tempo real
5. Clique em "Salvar em PDF" para gerar o arquivo

## 📋 Estrutura das Atividades

1. **RODA INICIAL** - Atividades de abertura
2. **ATIVIDADE DIRIGIDA** - Atividades orientadas
3. **ATIVIDADE DE LIVRE ESCOLHA DA CRIANÇA** - Atividades autônomas
4. **ATIVIDADE DIVERSIFICADA** - Atividades variadas

## 🔧 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 📁 Estrutura do Projeto