# 🛒 Sistema de Lista de Compras e Cadastro de Produtos

Projeto acadêmico desenvolvido para a disciplina de **Tecnologia Web**. A aplicação consiste em um sistema web completo, dinâmico e responsivo desenvolvido em **HTML5, CSS3 e JavaScript Vanilla (ES6+)**, sem dependência de frameworks externos [1, 2, 3].

O sistema permite gerenciar o ciclo de vida de produtos (CRUD no browser com validações rigorosas) e montar listas de compras interativas com barra de progresso em tempo real, persistência local e sincronização com API REST remota [2, 4, 20, 22].

---

## 📂 Estrutura do Repositório

O repositório está organizado em módulos numerados conforme a estrutura abaixo:

```text
.
├── 01 - CADASTRO/
│   ├── Cadastro.html
│   ├── cadastro.js
│   └── README.md
├── 02 - INDEX/
│   ├── index.html
│   └── README.md
├── 03 - LISTA/
│   ├── lista.html
│   ├── lista.js
│   └── README.md
└── 04 - STYLES/
    ├── styles.css
    └── README.md
```

---

## 🚀 Funcionalidades Principais

### 📦 1. Módulo de Cadastro (`01 - CADASTRO`)
- **Gerenciamento de Produtos (CRUD)**: Cadastre, edite e exclua produtos [3, 6, 7].
- **Validações de Dados**: Validação de nomes únicos, seleção obrigatória de unidade (`un`, `kg`, `lt`, `mt`, `pc`), quantidades positivas e código de barras EAN-13 (13 dígitos numéricos) [4].
- **Busca em Tempo Real**: Filtro dinamizado por nome, código ou código de barras na tabela [5, 8].
- **Status do Produto**: Marcação visual entre produtos ativos e inativos [5].

### 🏠 2. Página Principal (`02 - INDEX`)
- **Portal de Acesso**: Landing page interativa com cartões explicativos sobre as funcionalidades [37].
- **Navegação Rápida**: Botões direcionando diretamente para as áreas de cadastro e compras.

### 📋 3. Gerenciador de Lista de Compras (`03 - LISTA`)
- **Montagem Dinâmica**: Seleção exclusiva de produtos ativos previamente cadastrados [13, 14].
- **Controle de Progresso**: Cálculo automático da quantidade comprada vs. necessária e atualização visual da barra de progresso [18, 20].
- **Sincronização com API**: Envio dos dados finalizados via requisição HTTP `POST` para servidor REST (`mockapi.io`) assim que todos os itens são coletados [20, 22].
- **Persistência**: Armazenamento do estado da lista no `localStorage` [13, 14].

### 🎨 4. Design System & Responsividade (`04 - STYLES`)
- **Estilização Moderna**: Layout limpo com gradientes modernos (#667eea a #764ba2) e tipografia legível [26].
- **Componentes Avançados**: Modais sobrepostos [34], notificações no estilo *toast* [9, 23] e badges de status [36].
- **Responsividade**: Adaptação para dispositivos móveis via Media Queries `@media (max-width: 768px)` [37].

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estruturação semântica das páginas (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- **CSS3**: Layouts com Flexbox e CSS Grid, transições, animações (`@keyframes`) e responsividade [26, 28, 37].
- **JavaScript ES6+**: Manipulação do DOM, eventos, `localStorage`, `FormData`, Arrow Functions, Async/Await e `fetch` API [1, 3, 22].

---

## 💻 Como Executar o Projeto

1. Clone o repositório ou faça o download dos arquivos:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Abra o arquivo `02 - INDEX/index.html` diretamente no seu navegador ou utilize a extensão **Live Server** no VS Code.
