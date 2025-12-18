// Dados iniciais
let setores = [
    { id: 1, nome: 'Diretoria', descricao: 'Setor de Diretoria', status: 'ativo' },
    { id: 2, nome: 'Tecnologia da Informação', descricao: 'TI', status: 'ativo' },
    { id: 3, nome: 'Recursos Humanos', descricao: 'RH', status: 'ativo' },
    { id: 4, nome: 'Comissão de Licitação', descricao: '', status: 'ativo' },
    { id: 5, nome: 'Jurídico', descricao: '', status: 'ativo' },
    { id: 6, nome: 'Fiscalização', descricao: '', status: 'ativo' },
    { id: 7, nome: 'Financeiro', descricao: '', status: 'ativo' },
    { id: 8, nome: 'Delegacia de Londrina', descricao: '', status: 'ativo' },
    { id: 9, nome: 'Comissão de Tomada de Contas', descricao: '', status: 'ativo' },
    { id: 10, nome: 'Comissão de Relações Institucionais e Governamentais', descricao: '', status: 'ativo' },
    { id: 11, nome: 'Coordenação Técnica', descricao: '', status: 'ativo' },
    { id: 12, nome: 'Comissão de Comunicação', descricao: '', status: 'ativo' },
    { id: 13, nome: 'Compras', descricao: '', status: 'ativo' },
    { id: 14, nome: 'Comissão Transitória de Patrimônio', descricao: '', status: 'ativo' },
    { id: 15, nome: 'Comissão de Ética', descricao: '', status: 'ativo' },
    { id: 16, nome: 'Comissão Transitória de 20 anos', descricao: '', status: 'ativo' },
    { id: 17, nome: 'Cobrança', descricao: '', status: 'ativo' },
    { id: 18, nome: 'Comissão Interna de Prevenção de Acidentes (CIPA)', descricao: '', status: 'ativo' },
    { id: 19, nome: 'Comissão de Formação Profissional', descricao: '', status: 'ativo' },
    { id: 20, nome: 'Cadastro', descricao: '', status: 'ativo' }
];

let usuarios = [
    { id: 1, nome: 'Maria Silva', email: 'maria@crn8.com', cargo: 'Gerente', status: 'ativo', setores: [1, 6, 7] },
    { id: 2, nome: 'João Santos', email: 'joao@crn8.com', cargo: 'Coordenador', status: 'ativo', setores: [2, 11] },
    { id: 3, nome: 'Ana Costa', email: 'ana@crn8.com', cargo: 'Assistente', status: 'ativo', setores: [3, 20] }
];

let permissoes = {};
usuarios.forEach(u => {
    u.setores.forEach(s => {
        const key = `${u.id}-${s}`;
        permissoes[key] = { visualizar: true, editar: true };
    });
});

let logs = [
    { data: '2025-12-18 10:30', usuario: 'Maria Silva', acao: 'Criou setor "Diretoria"' },
    { data: '2025-12-18 11:15', usuario: 'João Santos', acao: 'Editou usuário "Ana Costa"' },
    { data: '2025-12-18 14:20', usuario: 'Maria Silva', acao: 'Concedeu permissão de edição' }
];

// Sidebar toggle
document.getElementById('sidebarToggle').addEventListener('click', function () {
    document.body.classList.toggle('sb-sidenav-toggled');
});

