/* Aqui temos as variáveis globais */
let produtos = [];
let produtoEditando = null;
let proximoCodigo = 1;

/* Elementos do DOM */
const formProduto = document.getElementById('formProduto');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const campoBusca = document.getElementById('campoBusca');
const corpoTabela = document.getElementById('corpoTabela');

/* Event Listeners */
document.addEventListener('DOMContentLoaded', inicializar);
formProduto.addEventListener('submit', salvarProduto);
btnCancelar.addEventListener('click', cancelarEdicao);
campoBusca.addEventListener('input', filtrarProdutos);

/* Inicialização */
function inicializar() {
    carregarProdutos();
    atualizarProximoCodigo();
    renderizarTabela();
}

/* Carrega produtos do localStorage */
function carregarProdutos() {
    const produtosSalvos = localStorage.getItem('listaProdutos');
    if (produtosSalvos) {
        produtos = JSON.parse(produtosSalvos);
    }
}

/* Salva produtos no localStorage */
function salvarProdutos() {
    localStorage.setItem('listaProdutos', JSON.stringify(produtos));
}

/* Atualiza o próximo código disponível */
function atualizarProximoCodigo() {
    if (produtos.length > 0) {
        const maiorCodigo = Math.max(...produtos.map(p => p.codigo));
        proximoCodigo = maiorCodigo + 1;
    }
}

/* Salva ou atualiza produto */
function salvarProduto(event) {
    event.preventDefault();
    
    const formData = new FormData(formProduto);
    const dadosProduto = {
        nomeProduto: formData.get('nomeProduto').trim(),
        unidade: formData.get('unidade'),
        quantidade: parseFloat(formData.get('quantidade')),
        codigoBarra: formData.get('codigoBarra').trim(),
        ativo: formData.has('ativo')
    };

    /* Validações */
    if (!validarDados(dadosProduto)) {
        return;
    }

    if (produtoEditando) {
        /* Atualizar produto existente */
        const index = produtos.findIndex(p => p.codigo === produtoEditando.codigo);
        produtos[index] = { ...dadosProduto, codigo: produtoEditando.codigo };
        mostrarMensagem('Produto atualizado com sucesso!', 'success');
        cancelarEdicao();
    } else {
        
        /* Criar novo produto */
        const novoProduto = {
            ...dadosProduto,
            codigo: proximoCodigo
        };
        produtos.push(novoProduto);
        proximoCodigo++;
        mostrarMensagem('Produto cadastrado com sucesso!', 'success');
        formProduto.reset();
        document.getElementById('ativo').checked = true;
    }

    salvarProdutos();
    renderizarTabela();
}

/* Valida os dados do produto */
function validarDados(dados) {
    
    /* Validar nome do produto */
    if (!dados.nomeProduto || dados.nomeProduto.length < 2) {
        mostrarMensagem('Nome do produto deve ter pelo menos 2 caracteres.', 'error');
        return false;
    }

    /* Validar se nome já existe (exceto quando editando) */
    const nomeExistente = produtos.find(p => 
        p.nomeProduto.toLowerCase() === dados.nomeProduto.toLowerCase() && 
        (!produtoEditando || p.codigo !== produtoEditando.codigo)
    );
    if (nomeExistente) {
        mostrarMensagem('Já existe um produto com este nome.', 'error');
        return false;
    }

    /* Validar unidade */
    const unidadesValidas = ['un', 'kg', 'lt', 'mt', 'pc'];
    if (!unidadesValidas.includes(dados.unidade)) {
        mostrarMensagem('Selecione uma unidade válida.', 'error');
        return false;
    }

    /* Validar quantidade */
    if (!dados.quantidade || dados.quantidade <= 0) {
        mostrarMensagem('Quantidade deve ser maior que zero.', 'error');
        return false;
    }

    /* Validar código de barra (se fornecido) */
    if (dados.codigoBarra) {
        if (!/^\d{13}$/.test(dados.codigoBarra)) {
            mostrarMensagem('Código de barra deve conter exatamente 13 dígitos numéricos.', 'error');
            return false;
        }

        /* Verificar se código de barra já existe */
        const codigoExistente = produtos.find(p => 
            p.codigoBarra === dados.codigoBarra && 
            (!produtoEditando || p.codigo !== produtoEditando.codigo)
        );
        if (codigoExistente) {
            mostrarMensagem('Já existe um produto com este código de barra.', 'error');
            return false;
        }
    }

    return true;
}

