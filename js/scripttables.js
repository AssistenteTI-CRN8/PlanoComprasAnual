// Variável para armazenar dados da tabela
let currentSetor = '';
let setorData = {};
let table1Data = [];
let modalInstance;
let budgetCategoryCounter = 0;
const budgetCategories = [];

//Setores do conselho
const setores = {
    'diretoria': 'Diretoria',
    'tecnologia': 'Tecnologia da Informação',
    'rh': 'Recursos Humanos',
    'licitacao': 'Comissão de Licitação',
    'juridico': 'Jurídico',
    'fiscalizacao': 'Fiscalização',
    'financeiro': 'Financeiro',
    'londrina': 'Delegacia de Londrina',
    'tomada-contas': 'Comissão de Tomada de Contas',
    'relacoes': 'Comissão de Relações Institucionais e Governamentais',
    'coordenacao': 'Coordenação Técnica',
    'comunicacao': 'Comissão de Comunicação',
    'compras': 'Compras',
    'patrimonio': 'Comissão Transitória de Patrimônio',
    'etica': 'Comissão de Ética',
    '20anos': 'Comissão Transitória de 20 anos',
    'cobranca': 'Cobrança',
    'cipa': 'Comissão Interna de Prevenção de Acidentes (CIPA)',
    'formacao': 'Comissão de Formação Profissional',
    'cadastro': 'Cadastro'
};

// Opções de categorias
const categoryOptions = [
    "Passagem Aérea",
    "Passagem Rodoviária",
    "Diárias e Deslocamento",
    "Auxílio Representação",
    "Material Consumo",
    "Locação de Equipamentos",
    "Locação Anfiteatros/Salas",
    "Serviço Postal",
    "Assessorias",
    "Impressões",
    "Outros"
];

// Inicializar modal
document.addEventListener('DOMContentLoaded', function () {
    modalInstance = new bootstrap.Modal(document.getElementById('rowModal'));

    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }

    renderTable1();
});

// Mudar setor atual
function changeSetor(setor) {
    currentSetor = setor;
    document.getElementById('titulo-setor').textContent = setores[setor];

    document.querySelectorAll('.sb-sidenav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.nav-link').classList.add('active');

    loadTableData('table1');
    loadTableData('table2');
    loadTableData('table3');
}

// Mostrar dashboard
function showDashboard() {
    document.getElementById('titulo-setor').textContent = 'Visão Geral';
    document.querySelectorAll('.sb-sidenav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
}

// Carregar todos os dados do localStorage
function loadAllData() {
    const stored = localStorage.getItem('pca_crn8_data');
    if (stored) {
        try {
            setorData = JSON.parse(stored);
        } catch (e) {
            setorData = {};
        }
    }
}

// Salvar todos os dados no localStorage
function saveAllData() {
    localStorage.setItem('pca_crn8_data', JSON.stringify(setorData));
}

// Obter chave do setor e tabela
function getSetorTableKey(tableId) {
    return `${currentSetor}_${tableId}`;
}

// Carregar dados da tabela
function loadTableData(tableId) {
    const key = getSetorTableKey(tableId);
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';

    const data = setorData[key] || [];

    data.forEach((row, index) => {
        if (tableId === 'table1') {
            addRowToTable1(row, index);
        } else {
            addRowToTable(tableId, row);
        }
    });
}

// Adicionar categoria orçamentária
function addBudgetCategory(categoria = '', quantidade = '', custoTotal = '') {
    const id = budgetCategoryCounter++;
    const container = document.getElementById('budgetCategoriesContainer');

    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'budget-category-item';
    categoryDiv.id = `budget-category-${id}`;

    const optionsHtml = categoryOptions.map(opt =>
        `<option value="${opt}" ${opt === categoria ? 'selected' : ''}>${opt}</option>`
    ).join('');

    categoryDiv.innerHTML = `
                <button type="button" class="btn btn-sm btn-danger remove-category" onclick="removeBudgetCategory(${id})">
                    <i class="fas fa-times"></i>
                </button>
                <div class="mb-3">
                    <label class="form-label">
                        <span class="budget-category-number">${budgetCategories.length + 1}</span>
                        Categoria Orçamentária
                    </label>
                    <select class="form-select budget-categoria" data-id="${id}">
                        <option value="">Selecione uma categoria</option>
                        ${optionsHtml}
                    </select>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Quantidade</label>
                            <input type="number" class="form-control budget-quantidade" data-id="${id}" 
                                   min="0" step="1" value="${quantidade}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label class="form-label">Custo Total (R$)</label>
                            <input type="number" class="form-control budget-custo" data-id="${id}" 
                                   min="0" step="0.01" value="${custoTotal}">
                        </div>
                    </div>
                </div>
            `;

    container.appendChild(categoryDiv);
    budgetCategories.push(id);
}

// Remover categoria orçamentária
function removeBudgetCategory(id) {
    const element = document.getElementById(`budget-category-${id}`);
    if (element) {
        element.remove();
        const index = budgetCategories.indexOf(id);
        if (index > -1) {
            budgetCategories.splice(index, 1);
        }
        updateBudgetCategoryNumbers();
    }
}

// Atualizar números das categorias
function updateBudgetCategoryNumbers() {
    const numbers = document.querySelectorAll('.budget-category-number');
    numbers.forEach((num, index) => {
        num.textContent = index + 1;
    });
}

// Coletar dados das categorias orçamentárias
function collectBudgetCategories() {
    const categories = [];
    budgetCategories.forEach(id => {
        const categoriaEl = document.querySelector(`.budget-categoria[data-id="${id}"]`);
        const quantidadeEl = document.querySelector(`.budget-quantidade[data-id="${id}"]`);
        const custoEl = document.querySelector(`.budget-custo[data-id="${id}"]`);

        if (categoriaEl && quantidadeEl && custoEl) {
            const categoria = categoriaEl.value;
            const quantidade = quantidadeEl.value;
            const custo = custoEl.value;

            if (categoria || quantidade || custo) {
                categories.push({
                    categoria: categoria,
                    quantidade: quantidade,
                    custoTotal: custo
                });
            }
        }
    });
    return categories;
}

// Limpar container de categorias
function clearBudgetCategories() {
    document.getElementById('budgetCategoriesContainer').innerHTML = '';
    budgetCategories.length = 0;
    budgetCategoryCounter = 0;
}

// Abrir modal para adicionar
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Adicionar Novo Item';
    document.getElementById('editingRowIndex').value = '';
    clearModalInputs();
    clearBudgetCategories();
    addBudgetCategory(); // Adiciona uma categoria inicial
    modalInstance.show();
}

