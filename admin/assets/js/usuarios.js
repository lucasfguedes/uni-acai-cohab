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

    // Elementos do DOM
    const usersTable = document.getElementById('users-table');
    const usersList = document.getElementById('users-list');
    const modal = document.querySelector('.modal');
    const searchInput = document.getElementById('user-search');
    const filterStatus = document.getElementById('filter-status');
    const filterType = document.getElementById('filter-type');
    const filterDate = document.getElementById('filter-date');
    const exportCsvBtn = document.getElementById('export-csv');
    const exportExcelBtn = document.getElementById('export-excel');
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const paginationInfo = {
        startItem: document.getElementById('start-item'),
        endItem: document.getElementById('end-item'),
        totalItems: document.getElementById('total-items'),
        firstPage: document.getElementById('first-page'),
        prevPage: document.getElementById('prev-page'),
        nextPage: document.getElementById('next-page'),
        lastPage: document.getElementById('last-page'),
        pageNumbers: document.getElementById('page-numbers')
    };

    // Variáveis de estado
    let currentPage = 1;
    let itemsPerPage = 10;
    let allUsers = [];
    let filteredUsers = [];

    // Dados de exemplo (substituir pela chamada ao banco de dados)
    function loadSampleData() {
        const sampleUsers = [];
        const statuses = ['active', 'inactive'];
        const types = ['admin', 'user'];
        const firstNames = ['João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Lucia', 'Marcos', 'Julia'];
        const lastNames = ['Silva', 'Souza', 'Oliveira', 'Santos', 'Ferreira', 'Almeida', 'Pereira', 'Gomes'];
        
        for (let i = 1; i <= 125; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            
            sampleUsers.push({
                id: i,
                nome: `${firstName} ${lastName}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
                telefone: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                dataCadastro: randomDate(new Date(2022, 0, 1), new Date()).toISOString().split('T')[0],
                status: status,
                isAdmin: type === 'admin',
                ultimoLogin: randomDate(new Date(2023, 0, 1), new Date()).toISOString()
            });
        }
        
        return sampleUsers;
    }

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    // Carregar dados
    function loadUsers() {
        // Simulação de carregamento assíncrono
        setTimeout(() => {
            allUsers = loadSampleData();
            applyFilters();
        }, 500);
    }

    // Aplicar filtros e busca
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = filterStatus.value;
        const typeFilter = filterType.value;
        const dateFilter = filterDate.value;

        filteredUsers = allUsers.filter(user => {
            const matchesSearch = user.nome.toLowerCase().includes(searchTerm) || 
                                user.email.toLowerCase().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            const matchesType = typeFilter === 'all' || 
                              (typeFilter === 'admin' && user.isAdmin) || 
                              (typeFilter === 'user' && !user.isAdmin);
            const matchesDate = !dateFilter || user.dataCadastro === dateFilter;

            return matchesSearch && matchesStatus && matchesType && matchesDate;
        });

        updatePagination();
        renderUsers();
    }

    // Renderizar usuários na tabela
    function renderUsers() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const usersToShow = filteredUsers.slice(start, end);

        usersList.innerHTML = usersToShow.map(user => `
            <tr data-id="${user.id}">
                <td>${user.nome}</td>
                <td>${user.email}</td>
                <td>${formatarData(user.dataCadastro)}</td>
                <td><span class="status-badge ${user.status}">${user.status === 'active' ? 'Ativo' : 'Inativo'}</span></td>
                <td>${user.isAdmin ? 'Administrador' : 'Usuário'}</td>
                <td class="actions">
                    <button class="btn-action btn-view" data-action="view">Ver</button>
                    ${user.isAdmin ? '' : '<button class="btn-action btn-edit" data-action="edit">Editar</button>'}
                    ${user.isAdmin ? '' : '<button class="btn-action btn-delete" data-action="delete">Excluir</button>'}
                </td>
            </tr>
        `).join('');

        // Atualizar informações de paginação
        paginationInfo.startItem.textContent = filteredUsers.length > 0 ? start + 1 : 0;
        paginationInfo.endItem.textContent = Math.min(end, filteredUsers.length);
        paginationInfo.totalItems.textContent = filteredUsers.length;
    }

    // Atualizar controles de paginação
    function updatePagination() {
        const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
        
        // Habilitar/desabilitar botões
        paginationInfo.firstPage.disabled = currentPage === 1;
        paginationInfo.prevPage.disabled = currentPage === 1;
        paginationInfo.nextPage.disabled = currentPage === totalPages || totalPages === 0;
        paginationInfo.lastPage.disabled = currentPage === totalPages || totalPages === 0;
        
        // Gerar números de página
        paginationInfo.pageNumbers.innerHTML = '';
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            const el = document.createElement('span');
            el.textContent = '...';
            paginationInfo.pageNumbers.appendChild(el);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = 'page-number';
            if (i === currentPage) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                currentPage = i;
                renderUsers();
                updatePagination();
            });
            
            paginationInfo.pageNumbers.appendChild(btn);
        }
        
        if (endPage < totalPages) {
            const el = document.createElement('span');
            el.textContent = '...';
            paginationInfo.pageNumbers.appendChild(el);
        }
    }

    // Funções auxiliares
    function formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    }

    function formatarDataHora(dataHora) {
        return new Date(dataHora).toLocaleString('pt-BR');
    }

    // Mostrar detalhes do usuário
    function mostrarDetalhesUsuario(userId) {
        const usuario = allUsers.find(u => u.id == userId);
        if (!usuario) return;

        const modalContent = `
            <div class="modal-header">
                <h3 class="modal-title">Detalhes do Usuário</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="user-details-grid">
                <div class="detail-group">
                    <span class="detail-label">Nome Completo</span>
                    <div class="detail-value">${usuario.nome}</div>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Email</span>
                    <div class="detail-value">${usuario.email}</div>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Telefone</span>
                    <div class="detail-value">${usuario.telefone}</div>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Data de Cadastro</span>
                    <div class="detail-value">${formatarData(usuario.dataCadastro)}</div>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Status</span>
                    <div class="detail-value ${usuario.status === 'active' ? 'active' : 'inactive'}">
                        ${usuario.status === 'active' ? 'Ativo' : 'Inativo'}
                    </div>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Tipo de Usuário</span>
                    <div class="detail-value">${usuario.isAdmin ? 'Administrador' : 'Usuário Comum'}</div>
                </div>
                <div class="detail-group">
                    <span class="detail-label">Último Login</span>
                    <div class="detail-value">${formatarDataHora(usuario.ultimoLogin)}</div>
                </div>
            </div>
        `;

        document.querySelector('.modal-content').innerHTML = modalContent;
        modal.style.display = 'flex';
    }

    // Exportar para CSV
    function exportToCSV() {
        if (filteredUsers.length === 0) {
            alert('Nenhum dado para exportar!');
            return;
        }

        const headers = ['Nome', 'Email', 'Telefone', 'Data Cadastro', 'Status', 'Tipo'];
        const csvContent = [
            headers.join(','),
            ...filteredUsers.map(user => 
                [
                    `"${user.nome}"`,
                    `"${user.email}"`,
                    `"${user.telefone}"`,
                    `"${formatarData(user.dataCadastro)}"`,
                    `"${user.status === 'active' ? 'Ativo' : 'Inativo'}"`,
                    `"${user.isAdmin ? 'Administrador' : 'Usuário Comum'}"`
                ].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `usuarios_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Exportar para Excel
    function exportToExcel() {
        if (filteredUsers.length === 0) {
            alert('Nenhum dado para exportar!');
            return;
        }

        const data = filteredUsers.map(user => ({
            'Nome': user.nome,
            'Email': user.email,
            'Telefone': user.telefone,
            'Data Cadastro': formatarData(user.dataCadastro),
            'Status': user.status === 'active' ? 'Ativo' : 'Inativo',
            'Tipo': user.isAdmin ? 'Administrador' : 'Usuário Comum'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários');
        XLSX.writeFile(workbook, `usuarios_${new Date().toISOString().slice(0,10)}.xlsx`);
    }

    // Event Listeners
    searchInput.addEventListener('input', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);
    filterDate.addEventListener('change', applyFilters);

    exportCsvBtn.addEventListener('click', exportToCSV);
    exportExcelBtn.addEventListener('click', exportToExcel);

    itemsPerPageSelect.addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        applyFilters();
    });

    paginationInfo.firstPage.addEventListener('click', function() {
        currentPage = 1;
        renderUsers();
        updatePagination();
    });

    paginationInfo.prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
            updatePagination();
        }
    });

    paginationInfo.nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderUsers();
            updatePagination();
        }
    });

    paginationInfo.lastPage.addEventListener('click', function() {
        currentPage = Math.ceil(filteredUsers.length / itemsPerPage);
        renderUsers();
        updatePagination();
    });

    usersTable.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-action');
        if (!btn) return;

        const userId = e.target.closest('tr').getAttribute('data-id');
        const action = btn.getAttribute('data-action');

        if (action === 'view') {
            mostrarDetalhesUsuario(userId);
        } else if (action === 'edit') {
            alert(`Editar usuário ${userId}`);
            // Implementar edição
        } else if (action === 'delete') {
            if (confirm(`Tem certeza que deseja excluir o usuário ${userId}?`)) {
                alert(`Usuário ${userId} excluído (simulação)`);
                // Implementar exclusão
            }
        }
    });

    modal.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-modal')) {  // Faltava este parêntese
            modal.style.display = 'none';
        }
    });
    
    // Inicializar
    loadUsers();
});