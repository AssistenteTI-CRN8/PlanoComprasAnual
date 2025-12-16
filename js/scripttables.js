
/**************************************
 * CONFIGURAÇÕES GERAIS
 **************************************/

// Número de colunas editáveis por tabela (exceto Nº e Ações)
const tableConfigs = {
    table1: 9,
    table2: 0, // controlada dinamicamente
    table3: 14,
    table4: 16
};

// Contador de linhas
let rowCounters = {
    table1: 0,
    table2: 0,
    table3: 0,
    table4: 0
};

// Categorias disponíveis
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

// Categorias ativas na table2
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
    const thCells = theadRow.querySelectorAll('th');
    const actionsHeader = thCells[thCells.length - 1];

    // Header
    const newHeader = document.createElement('th');
    newHeader.style.width = '15%';
    newHeader.innerHTML = `
        ${category}
        <button class="btn btn-danger btn-sm ms-2"
            onclick="removeBudgetColumn('${category}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    theadRow.insertBefore(newHeader, actionsHeader);

    // Linhas existentes
    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        const actionsCell = cells[cells.length - 1];

        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'number';
        input.step = '0.01';
        input.placeholder = 'R$ 0,00';
        input.classList.add('budget-value');
        input.addEventListener('input', () => calcularTotalLinha(row));

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
        row.querySelectorAll('td')[columnIndex].remove();
        calcularTotalLinha(row);
    });
}

/**************************************
 * SOMA AUTOMÁTICA (FLOAT)
 **************************************/

function calcularTotalLinha(row) {
    let total = 0;

    row.querySelectorAll('.budget-value').forEach(input => {
        const valor = parseFloat(input.value);
        if (!isNaN(valor)) total += valor;
    });

    const totalInput = row.querySelector('.row-total');
    if (totalInput) {
        totalInput.value = total.toFixed(2);
    }
}

/**************************************
 * CRUD DE LINHAS
 **************************************/

window.addRow = function(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');

    // TABLE2 (Orçamento)
    if (tableId === 'table2') {
        const row = document.createElement('tr');

        // Nº
        const tdNum = document.createElement('td');
        tdNum.classList.add('text-center');
        row.appendChild(tdNum);

        // Ação/Operação
        const tdActionOp = document.createElement('td');
        const inputAction = document.createElement('input');
        inputAction.type = 'text';
        inputAction.placeholder = 'Ação/Operação';
        tdActionOp.appendChild(inputAction);
        row.appendChild(tdActionOp);

        // Colunas orçamento
        budgetColumns.forEach(() => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.step = '0.01';
            input.placeholder = 'R$ 0,00';
            input.classList.add('budget-value');
            input.addEventListener('input', () => calcularTotalLinha(row));
            td.appendChild(input);
            row.appendChild(td);
        });

        // Total (calculado)
        const tdTotal = document.createElement('td');
        const inputTotal = document.createElement('input');
        inputTotal.type = 'number';
        inputTotal.step = '0.01';
        inputTotal.readOnly = true;
        inputTotal.classList.add('row-total');
        tdTotal.appendChild(inputTotal);
        row.appendChild(tdTotal);

        // Ações (sempre última)
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

    // OUTRAS TABELAS
    const numCols = tableConfigs[tableId];
    const row = document.createElement('tr');

    const tdNum = document.createElement('td');
    tdNum.classList.add('text-center');
    row.appendChild(tdNum);

    for (let i = 0; i < numCols; i++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '...';
        td.appendChild(input);
        row.appendChild(td);
    }

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
    Object.keys(tableConfigs).forEach(tableId => {
        if (tableId !== 'table2') {
            for (let i = 0; i < 8; i++) {
                addRow(tableId);
            }
        }
    });

    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});
