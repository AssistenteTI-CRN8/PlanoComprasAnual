// Configuração de colunas por tabela
const tableConfigs = {
    table1: 9,
    table2: 0,
    table3: 14,
    table4: 16
};

// Contador de linhas por tabela
let rowCounters = {
    table1: 0,
    table2: 0,
    table3: 0,
    table4: 0
};

// Categorias de orçamento disponíveis
const budgetCategories = [
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

// Colunas adicionadas na tabela de orçamento
let budgetColumns = [];

// Adicionar coluna de orçamento
function addBudgetColumn() {
    const select = document.getElementById('budgetCategorySelect');
    const category = select.value;
    
    if (!category) {
        alert('Selecione uma categoria');
        return;
    }
    
    if (budgetColumns.includes(category)) {
        alert('Esta categoria já foi adicionada');
        return;
    }
    
    budgetColumns.push(category);
    
    const table = document.getElementById('table2');
    const thead = table.querySelector('thead tr');
    const actionsHeader = thead.querySelector('th:last-child');
    
    // Adicionar header da nova coluna ANTES da coluna de Ações
    const newHeader = document.createElement('th');
    newHeader.style.width = '15%';
    newHeader.innerHTML = `${category} <button class="btn btn-danger btn-sm ms-2" onclick="removeBudgetColumn('${category}')"><i class="fas fa-times"></i></button>`;
    thead.insertBefore(newHeader, actionsHeader);
    
    // Adicionar células nas linhas existentes ANTES da última célula (Ações)
    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        const actionsCell = cells[cells.length - 1]; // Última célula (Ações)
        const newCell = document.createElement('td');
        newCell.innerHTML = '<input type="number" step="0.01" placeholder="R$ 0,00">';
        row.insertBefore(newCell, actionsCell);
    });
    
    select.value = '';
}

// Remover coluna de orçamento
function removeBudgetColumn(category) {
    if (!confirm(`Remover a coluna "${category}"?`)) return;
    
    const index = budgetColumns.indexOf(category);
    if (index === -1) return;
    
    budgetColumns.splice(index, 1);
    
    const table = document.getElementById('table2');
    const thead = table.querySelector('thead tr');
    const headers = thead.querySelectorAll('th');
    
    // Encontrar índice da coluna (pulando #, Ação/Operação, Total)
    let columnIndex = -1;
    headers.forEach((th, i) => {
        if (th.textContent.includes(category)) {
            columnIndex = i;
        }
    });
    
    if (columnIndex === -1) return;
    
    // Remover header
    headers[columnIndex].remove();
    
    // Remover células de todas as linhas
    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        row.querySelectorAll('td')[columnIndex].remove();
    });
}

// Funções globais
window.addRow = function(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    
    // Para table2 (orçamento), usar lógica especial
    if (tableId === 'table2') {
        const row = document.createElement('tr');
        
        // Coluna numeração
        const tdNum = document.createElement('td');
        tdNum.classList.add('text-center');
        row.appendChild(tdNum);
        
        // Ação/Operação
        const tdAction = document.createElement('td');
        const inputAction = document.createElement('input');
        inputAction.type = 'text';
        inputAction.placeholder = 'Ação/Operação';
        tdAction.appendChild(inputAction);
        row.appendChild(tdAction);
        
        // Custo Total
        const tdTotal = document.createElement('td');
        const inputTotal = document.createElement('input');
        inputTotal.type = 'number';
        inputTotal.step = '0.01';
        inputTotal.placeholder = 'R$ 0,00';
        tdTotal.appendChild(inputTotal);
        row.appendChild(tdTotal);
        
        // Adicionar células para cada coluna de orçamento existente
        budgetColumns.forEach(() => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = '0.01';
            input.placeholder = 'R$ 0,00';
            td.appendChild(input);
            row.appendChild(td);
        });
        
        // Coluna ações
        const tdBtn = document.createElement('td');
        tdBtn.classList.add('text-center');
        const btn = document.createElement('button');
        btn.className = 'btn btn-danger btn-sm btn-delete-row';
        btn.innerHTML = '<i class="fas fa-trash"></i>';
        btn.addEventListener('click', () => deleteRow(btn));
        tdBtn.appendChild(btn);
        row.appendChild(tdBtn);
        
        tbody.appendChild(row);
        updateRowNumbers(tableId);
        return;
    }
    
    // Para outras tabelas
    const numCols = tableConfigs[tableId];
    const row = document.createElement('tr');

    // Coluna numeração
    const tdNum = document.createElement('td');
    tdNum.classList.add('text-center');
    row.appendChild(tdNum);

    // Colunas editáveis
    for (let i = 0; i < numCols; i++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Digite aqui...';
        td.appendChild(input);
        row.appendChild(td);
    }

    // Coluna ações
    const tdAction = document.createElement('td');
    tdAction.classList.add('text-center');
    const btn = document.createElement('button');
    btn.className = 'btn btn-danger btn-sm btn-delete-row';
    btn.innerHTML = '<i class="fas fa-trash"></i>';
    btn.addEventListener('click', () => deleteRow(btn));
    tdAction.appendChild(btn);
    row.appendChild(tdAction);

    tbody.appendChild(row);
    updateRowNumbers(tableId);
};

window.deleteRow = function(btn) {
    const row = btn.closest('tr');
    const table = row.closest('table');
    row.remove();
    updateRowNumbers(table.id);
};

function updateRowNumbers(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Inicializar tabelas + sidebar após DOM carregado
document.addEventListener('DOMContentLoaded', function() {
    Object.keys(tableConfigs).forEach(tableId => {
        // Não inicializar table2 com linhas (tabela de orçamento)
        if (tableId !== 'table2') {
            for (let i = 0; i < 8; i++) addRow(tableId);
        }
    });

    // Toggle sidebar
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});