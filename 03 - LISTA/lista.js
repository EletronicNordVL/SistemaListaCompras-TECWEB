// Variáveis globais
let produtos = [];
let listaCompras = [];

// Elementos do DOM
const btnAdicionarItem = document.getElementById('btnAdicionarItem');
const btnEnviarServidor = document.getElementById('btnEnviarServidor');
const btnLimparLista = document.getElementById('btnLimparLista');
const listaComprasContainer = document.getElementById('listaCompras');
const progressoTexto = document.getElementById('progressoTexto');
const barraProgresso = document.getElementById('barraProgresso');

// Modal elementos
const modalAdicionar = document.getElementById('modalAdicionar');
const modalConfirmacao = document.getElementById('modalConfirmacao');
const closeModal = document.getElementById('closeModal');
const selectProduto = document.getElementById('selectProduto');
const quantidadeNecessaria = document.getElementById('quantidadeNecessaria');
const btnConfirmarAdicao = document.getElementById('btnConfirmarAdicao');
const btnCancelarAdicao = document.getElementById('btnCancelarAdicao');
const btnConfirmarEnvio = document.getElementById('btnConfirmarEnvio');
const btnCancelarEnvio = document.getElementById('btnCancelarEnvio');

// Event Listeners
document.addEventListener('DOMContentLoaded', inicializar);
btnAdicionarItem.addEventListener('click', abrirModalAdicionar);
btnEnviarServidor.addEventListener('click', abrirModalConfirmacao);
btnLimparLista.addEventListener('click', limparLista);
closeModal.addEventListener('click', fecharModalAdicionar);
btnConfirmarAdicao.addEventListener('click', adicionarItemLista);
btnCancelarAdicao.addEventListener('click', fecharModalAdicionar);
btnConfirmarEnvio.addEventListener('click', enviarParaServidor);
btnCancelarEnvio.addEventListener('click', fecharModalConfirmacao);

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
    if (event.target === modalAdicionar) {
        fecharModalAdicionar();
    }
    if (event.target === modalConfirmacao) {
        fecharModalConfirmacao();
    }
});

// Inicialização
function inicializar() {
    carregarDados();
    preencherSelectProdutos();
    renderizarLista();
    atualizarProgresso();
}

// Carrega dados do localStorage
function carregarDados() {
    // Carregar produtos cadastrados
    const produtosSalvos = localStorage.getItem('listaProdutos');
    if (produtosSalvos) {
        produtos = JSON.parse(produtosSalvos).filter(p => p.ativo);
    }

    // Carregar lista de compras atual
    const listaSalva = localStorage.getItem('listaCompras');
    if (listaSalva) {
        listaCompras = JSON.parse(listaSalva);
    }
}

// Salva lista de compras no localStorage
function salvarListaCompras() {
    localStorage.setItem('listaCompras', JSON.stringify(listaCompras));
}

// Preenche select com produtos ativos
function preencherSelectProdutos() {
    selectProduto.innerHTML = '<option value="">Escolha um produto</option>';
    
    // Filtrar produtos que não estão na lista
    const produtosDisponiveis = produtos.filter(produto => 
        !listaCompras.some(item => item.codigoProduto === produto.codigo)
    );

    produtosDisponiveis.forEach(produto => {
        const option = document.createElement('option');
        option.value = produto.codigo;
        option.textContent = `${produto.nomeProduto} (${produto.quantidade} ${obterDescricaoUnidade(produto.unidade)})`;
        selectProduto.appendChild(option);
    });

    // Desabilitar botão se não há produtos disponíveis
    btnAdicionarItem.disabled = produtosDisponiveis.length === 0;
    if (produtosDisponiveis.length === 0) {
        btnAdicionarItem.title = 'Todos os produtos ativos já estão na lista ou não há produtos cadastrados';
    } else {
        btnAdicionarItem.title = 'Adicionar produto à lista';
    }
}

// Obtém descrição da unidade
function obterDescricaoUnidade(unidade) {
    const unidades = {
        'un': 'Un',
        'kg': 'Kg',
        'lt': 'Lt',
        'mt': 'Mt',
        'pc': 'Pc'
    };
    return unidades[unidade] || unidade;
}

// Abre modal para adicionar item
function abrirModalAdicionar() {
    if (produtos.length === 0) {
        mostrarMensagem('Não há produtos cadastrados. Cadastre produtos primeiro.', 'warning');
        return;
    }
    
    preencherSelectProdutos();
    modalAdicionar.style.display = 'block';
    selectProduto.focus();
}

