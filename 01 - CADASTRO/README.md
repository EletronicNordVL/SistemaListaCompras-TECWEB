# 📦 Módulo 01 - Cadastro de Produtos

Este módulo contém os arquivos responsáveis pelo **gerenciamento e cadastro dos produtos** no sistema [1].

## 📄 Arquivos Presentes

- **`Cadastro.html`**: Estrutura da página contendo o formulário de cadastro, a barra de busca e a tabela de exibição dos produtos.
- **`cadastro.js`**: Lógica em JavaScript para validação de formulários, persistência em `localStorage`, tabela interativa e filtro de busca em tempo real [1,2,4,8].

## ⚙️ Funcionalidades e Regras de Negócio

1. **Campos do Formulário**:
   - `Nome do Produto` (Obrigatório, mínimo de 2 caracteres, deve ser único) [3,4].
   - `Unidade` (Unidade, Quilograma, Litro, Metro, Pacote) [3,4].
   - `Quantidade` (Obrigatório, número maior que zero) [3,4].
   - `Código de Barra` (Opcional, se preenchido deve possuir exatamente 13 dígitos numéricos EAN-13 e ser único) [3,4].
   - `Produto Ativo` (Checkbox para indicar disponibilidade para a lista de compras) [3,5].

2. **Operações**:
   - **Salvar/Editar**: O botão alterna dinamicamente entre cadastrar novo produto e atualizar registro existente [3,6].
   - **Excluir**: Confirmação do usuário com verificação se o produto está vinculado a uma lista de compras ativa antes de remover [7].
   - **Busca**: Campo de entrada com escuta no evento `input` que filtra instantaneamente por nome, código ou código de barra [1,8].
   - **Alertas**: Notificações *toast* flutuantes temporárias informando sucesso ou erros de validação [9].
