# 📋 Módulo 03 - Gerenciador da Lista de Compras

Este módulo contém a interface e a inteligência de controle da **lista de compras e envio dos dados ao servidor** [11].

---

## 📄 Arquivos Presentes

- **`lista.html`**: Estrutura da página com controles da lista, barra de progresso, container dos itens e janelas modais de adição e confirmação.
- **`lista.js`**: Lógica para controle da lista, cálculo do progresso de itens coletados, controle dos modais e integração HTTP via `fetch` API [11, 13, 18, 20, 22].

---

## ⚙️ Funcionalidades e Regras de Negócio

1. **Adição de Itens**:
   - Apenas produtos **ativos** cadastrados no sistema e que ainda não estejam na lista aparecem no seletor do modal [13, 14].
   - Definição da quantidade necessária para a compra [16].

2. **Progresso das Compras**:
   - Ao alterar a quantidade comprada de um item, o sistema verifica automaticamente se atendeu à quantidade necessária [18].
   - A barra de progresso em porcentagem (`.progresso-fill`) e o indicador numérico são atualizados em tempo real [20].
   - Itens coletados recebem marcação visual com estilo tachado e fundo verde [17, 33].

3. **Sincronização em Nuvem**:
   - O botão **"Enviar para Servidor"** permanece desabilitado até que 100% dos itens da lista sejam devidamente coletados [20].
   - Envio de requisição assíncrona `POST` para API REST simulando o salvamento da compra com registro de data e timestamp [22].
   - Limpeza automática da lista após o envio bem-sucedido [22].
