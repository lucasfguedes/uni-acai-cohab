document.addEventListener("DOMContentLoaded", function() {
    // Verificar se o usuário é admin
    function verificarAdmin() {
        // Na prática, você faria uma requisição para verificar no backend
        const isAdmin = true; // Simulação
        if (!isAdmin) {
            window.location.href = 'nao-autorizado.html';
        }
    }
    
    verificarAdmin();

    // Elementos do DOM
    const formProduto = document.getElementById('formProduto');
    const produtosContainer = document.getElementById('produtos-container');
    const inputs = {
        nome: document.getElementById('nome'),
        descricao: document.getElementById('descricao'),
        preco: document.getElementById('preco'),
        imagem: document.getElementById('imagem')
    };

    // Formatar preço
    inputs.preco.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = (value/100).toFixed(2) + '';
        value = value.replace(".", ",");
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        e.target.value = 'R$ ' + value;
    });

    // Salvar produtos
    function salvarProdutos(produtos) {
        localStorage.setItem("produtos", JSON.stringify(produtos));
    }

    // Carregar produtos
    function carregarProdutos() {
        const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        exibirProdutos(produtos);
        return produtos;
    }

    // Exibir produtos
    function exibirProdutos(produtos) {
        produtosContainer.innerHTML = produtos.map(produto => `
            <div class="card">
                <div class="image-container">
                    <img src="${produto.imagem || 'img_adm/sem-imagem.jpg'}" alt="${produto.nome}">
                </div>
                <div class="content">
                    <h2>${produto.nome}</h2>
                    <p>${produto.descricao}</p>
                    <p class="price">${produto.preco}</p>
                    <div class="actions">
                        <button class="btn-edit" data-id="${produto.id}">Editar</button>
                        <button class="btn-delete" data-id="${produto.id}">Excluir</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Adicionar produto
    formProduto.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Gerar ID único
        const id = Date.now().toString();
        
        const produto = {
            id,
            nome: inputs.nome.value.trim(),
            descricao: inputs.descricao.value.trim(),
            preco: inputs.preco.value.trim(),
            imagem: inputs.imagem.value.trim()
        };

        // Validar campos
        if (!produto.nome || !produto.preco) {
            alert('Nome e preço são obrigatórios!');
            return;
        }

        const produtos = [...carregarProdutos(), produto];
        salvarProdutos(produtos);
        
        // Limpar formulário
        formProduto.reset();
        exibirProdutos(produtos);
    });

    // Carregar produtos ao iniciar
    carregarProdutos();

    // Ativar menu atual
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});