/* Renderiza a tabela de produtos */
function renderizarTabela(produtosFiltrados = null) {
    const produtosParaExibir = produtosFiltrados || produtos;
    
    if (produtosParaExibir.length === 0) {
        corpoTabela.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    ${produtosFiltrados ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado ainda.'}
                </td>
            </tr>
        `;
        return;
    }

    corpoTabela.innerHTML = produtosParaExibir.map(produto => `
        <tr class="${!produto.ativo ? 'inativo' : ''}">
            <td>${produto.codigo}</td>
            <td>${produto.nomeProduto}</td>
            <td>${obterDescricaoUnidade(produto.unidade)}</td>
            <td>${produto.quantidade}</td>
            <td>${produto.codigoBarra || '-'}</td>
            <td>
                <span class="status-${produto.ativo ? 'ativo' : 'inativo'}">
                    ${produto.ativo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button onclick="editarProduto(${produto.codigo})" class="btn-warning" title="Editar">
                    ✏️
                </button>
                <button onclick="excluirProduto(${produto.codigo})" class="btn-danger" title="Excluir">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

/* Obtém descrição da unidade */
function obterDescricaoUnidade(unidade) {
    const unidades = {
        'un': 'Unidade',
        'kg': 'Quilograma',
        'lt': 'Litro',
        'mt': 'Metro',
        'pc': 'Pacote'
    };
    return unidades[unidade] || unidade;
}

/* Edita produto */
function editarProduto(codigo) {
    const produto = produtos.find(p => p.codigo === codigo);
    if (!produto) return;

    produtoEditando = produto;
    
    /* Preencher formulário */
    document.getElementById('nomeProduto').value = produto.nomeProduto;
    document.getElementById('unidade').value = produto.unidade;
    document.getElementById('quantidade').value = produto.quantidade;
    document.getElementById('codigoBarra').value = produto.codigoBarra || '';
    document.getElementById('ativo').checked = produto.ativo;

    /* Alterar botão */
    btnSalvar.textContent = 'Atualizar Produto';
    btnSalvar.className = 'btn-warning';
    
    /* Scroll para o formulário */
    formProduto.scrollIntoView({ behavior: 'smooth' });
}

/* Cancela edição */
function cancelarEdicao() {
    produtoEditando = null;
    formProduto.reset();
    document.getElementById('ativo').checked = true;
    btnSalvar.textContent = 'Cadastrar Produto';
    btnSalvar.className = 'btn-primary';
}

/* Exclui produto */
function excluirProduto(codigo) {
    const produto = produtos.find(p => p.codigo === codigo);
    if (!produto) return;

    if (confirm(`Tem certeza que deseja excluir o produto "${produto.nomeProduto}"?`)) {
        
        /* Verificar se produto está em alguma lista de compras */
        const listaCompras = JSON.parse(localStorage.getItem('listaCompras') || '[]');
        const produtoNaLista = listaCompras.find(item => item.codigoProduto === codigo);
        
        if (produtoNaLista) {
            if (!confirm('Este produto está na sua lista de compras atual. Deseja excluir mesmo assim? Ele será removido da lista.')) {
                return;
            }
            
            /* Remove da lista de compras */
            const novaListaCompras = listaCompras.filter(item => item.codigoProduto !== codigo);
            localStorage.setItem('listaCompras', JSON.stringify(novaListaCompras));
        }

        produtos = produtos.filter(p => p.codigo !== codigo);
        salvarProdutos();
        renderizarTabela();
        mostrarMensagem('Produto excluído com sucesso!', 'success');
    }
}

/* Filtra produtos na tabela */
function filtrarProdutos() {
    const termo = campoBusca.value.toLowerCase().trim();
    
    if (!termo) {
        renderizarTabela();
        return;
    }

    const produtosFiltrados = produtos.filter(produto => 
        produto.nomeProduto.toLowerCase().includes(termo) ||
        produto.codigo.toString().includes(termo) ||
        (produto.codigoBarra && produto.codigoBarra.includes(termo))
    );

    renderizarTabela(produtosFiltrados);
}

/* Mostra mensagens para o usuário */
function mostrarMensagem(mensagem, tipo = 'info') {
    
    /* Remove mensagens existentes */
    const mensagensExistentes = document.querySelectorAll('.mensagem-sistema');
    mensagensExistentes.forEach(msg => msg.remove());

    /* Cria nova mensagem */
    const divMensagem = document.createElement('div');
    divMensagem.className = `mensagem-sistema mensagem-${tipo}`;
    divMensagem.innerHTML = `
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; margin-left: 1rem;">&times;</button>
    `;

    /* Adiciona estilos */
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

    /* Define cor baseada no tipo */
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

    /* Remove automaticamente após 5 segundos */
    setTimeout(() => {
        if (divMensagem.parentElement) {
            divMensagem.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => divMensagem.remove(), 300);
        }
    }, 5000);
}

/* Adiciona estilos para as animações das mensagens */
const style = document.createElement('style');
style.textContent = `
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
