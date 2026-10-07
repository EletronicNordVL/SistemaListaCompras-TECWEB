# 🎨 Módulo 04 - Estilos e Design System

Este módulo centraliza toda a **identidade visual e responsividade** da aplicação [26, 37].

---

## 📄 Arquivos Presentes

- **`styles.css`**: Folha de estilo CSS3 utilizada globalmente nas páginas do sistema [26].

---

## ⚙️ Diretrizes de Design

1. **Paleta de Cores & Gradientes**:
   - Primária/Header: Gradiente em tons roxo e azul (`linear-gradient(135deg, #667eea 0%, #764ba2 100%)`) [26].
   - Feedback: Sucesso/Ativo (`#28a745`), Perigo/Erro (`#dc3545`), Alerta/Edição (`#ffc107`), Neutro (`#6c757d`) [30, 36].

2. **Layout & Componentes**:
   - **Formulários e Tabelas**: Inputs com realce em foco (`:focus`), tabelas responsivas com rolagem horizontal e suporte para linhas inativas [28, 31, 32].
   - **Modais**: Estrutura com fundo semitransparente e animação suave de deslize (`@keyframes slideIn`) [34, 37].
   - **Barra de Progresso**: Container arredondado com preenchimento em gradiente verde [32].

3. **Responsividade (Mobile First / Breakpoints)**:
   - Configurado via `@media (max-width: 768px)` [37].
   - Reorganização do menu de navegação em coluna, expansão dos botões para 100% de largura e ajuste de preenchimentos para telas de smartphone [37].
