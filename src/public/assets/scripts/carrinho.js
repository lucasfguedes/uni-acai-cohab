document.addEventListener("DOMContentLoaded", () => {
    console.log('Script carregado!'); // Verifica se o script está sendo executado

    let carrinho = [];
    let total = 0;

    // Seleciona elementos do DOM
    const carrinhoIcon = document.getElementById('carrinho-icon');
    const closeButton = document.querySelector('.fechar');
    const carrinhoItens = document.getElementById('carrinho-itens');
    const carrinhoTotal = document.getElementById('carrinho-total');
    const carrinhoCount = document.getElementById('carrinho-count');
    const carrinhoModal = document.getElementById('carrinho-modal');

    // Adiciona evento ao ícone do carrinho
    if (carrinhoIcon) {
        carrinhoIcon.addEventListener('click', (e) => {
            e.preventDefault();
            carrinhoModal.style.display = 'flex'; // Abre o modal do carrinho
            atualizarCarrinho();
        });
    }

    // Adiciona evento ao botão de fechar o modal
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            carrinhoModal.style.display = 'none'; // Fecha o modal do carrinho
        });
    }

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === carrinhoModal) {
            carrinhoModal.style.display = 'none'; // Fecha o modal ao clicar fora
        }
    });

    // Função para adicionar itens ao carrinho
    function adicionarAoCarrinho(nome, preco, adicionais = []) {
        carrinho.push({ nome, preco, adicionais });
        total += preco;
        atualizarCarrinho();
    }

    // Exponha a função globalmente
    window.adicionarAoCarrinho = adicionarAoCarrinho;

    // Função para atualizar o carrinho na interface
    function atualizarCarrinho() {
        if (!carrinhoItens || !carrinhoTotal || !carrinhoCount) {
            console.error("Elementos do carrinho não encontrados!");
            return;
        }

        carrinhoItens.innerHTML = '';
        total = 0;

        carrinho.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add("carrinho-item");
            let adicionaisHtml = '';

            if (item.adicionais.length > 0) {
                adicionaisHtml = '<ul>';
                item.adicionais.forEach(adicional => {
                    adicionaisHtml += `<li>${adicional.nome} x${adicional.quantidade} - R$ ${(adicional.preco * adicional.quantidade).toFixed(2)}</li>`;
                });
                adicionaisHtml += '</ul>';
            }

            itemDiv.innerHTML = `
                <p>${item.nome} - R$ ${item.preco.toFixed(2)}</p>
                ${adicionaisHtml}
                <button class="remover-item" data-index="${index}">Remover</button>
            `;
            carrinhoItens.appendChild(itemDiv);
            total += item.preco;
        });

        carrinhoTotal.textContent = total.toFixed(2);
        carrinhoCount.textContent = carrinho.length;

        // Adiciona eventos aos botões "Remover"
        document.querySelectorAll(".remover-item").forEach(botao => {
            botao.addEventListener("click", (event) => {
                const index = event.target.dataset.index;
                removerDoCarrinho(index);
            });
        });
    }

    // Função para remover itens do carrinho
    function removerDoCarrinho(index) {
        const itemRemovido = carrinho.splice(index, 1)[0];
        total -= itemRemovido.preco;
        atualizarCarrinho();
    }

    // Função para finalizar o pedido
    function finalizarPedido() {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        alert('Pedido finalizado! Total: R$ ' + total.toFixed(2));
        imprimirPedido();
        carrinho = [];
        total = 0;
        atualizarCarrinho();
    }

    // Função para imprimir o pedido (simulação)
    function imprimirPedido() {
        const pedido = carrinho.map(item => {
            let adicionais = '';
            if (item.adicionais.length > 0) {
                adicionais = item.adicionais.map(adicional => `${adicional.nome} x${adicional.quantidade} - R$ ${(adicional.preco * adicional.quantidade).toFixed(2)}`).join('\n');
                adicionais = `\nAdicionais:\n${adicionais}`;
            }
            return `${item.nome} - R$ ${item.preco.toFixed(2)}${adicionais}`;
        }).join('\n');
        console.log('Pedido enviado para impressão:\n' + pedido + '\nTotal: R$ ' + total.toFixed(2));
    }

    // Exemplo de uso: Adicionar itens ao carrinho
    // adicionarAoCarrinho("Açaí de 300ml", 10.00);
});