/**************************************
 * CONFIGURAÇÕES GERAIS
 **************************************/

const tableConfigs = {
    table1: 9,
    table2: 2, // Ação/Operação + Custo Total (sem contar # e Ações)
    table3: 14,
    table4: 16
};

let rowCounters = {
    table1: 0,
    table2: 0,
    table3: 0,
    table4: 0
};

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

let budgetColumns = [];

/**************************************
 * ORÇAMENTO – COLUNAS DINÂMICAS (TABLE2)
 **************************************/

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
    const theadRow = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');
    
    // Encontrar a posição da coluna "Ações" no header
    const headers = theadRow.querySelectorAll('th');
    let actionsHeaderIndex = -1;
    headers.forEach((th, i) => {
        if (th.textContent.trim() === 'Ações') {
            actionsHeaderIndex = i;
        }
    });

    // Adicionar header ANTES da coluna Ações
    const newHeader = document.createElement('th');
    newHeader.style.width = '15%';
    newHeader.innerHTML = `${category} <button class="btn btn-danger btn-sm ms-2" onclick="removeBudgetColumn('${category}')"><i class="fas fa-times"></i></button>`;
    theadRow.insertBefore(newHeader, headers[actionsHeaderIndex]);

    // Adicionar células nas linhas ANTES da célula de Ações (mesma posição)
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        const actionsCell = cells[actionsHeaderIndex];
        
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        td.appendChild(input);
        
        row.insertBefore(td, actionsCell);
    });

    select.value = '';
}

function removeBudgetColumn(category) {
    if (!confirm(`Remover a coluna "${category}"?`)) return;

    const index = budgetColumns.indexOf(category);
    if (index === -1) return;

    budgetColumns.splice(index, 1);

    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    const headers = theadRow.querySelectorAll('th');

    let columnIndex = -1;
    headers.forEach((th, i) => {
        if (th.textContent.includes(category)) {
            columnIndex = i;
        }
    });

    if (columnIndex === -1) return;

    headers[columnIndex].remove();

    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells[columnIndex]) {
            cells[columnIndex].remove();
        }
    });
}

/**************************************
 * CRUD DE LINHAS
 **************************************/

window.addRow = function(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const numCols = tableConfigs[tableId];
    const row = document.createElement('tr');

    // Nº
    const tdNum = document.createElement('td');
    tdNum.classList.add('text-center');
    row.appendChild(tdNum);

    // Colunas editáveis
    for (let i = 0; i < numCols; i++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        td.appendChild(input);
        row.appendChild(td);
    }

    // Se for table2, adicionar colunas dinâmicas
    if (tableId === 'table2') {
        budgetColumns.forEach(() => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '...';
            td.appendChild(input);
            row.appendChild(td);
        });
    }

    // Coluna Ações (sempre última)
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

/**************************************
 * INICIALIZAÇÃO
 **************************************/

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar TODAS as tabelas com 8 linhas
    Object.keys(tableConfigs).forEach(tableId => {
        for (let i = 0; i < 8; i++) {
            addRow(tableId);
        }
    });

    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});