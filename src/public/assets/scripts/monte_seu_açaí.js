document.addEventListener("DOMContentLoaded", function () {
    const modalTitle = document.getElementById("modal-title");
    const acompanhamentos = document.getElementById("acompanhamentos");
    const sizeOptions = document.getElementById("size-options");
    const modalPreco = document.getElementById("modal-preco");
    const modal = document.getElementById("modal"); // Seleciona o modal
    const fecharBtn = document.querySelector(".fechar"); // Seleciona o botão de fechar
    let produtoSelecionado = null;

    // Função para abrir o modal
    function abrirModal(produto) {
        produtoSelecionado = { tipo: produto };
        modalTitle.innerText = "Monte seu Açaí";
        modal.style.display = "flex"; // Exibe o modal
    }

    // Função para fechar o modal
    function fecharModal() {
        modal.style.display = "none"; // Esconde o modal
    }

    // Adiciona eventos aos botões
    document.querySelectorAll(".styled-button").forEach(button => {
        button.addEventListener("click", function () {
            if (this.innerText.includes("Monte o seu Açaí")) {
                abrirModal("acai");
            }
        });
    });

    // Fecha o modal ao clicar no botão de fechar
    if (fecharBtn) {
        fecharBtn.addEventListener("click", fecharModal);
    }

    // Fecha o modal ao clicar fora dele
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            fecharModal();
        }
    });

    // Atualiza o preço total
    function atualizarPreco() {
        if (!sizeOptions) return;

        let precoTotal = parseFloat(sizeOptions.selectedOptions[0]?.dataset.preco) || 0;

        const acompanhamentosSelecionados = document.querySelectorAll("#acompanhamentos input[type='number']");
        acompanhamentosSelecionados.forEach(acomp => {
            const quantidade = parseInt(acomp.value) || 0;
            precoTotal += (parseFloat(acomp.dataset.preco) || 0) * quantidade;
        });

        if (modalPreco) {
            modalPreco.textContent = `Preço: R$${precoTotal.toFixed(2)}`;
        }
    }

    // Adiciona evento de mudança para atualizar o preço quando a quantidade mudar
    document.querySelectorAll("#acompanhamentos input[type='number']").forEach(input => {
        input.addEventListener("input", atualizarPreco);
    });

    // Função para adicionar ao carrinho
    function adicionarAoCarrinho(produto, precoTotal, adicionais) {
        const carrinhoItens = document.getElementById("carrinho-itens");
        const carrinhoTotal = document.getElementById("carrinho-total");

        // Adiciona o item ao carrinho
        const item = document.createElement("div");
        item.classList.add("carrinho-item");
        item.innerHTML = `
            <p>${produto}</p>
            <p>Preço: R$${precoTotal.toFixed(2)}</p>
            <p>Adicionais: ${adicionais.map(a => `${a.nome} (x${a.quantidade})`).join(", ")}</p>
        `;
        carrinhoItens.appendChild(item);

        // Atualiza o total do carrinho
        const totalAtual = parseFloat(carrinhoTotal.textContent.replace(",", ".")) || 0;
        const novoTotal = totalAtual + precoTotal;
        carrinhoTotal.textContent = novoTotal.toFixed(2).replace(".", ",");
    }

    // Confirma a compra
    document.getElementById("confirmarCompra")?.addEventListener("click", () => {
        if (produtoSelecionado && sizeOptions) {
            const tamanho = sizeOptions.selectedOptions[0].textContent;
            const precoBase = parseFloat(sizeOptions.selectedOptions[0]?.dataset.preco) || 0;
            let precoTotal = precoBase;

            const adicionais = [];
            document.querySelectorAll("#acompanhamentos input[type='number']").forEach(input => {
                const quantidade = parseInt(input.value) || 0;
                if (quantidade > 0) {
                    const precoAdicional = parseFloat(input.dataset.preco) || 0;
                    adicionais.push({ nome: input.name, quantidade, preco: precoAdicional });
                    precoTotal += precoAdicional * quantidade;
                }
            });

            console.log(`Produto: ${produtoSelecionado.tipo} - ${tamanho}, Preço Total: R$${precoTotal.toFixed(2)}`, adicionais);

            adicionarAoCarrinho(`${produtoSelecionado.tipo} - ${tamanho}`, precoTotal, adicionais);
            fecharModal(); // Fecha o modal após confirmar a compra
        }
    });

    // Gera os produtos no container
    function gerarProdutos(produtos) {
        const container = document.getElementById("produtos-container");
        if (!container) {
            console.error("Container de produtos não encontrado");
            return;
        }
        container.innerHTML = "";

        produtos.forEach(produto => {
            const card = document.createElement("div");
            card.classList.add("produto-card");

            card.innerHTML = `
                <div class="produto-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="descricao">${produto.descricao}</p>
                    <p class="preco">${produto.preco}</p>
                    <button class="btn-adicionar">Monte Agora</button>
                </div>
            `;

            const botao = card.querySelector(".btn-adicionar");
            botao.addEventListener("click", () => abrirModal(produto.tipo));
            container.appendChild(card);
        });
    }

    // Dados dos produtos
    const produtos = [
        {
            nome: "Açaí Tradicional",
            descricao: "Monte seu açaí do seu jeito",
            preco: "A partir de R$ 14,00",
            imagem: "assets/img/acai-tradicional.png",
            tipo: "acai"
        }
    ];

    // Inicializa os produtos na página
    gerarProdutos(produtos);

    // Função para incrementar e decrementar a quantidade
    document.querySelectorAll('.quantity-controls').forEach(function(control) {
        const input = control.querySelector('input[type="number"]');
        const incrementButton = control.querySelector('.increment');
        const decrementButton = control.querySelector('.decrement');

        // Set the max attribute dynamically
        input.setAttribute('max', '10'); // Set the desired max value here

        incrementButton.addEventListener('click', function() {
            if (input.value < input.max) {
                input.value = parseInt(input.value) + 1;
                atualizarPreco();
            }
        });

        decrementButton.addEventListener('click', function() {
            if (input.value > input.min) {
                input.value = parseInt(input.value) - 1;
                atualizarPreco();
            }
        });
    });
});