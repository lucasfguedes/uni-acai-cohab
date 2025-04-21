document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário é admin
    function verificarAdmin() {
        // Na prática, você faria uma requisição para verificar no backend
        const isAdmin = true; // Simulação
        if (!isAdmin) {
            window.location.href = 'nao-autorizado.html';
        }
    }
    
    verificarAdmin();

    // Formatar valores monetários
    function formatarMoeda(valor) {
        return parseFloat(valor).toFixed(2).replace('.', ',');
    }

    // Atualizar preços
    document.querySelectorAll('.price-item').forEach(item => {
        const btn = item.querySelector('.btn');
        const inputPreco = item.querySelector('input[type="number"]');
        
        // Formatar valor inicial
        inputPreco.value = formatarMoeda(inputPreco.value);
        
        btn.addEventListener('click', function() {
            const produto = item.querySelector('input[type="text"]').value;
            const novoPreco = parseFloat(inputPreco.value.replace(',', '.'));
            
            if (isNaN(novoPreco)) {
                alert('Por favor, insira um valor válido');
                return;
            }
            
            // Aqui você faria a requisição para atualizar no backend
            console.log(`Atualizando ${produto} para R$ ${formatarMoeda(novoPreco)}`);
            
            // Simulação de atualização
            alert(`Preço de ${produto} atualizado para R$ ${formatarMoeda(novoPreco)}`);
            
            // Atualizar visualização
            inputPreco.value = formatarMoeda(novoPreco);
        });
    });

    // Validar entrada de preços
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function(e) {
            // Garantir que só tenha números e um ponto decimal
            let valor = e.target.value.replace(/[^0-9,]/g, '');
            valor = valor.replace(/(,.*?),/g, '$1');
            e.target.value = valor;
        });
    });

    // Ativar menu atual
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});