// Abrir modal para editar
function openEditModal(index) {
    document.getElementById('modalTitle').textContent = 'Editar Item';
    document.getElementById('editingRowIndex').value = index;

    const row = table1Data[index];
    document.getElementById('inputProjeto').value = row.projeto;
    document.getElementById('inputAcao').value = row.acao;
    document.getElementById('inputProduto').value = row.produto;
    document.getElementById('inputResultados').value = row.resultados;
    document.getElementById('inputPrioridade').value = row.prioridade;
    document.getElementById('inputCronograma').value = row.cronograma;
    document.getElementById('inputRealizado').value = row.realizado;
    document.getElementById('inputLideranca').value = row.lideranca;
    document.getElementById('inputRecursos').value = row.recursos;

    // Carregar categorias orçamentárias
    clearBudgetCategories();
    if (row.categorias && row.categorias.length > 0) {
        row.categorias.forEach(cat => {
            addBudgetCategory(cat.categoria, cat.quantidade, cat.custoTotal);
        });
    } else {
        addBudgetCategory(); // Adiciona uma categoria vazia se não houver nenhuma
    }

    modalInstance.show();
}

// Limpar inputs do modal
function clearModalInputs() {
    document.getElementById('inputProjeto').value = '';
    document.getElementById('inputAcao').value = '';
    document.getElementById('inputProduto').value = '';
    document.getElementById('inputResultados').value = '';
    document.getElementById('inputPrioridade').value = '';
    document.getElementById('inputCronograma').value = '';
    document.getElementById('inputRealizado').value = '';
    document.getElementById('inputLideranca').value = '';
    document.getElementById('inputRecursos').value = '';
}

// Salvar dados do modal
function saveRowData() {
    const rowData = {
        projeto: document.getElementById('inputProjeto').value,
        acao: document.getElementById('inputAcao').value,
        produto: document.getElementById('inputProduto').value,
        resultados: document.getElementById('inputResultados').value,
        prioridade: document.getElementById('inputPrioridade').value,
        cronograma: document.getElementById('inputCronograma').value,
        realizado: document.getElementById('inputRealizado').value,
        lideranca: document.getElementById('inputLideranca').value,
        recursos: document.getElementById('inputRecursos').value,
        categorias: collectBudgetCategories()
    };

    const editingIndex = document.getElementById('editingRowIndex').value;

    if (editingIndex === '') {
        // Adicionar nova linha
        table1Data.push(rowData);
    } else {
        // Editar linha existente
        table1Data[editingIndex] = rowData;
    }

    renderTable1();
    modalInstance.hide();
}