// Fecha modal de adicionar
function fecharModalAdicionar() {
    modalAdicionar.style.display = 'none';
    selectProduto.value = '';
    quantidadeNecessaria.value = '';
}

// Adiciona item à lista de compras
function adicionarItemLista() {
    const codigoProduto = parseInt(selectProduto.value);
    const quantidade = parseFloat(quantidadeNecessaria.value);

    // Validações
    if (!codigoProduto) {
        mostrarMensagem('Selecione um produto.', 'error');
        return;
    }

    if (!quantidade || quantidade <= 0) {
        mostrarMensagem('Informe uma quantidade válida.', 'error');
        return;
    }

    const produto = produtos.find(p => p.codigo === codigoProduto);
    if (!produto) {
        mostrarMensagem('Produto não encontrado.', 'error');
        return;
    }

    // Verificar se já está na lista
    if (listaCompras.some(item => item.codigoProduto === codigoProduto)) {
        mostrarMensagem('Este produto já está na lista.', 'warning');
        return;
    }

    // Adicionar à lista
    const novoItem = {
        codigoProduto: produto.codigo,
        nomeProduto: produto.nomeProduto,
        unidade: produto.unidade,
        quantidadeNecessaria: quantidade,
        quantidadeComprada: 0,
        coletado: false
    };

    listaCompras.push(novoItem);
    salvarListaCompras();
    renderizarLista();
    atualizarProgresso();
    fecharModalAdicionar();
    mostrarMensagem(`${produto.nomeProduto} adicionado à lista!`, 'success');
}