// Renderizar setores
function renderSetores() {
    const container = document.getElementById('setoresList');
    container.innerHTML = setores.map(setor => `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card setor-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0">${setor.nome}</h5>
                                <span class="badge bg-${setor.status === 'ativo' ? 'success' : 'secondary'}">${setor.status}</span>
                            </div>
                            <p class="card-text text-muted small">${setor.descricao || 'Sem descrição'}</p>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-primary" onclick="editSetor(${setor.id})">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteSetor(${setor.id})">
                                    <i class="fas fa-trash"></i> Excluir
                                </button>
                                <a href="tables.html?setor=${setor.id}" class="btn btn-sm btn-info">
                                    <i class="fas fa-table"></i> Acessar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
}

// Renderizar usuários
function renderUsuarios() {
    const tbody = document.getElementById('usuariosList');
    tbody.innerHTML = usuarios.map(usuario => {
        const setoresNomes = usuario.setores.map(s => setores.find(st => st.id === s)?.nome || '').join(', ');
        return `
                    <tr>
                        <td>${usuario.nome}</td>
                        <td>${usuario.email}</td>
                        <td>${usuario.cargo}</td>
                        <td><span class="badge bg-${usuario.status === 'ativo' ? 'success' : 'secondary'}">${usuario.status}</span></td>
                        <td><small>${setoresNomes || 'Nenhum'}</small></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editUsuario(${usuario.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteUsuario(${usuario.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
    }).join('');

    // Atualizar select
    const select = document.getElementById('selectUsuario');
    select.innerHTML = '<option value="">Escolha um usuário...</option>' +
        usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
}

// Renderizar logs
function renderLogs() {
    const container = document.getElementById('logsList');
    container.innerHTML = logs.map(log => `
                <div class="alert alert-light border-start border-primary border-4">
                    <div class="d-flex justify-content-between">
                        <strong>${log.usuario}</strong>
                        <small class="text-muted">${log.data}</small>
                    </div>
                    <div>${log.acao}</div>
                </div>
            `).join('');
}

// Carregar permissões
function loadPermissoes() {
    const usuarioId = parseInt(document.getElementById('selectUsuario').value);
    if (!usuarioId) {
        document.getElementById('permissoesMatrix').innerHTML = '<p class="text-muted">Selecione um usuário</p>';
        return;
    }

    const usuario = usuarios.find(u => u.id === usuarioId);
    const html = `
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Setor</th>
                                <th class="text-center">Visualizar</th>
                                <th class="text-center">Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${setores.map(setor => {
        const key = `${usuarioId}-${setor.id}`;
        const perm = permissoes[key] || { visualizar: false, editar: false };
        return `
                                    <tr>
                                        <td>${setor.nome}</td>
                                        <td class="text-center">
                                            <input type="checkbox" ${perm.visualizar ? 'checked' : ''} 
                                                onchange="togglePermissao(${usuarioId}, ${setor.id}, 'visualizar', this.checked)">
                                        </td>
                                        <td class="text-center">
                                            <input type="checkbox" ${perm.editar ? 'checked' : ''} 
                                                onchange="togglePermissao(${usuarioId}, ${setor.id}, 'editar', this.checked)">
                                        </td>
                                    </tr>
                                `;
    }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
    document.getElementById('permissoesMatrix').innerHTML = html;
}

// Toggle permissão
function togglePermissao(usuarioId, setorId, tipo, valor) {
    const key = `${usuarioId}-${setorId}`;
    if (!permissoes[key]) {
        permissoes[key] = { visualizar: false, editar: false };
    }
    permissoes[key][tipo] = valor;

    // Atualizar lista de setores do usuário
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (valor && !usuario.setores.includes(setorId)) {
        usuario.setores.push(setorId);
    } else if (!valor && !permissoes[key].visualizar && !permissoes[key].editar) {
        usuario.setores = usuario.setores.filter(s => s !== setorId);
    }

    renderUsuarios();
    addLog(usuario.nome, `Alterou permissão de ${tipo} no setor ${setores.find(s => s.id === setorId).nome}`);
}

// Modal functions
function openSetorModal(id = null) {
    const modal = new bootstrap.Modal(document.getElementById('setorModal'));
    if (id) {
        const setor = setores.find(s => s.id === id);
        document.getElementById('setorModalTitle').textContent = 'Editar Setor';
        document.getElementById('setorEditId').value = setor.id;
        document.getElementById('setorNome').value = setor.nome;
        document.getElementById('setorDescricao').value = setor.descricao;
        document.getElementById('setorStatus').value = setor.status;
    } else {
        document.getElementById('setorModalTitle').textContent = 'Adicionar Setor';
        document.getElementById('setorEditId').value = '';
        document.getElementById('setorNome').value = '';
        document.getElementById('setorDescricao').value = '';
        document.getElementById('setorStatus').value = 'ativo';
    }
    modal.show();
}

function saveSetor() {
    const id = document.getElementById('setorEditId').value;
    const nome = document.getElementById('setorNome').value;
    const descricao = document.getElementById('setorDescricao').value;
    const status = document.getElementById('setorStatus').value;

    if (!nome) {
        alert('Nome do setor é obrigatório');
        return;
    }

    if (id) {
        const setor = setores.find(s => s.id === parseInt(id));
        setor.nome = nome;
        setor.descricao = descricao;
        setor.status = status;
        addLog('Admin', `Editou setor "${nome}"`);
    } else {
        const newId = Math.max(...setores.map(s => s.id)) + 1;
        setores.push({ id: newId, nome, descricao, status });
        addLog('Admin', `Criou setor "${nome}"`);
    }

    bootstrap.Modal.getInstance(document.getElementById('setorModal')).hide();
    renderSetores();
    updateStats();
}

function editSetor(id) {
    openSetorModal(id);
}

function deleteSetor(id) {
    if (!confirm('Tem certeza que deseja excluir este setor?')) return;
    const setor = setores.find(s => s.id === id);
    setores = setores.filter(s => s.id !== id);
    addLog('Admin', `Excluiu setor "${setor.nome}"`);
    renderSetores();
    updateStats();
}

function openUsuarioModal(id = null) {
    const modal = new bootstrap.Modal(document.getElementById('usuarioModal'));
    if (id) {
        const usuario = usuarios.find(u => u.id === id);
        document.getElementById('usuarioModalTitle').textContent = 'Editar Usuário';
        document.getElementById('usuarioEditId').value = usuario.id;
        document.getElementById('usuarioNome').value = usuario.nome;
        document.getElementById('usuarioEmail').value = usuario.email;
        document.getElementById('usuarioCargo').value = usuario.cargo;
        document.getElementById('usuarioSenha').value = '';
        document.getElementById('usuarioSenha').placeholder = 'Deixe em branco para manter a senha atual';
        document.getElementById('usuarioStatus').value = usuario.status;
    } else {
        document.getElementById('usuarioModalTitle').textContent = 'Adicionar Usuário';
        document.getElementById('usuarioEditId').value = '';
        document.getElementById('usuarioNome').value = '';
        document.getElementById('usuarioEmail').value = '';
        document.getElementById('usuarioCargo').value = '';
        document.getElementById('usuarioSenha').value = '';
        document.getElementById('usuarioSenha').placeholder = 'Mínimo 6 caracteres';
        document.getElementById('usuarioStatus').value = 'ativo';
    }
    modal.show();
}

function saveUsuario() {
    const id = document.getElementById('usuarioEditId').value;
    const nome = document.getElementById('usuarioNome').value;
    const email = document.getElementById('usuarioEmail').value;
    const cargo = document.getElementById('usuarioCargo').value;
    const senha = document.getElementById('usuarioSenha').value;
    const status = document.getElementById('usuarioStatus').value;

    if (!nome || !email) {
        alert('Nome e email são obrigatórios');
        return;
    }

    if (!id && !senha) {
        alert('Senha é obrigatória para novos usuários');
        return;
    }

    if (senha && senha.length < 6) {
        alert('Senha deve ter no mínimo 6 caracteres');
        return;
    }

    if (id) {
        const usuario = usuarios.find(u => u.id === parseInt(id));
        usuario.nome = nome;
        usuario.email = email;
        usuario.cargo = cargo;
        usuario.status = status;
        addLog('Admin', `Editou usuário "${nome}"`);
    } else {
        const newId = Math.max(...usuarios.map(u => u.id)) + 1;
        usuarios.push({ id: newId, nome, email, cargo, status, setores: [] });
        addLog('Admin', `Criou usuário "${nome}"`);
    }

    bootstrap.Modal.getInstance(document.getElementById('usuarioModal')).hide();
    renderUsuarios();
    updateStats();
}

function editUsuario(id) {
    openUsuarioModal(id);
}

function deleteUsuario(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    const usuario = usuarios.find(u => u.id === id);
    usuarios = usuarios.filter(u => u.id !== id);

    // Remover permissões do usuário
    Object.keys(permissoes).forEach(key => {
        if (key.startsWith(`${id}-`)) {
            delete permissoes[key];
        }
    });

    addLog('Admin', `Excluiu usuário "${usuario.nome}"`);
    renderUsuarios();
    updateStats();
}

function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(`section-${section}`).style.display = 'block';

    document.querySelectorAll('.sb-sidenav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.nav-link').classList.add('active');

    if (section === 'permissoes') {
        loadPermissoes();
    } else if (section === 'logs') {
        renderLogs();
    }
}

function addLog(usuario, acao) {
    const now = new Date();
    const data = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    logs.unshift({ data, usuario, acao });
    if (logs.length > 50) logs = logs.slice(0, 50);
}

function updateStats() {
    document.getElementById('totalSetores').textContent = setores.length;
    document.getElementById('setoresAtivos').textContent = setores.filter(s => s.status === 'ativo').length;
    document.getElementById('totalUsuarios').textContent = usuarios.length;
    document.getElementById('permissoesAtivas').textContent = Object.keys(permissoes).length;
}

// Inicialização
renderSetores();
renderUsuarios();
renderLogs();
updateStats();