// Renderizar tabela
function renderTable1() {
    const tbody = document.querySelector('#table1 tbody');
    tbody.innerHTML = '';

    table1Data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>
                        <i class="fas fa-chevron-right toggle-details" onclick="toggleDetails(${index})" id="toggle-${index}"></i>
                    </td>
                    <td>${row.projeto}</td>
                    <td>${row.acao}</td>
                    <td>${row.produto}</td>
                    <td>${row.resultados}</td>
                    <td>${row.prioridade}</td>
                    <td>${row.cronograma}</td>
                    <td>${row.realizado}</td>
                    <td>${row.lideranca}</td>
                    <td>${row.recursos}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="openEditModal(${index})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRow(${index})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
        tbody.appendChild(tr);

        // Adicionar linha de detalhes (oculta inicialmente)
        const detailRow = document.createElement('tr');
        detailRow.className = 'detail-row';
        detailRow.id = `detail-${index}`;
        detailRow.style.display = 'none';
        detailRow.innerHTML = `
                    <td colspan="11">
                        <div class="detail-content">
                            <div class="row">
                                <div class="col-md-12 mb-3">
                                    <h6 class="text-primary mb-3"><i class="fas fa-info-circle"></i> Informações Completas do Item</h6>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="detail-label">Projeto:</div>
                                    <div class="detail-value">${row.projeto}</div>
                                </div>
                                <div class="col-md-4">
                                    <div class="detail-label">Ação/Operação:</div>
                                    <div class="detail-value">${row.acao}</div>
                                </div>
                                <div class="col-md-4">
                                    <div class="detail-label">Produto:</div>
                                    <div class="detail-value">${row.produto}</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="detail-label">Resultados Esperados:</div>
                                    <div class="detail-value">${row.resultados}</div>
                                </div>
                                <div class="col-md-3">
                                    <div class="detail-label">Prioridade:</div>
                                    <div class="detail-value"><span class="badge bg-${row.prioridade === 'Alta' ? 'danger' : row.prioridade === 'Média' ? 'warning' : 'success'}">${row.prioridade}</span></div>
                                </div>
                                <div class="col-md-3">
                                    <div class="detail-label">Cronograma:</div>
                                    <div class="detail-value">${row.cronograma}</div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="detail-label">Realizado:</div>
                                    <div class="detail-value">${row.realizado}</div>
                                </div>
                                <div class="col-md-4">
                                    <div class="detail-label">Liderança:</div>
                                    <div class="detail-value">${row.lideranca}</div>
                                </div>
                                <div class="col-md-4">
                                    <div class="detail-label">Recursos Necessários:</div>
                                    <div class="detail-value">${row.recursos}</div>
                                </div>
                            </div>
                            <hr class="my-3">
                            <div class="row">
                                <div class="col-md-12 mb-2">
                                    <h6 class="text-success"><i class="fas fa-dollar-sign"></i> Informações Orçamentárias</h6>
                                </div>
                            </div>
                            ${row.categorias && row.categorias.length > 0 ?
                row.categorias.map((cat, catIndex) => `
                                    <div class="row mb-3 ${catIndex > 0 ? 'pt-3 border-top' : ''}">
                                        <div class="col-md-12 mb-2">
                                            <strong class="text-muted">Categoria ${catIndex + 1}</strong>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="detail-label">Categoria Orçamentária:</div>
                                            <div class="detail-value">${cat.categoria || 'Não informado'}</div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="detail-label">Quantidade:</div>
                                            <div class="detail-value">${cat.quantidade || 'Não informado'}</div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="detail-label">Custo Total:</div>
                                            <div class="detail-value">${cat.custoTotal ? 'R$ ' + parseFloat(cat.custoTotal).toFixed(2) : 'Não informado'}</div>
                                        </div>
                                    </div>
                                `).join('')
                : `
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="detail-value text-muted">Nenhuma categoria orçamentária cadastrada</div>
                                    </div>
                                </div>
                            `}
                        </div>
                    </td>
                `;
        tbody.appendChild(detailRow);
    });
}

// Excluir linha
function deleteRow(index) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
        table1Data.splice(index, 1);
        renderTable1();
    }
}

// Toggle detalhes da linha
function toggleDetails(index) {
    const detailRow = document.getElementById(`detail-${index}`);
    const toggleIcon = document.getElementById(`toggle-${index}`);

    if (detailRow.style.display === 'none') {
        detailRow.style.display = 'table-row';
        toggleIcon.classList.add('expanded');
    } else {
        detailRow.style.display = 'none';
        toggleIcon.classList.remove('expanded');
    }
}

// Salvar dados da tabela
function saveTableData(tableId) {
    if (tableId === 'table1') {
        console.log('Salvando dados da tabela 1:', table1Data);
        alert('Dados salvos com sucesso!');
        // Aqui você pode adicionar código para enviar os dados para o servidor
    }
}

// Tornar células editáveis por duplo clique
function makeTableEditable(tableId) {
            const table = document.getElementById(tableId);
            const cells = table.querySelectorAll('tbody td[contenteditable="true"]');
            
            cells.forEach(cell => {
                cell.addEventListener('dblclick', function() {
                    this.focus();
                });

                cell.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.blur();
                    }
                });
            });
        }

        makeTableEditable('table2');
        makeTableEditable('table3');
/*
FUNÇÃO TESTE DE SALVAR TABELA - NÃO CONSIDERA COMPORTAMENTO TABELA 1 - NÃO EDITÁVEL POR LINHA

        function saveTableData(tableId) {
            const key = getSetorTableKey(tableId);
            const tbody = document.querySelector(`#${tableId} tbody`);
            const rows = tbody.querySelectorAll('tr');
            const data = [];

            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const rowData = [];
                cells.forEach((cell, index) => {
                    if (index < cells.length - 1) {
                        rowData.push(cell.textContent.trim());
                    }
                });
                data.push(rowData);
            });

            setorData[key] = data;
            saveAllData();
            alert('Dados salvos com sucesso!');
        }

*/