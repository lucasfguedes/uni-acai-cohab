document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário é admin (simulação)
    function verificarAdmin() {
        // Na prática, você faria uma requisição para verificar no backend
        const isAdmin = true; // Simulação
        if (!isAdmin) {
            window.location.href = 'nao-autorizado.html';
        }
    }
    
    verificarAdmin();

    // Ativar menu atual
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Dropdown do usuário
    const userInfo = document.querySelector('.user-info');
    if (userInfo) {
        userInfo.addEventListener('click', function() {
            const dropdown = this.querySelector('.user-dropdown') || createDropdown();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    function createDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <a href="perfil.html">Meu Perfil</a>
            <a href="configuracoes.html">Configurações</a>
            <a href="logout.html">Sair</a>
        `;
        userInfo.appendChild(dropdown);
        return dropdown;
    }

    // Fechar dropdown ao clicar fora
    document.addEventListener('click', function(e) {
        if (!userInfo.contains(e.target)) {
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown) dropdown.style.display = 'none';
        }
    });
});