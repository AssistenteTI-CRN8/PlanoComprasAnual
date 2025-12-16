/**************************************
 * CONFIGURAÇÕES GERAIS
 **************************************/

const tableConfigs = {
    table1: 9,
    table2: 3, 
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
    
    // Pegar todos os headers
    const allHeaders = Array.from(theadRow.querySelectorAll('th'));
    const actionsHeader = allHeaders[allHeaders.length - 2]; // Último header (Ações)

    // Adicionar novo header ANTES do header de Ações
    const newHeader = document.createElement('th');
    newHeader.style.width = '10%';
    newHeader.innerHTML = `${category} <button class="btn btn-danger btn-sm ms-2" onclick="removeBudgetColumn('${category}')"><i class="fas fa-times"></i></button>`;
    theadRow.insertBefore(newHeader, actionsHeader);

    // Adicionar célula em cada linha ANTES da última célula (Ações)
    tbody.querySelectorAll('tr').forEach(row => {
        const allCells = Array.from(row.querySelectorAll('td'));
        const actionsCell = allCells[allCells.length - 2]; // Última célula (Ações)
        
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
    const headers = Array.from(theadRow.querySelectorAll('th'));

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
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells[columnIndex]) {
            cells[columnIndex].remove();
        }
    });
}

/**************************************
 * CRUD DE LINHAS - TABLE2 (ISOLADA)
 **************************************/

function addRowTable2() {
    const table = document.getElementById('table2');
    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');

    // Coluna #
    const tdNum = document.createElement('td');
    tdNum.classList.add('text-center');
    row.appendChild(tdNum);

    // Coluna Ação/Operação
    const tdAction = document.createElement('td');
    const inputAction = document.createElement('input');
    inputAction.type = 'text';
    inputAction.placeholder = '...';
    tdAction.appendChild(inputAction);
    row.appendChild(tdAction);

    // Coluna Custo Total
    const tdTotal = document.createElement('td');
    const inputTotal = document.createElement('input');
    inputTotal.type = 'text';
    inputTotal.placeholder = '...';
    tdTotal.appendChild(inputTotal);
    row.appendChild(tdTotal);

    // Colunas dinâmicas de orçamento
    budgetColumns.forEach(() => {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        td.appendChild(input);
        row.appendChild(td);
    });

    // Coluna Ações
    const tdBtn = document.createElement('td');
    tdBtn.classList.add('text-center');
    const btn = document.createElement('button');
    btn.className = 'btn btn-danger btn-sm btn-delete-row';
    btn.innerHTML = '<i class="fas fa-trash"></i>';
    btn.addEventListener('click', () => deleteRow(btn));
    tdBtn.appendChild(btn);
    row.appendChild(tdBtn);
    
    tbody.appendChild(row);
    updateRowNumbers('table2');
}

/**************************************
 * CRUD DE LINHAS - OUTRAS TABELAS
 **************************************/

window.addRow = function(tableId) {
    // Se for table2, usar função específica
    if (tableId === 'table2') {
        addRowTable2();
        return;
    }

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

    // Coluna Ações
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
    if (!confirm(`Deseja remover a linha selecionada?`)) return;
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