// Renderiza a lista de compras
function renderizarLista() {
    if (listaCompras.length === 0) {
        listaComprasContainer.innerHTML = `
            <div class="lista-vazia">
                <h3>Sua lista está vazia</h3>
                <p>Adicione produtos para começar suas compras.</p>
            </div>
        `;
        return;
    }

    listaComprasContainer.innerHTML = listaCompras.map((item, index) => `
        <div class="item-lista ${item.coletado ? 'coletado' : ''}">
            <div class="item-info">
                <div class="item-nome ${item.coletado ? 'coletado' : ''}">${item.nomeProduto}</div>
                <div class="item-detalhes">
                    Necessário: ${item.quantidadeNecessaria} ${obterDescricaoUnidade(item.unidade)} | 
                    Comprado: ${item.quantidadeComprada} ${obterDescricaoUnidade(item.unidade)}
                    ${item.coletado ? ' | ✅ Coletado' : ''}
                </div>
            </div>
            <div class="item-controles">
                <div class="quantidade-controle">
                    <label>Comprado:</label>
                    <input 
                        type="number" 
                        class="quantidade-input" 
                        value="${item.quantidadeComprada}" 
                        min="0" 
                        step="0.01"
                        onchange="atualizarQuantidade(${index}, this.value)"
                        ${item.coletado ? 'disabled' : ''}
                    >
                    <span>${obterDescricaoUnidade(item.unidade)}</span>
                </div>
                <button 
                    onclick="removerItem(${index})" 
                    class="btn-danger"
                    title="Remover da lista"
                >
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Atualiza quantidade comprada
function atualizarQuantidade(index, valor) {
    const quantidade = parseFloat(valor) || 0;
    listaCompras[index].quantidadeComprada = quantidade;
    
    // Verificar se foi coletado (quantidade comprada >= necessária)
    const item = listaCompras[index];
    const foiColetado = quantidade >= item.quantidadeNecessaria;
    
    if (item.coletado !== foiColetado) {
        item.coletado = foiColetado;
        renderizarLista();
        
        if (foiColetado) {
            mostrarMensagem(`${item.nomeProduto} marcado como coletado!`, 'success');
        }
    }
    
    salvarListaCompras();
    atualizarProgresso();
}

// Remove item da lista
function removerItem(index) {
    const item = listaCompras[index];
    
    if (confirm(`Remover "${item.nomeProduto}" da lista?`)) {
        listaCompras.splice(index, 1);
        salvarListaCompras();
        renderizarLista();
        atualizarProgresso();
        preencherSelectProdutos();
        mostrarMensagem('Item removido da lista.', 'info');
    }
}

// Atualiza barra de progresso
function atualizarProgresso() {
    const totalItens = listaCompras.length;
    const itensColetados = listaCompras.filter(item => item.coletado).length;
    
    progressoTexto.textContent = `${itensColetados} de ${totalItens} itens coletados`;
    
    const porcentagem = totalItens > 0 ? (itensColetados / totalItens) * 100 : 0;
    barraProgresso.style.width = `${porcentagem}%`;
    
    // Habilitar botão de envio se todos os itens foram coletados
    btnEnviarServidor.disabled = totalItens === 0 || itensColetados < totalItens;
    
    if (totalItens > 0 && itensColetados === totalItens) {
        mostrarMensagem('Todos os itens foram coletados! Você pode enviar para o servidor agora.', 'success');
    }
}

// Limpa toda a lista
function limparLista() {
    if (listaCompras.length === 0) {
        mostrarMensagem('A lista já está vazia.', 'info');
        return;
    }
    
    if (confirm('Tem certeza que deseja limpar toda a lista de compras?')) {
        listaCompras = [];
        salvarListaCompras();
        renderizarLista();
        atualizarProgresso();
        preencherSelectProdutos();
        mostrarMensagem('Lista de compras limpa.', 'info');
    }
}

// Abre modal de confirmação de envio
function abrirModalConfirmacao() {
    modalConfirmacao.style.display = 'block';
}

// Fecha modal de confirmação
function fecharModalConfirmacao() {
    modalConfirmacao.style.display = 'none';
}

// Envia lista para o servidor (mockapi.io)
async function enviarParaServidor() {
    const API_URL = 'https://684f7ca9e7c42cfd1794cf70.mockapi.io/Compras';
    
    try {
        btnConfirmarEnvio.disabled = true;
        btnConfirmarEnvio.textContent = 'Enviando...';
        
        // Preparar dados para envio
        const dadosEnvio = {
            codCompras: Date.now(), // Usar timestamp como código único
            data: new Date().toISOString().split('T')[0], // Data atual
            produtos: listaCompras.map(item => ({
                codigoProduto: item.codigoProduto,
                nomeProduto: item.nomeProduto,
                unidade: item.unidade,
                quantidadeNecessaria: item.quantidadeNecessaria,
                quantidadeComprada: item.quantidadeComprada,
                coletado: item.coletado
            }))
        };
        
        // Fazer requisição POST
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosEnvio)
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        
        // Sucesso - limpar lista
        listaCompras = [];
        salvarListaCompras();
        renderizarLista();
        atualizarProgresso();
        preencherSelectProdutos();
        
        fecharModalConfirmacao();
        mostrarMensagem('Lista enviada com sucesso para o servidor!', 'success');
        
    } catch (error) {
        console.error('Erro ao enviar para o servidor:', error);
        mostrarMensagem('Erro ao enviar lista para o servidor. Verifique sua conexão.', 'error');
    } finally {
        btnConfirmarEnvio.disabled = false;
        btnConfirmarEnvio.textContent = 'Sim, Enviar';
    }
}

// Mostra mensagens para o usuário
function mostrarMensagem(mensagem, tipo = 'info') {
    // Remove mensagens existentes
    const mensagensExistentes = document.querySelectorAll('.mensagem-sistema');
    mensagensExistentes.forEach(msg => msg.remove());

    // Cria nova mensagem
    const divMensagem = document.createElement('div');
    divMensagem.className = `mensagem-sistema mensagem-${tipo}`;
    divMensagem.innerHTML = `
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">&times;</button>
    `;

    // Adiciona estilos
    Object.assign(divMensagem.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '9999',
        maxWidth: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        animation: 'slideInRight 0.3s ease'
    });

    // Define cor baseada no tipo
    switch (tipo) {
        case 'success':
            divMensagem.style.backgroundColor = '#28a745';
            break;
        case 'error':
            divMensagem.style.backgroundColor = '#dc3545';
            break;
        case 'warning':
            divMensagem.style.backgroundColor = '#ffc107';
            divMensagem.style.color = '#212529';
            break;
        default:
            divMensagem.style.backgroundColor = '#17a2b8';
    }

    document.body.appendChild(divMensagem);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (divMensagem.parentElement) {
            divMensagem.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => divMensagem.remove(), 300);
        }
    }, 5000);
}

// Adiciona estilos adicionais específicos da lista
const style = document.createElement('style');
style.textContent = `
    .lista-vazia {
        text-align: center;
        padding: 3rem;
        color: #6c757d;
    }
    
    .lista-vazia h3 {
        margin-bottom: 1rem;
        color: #495057;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);