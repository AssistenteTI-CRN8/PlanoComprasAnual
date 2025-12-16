/**************************************
 * CONFIGURAÇÕES GERAIS
 **************************************/

const tableConfigs = {
    table1: 9,
    table2: 3, 
    table3: 14,
    table4: 16
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
 * BOTÃO FLUTUANTE PARA TODAS AS TABELAS
 **************************************/

function addBudgetColumn() {
    const select = document.getElementById('budgetCategorySelect');
    const category = select.value;

    if (!category || budgetColumns.includes(category)) {
        alert('Selecione uma categoria válida e não duplicada');
        return;
    }

    budgetColumns.push(category);

    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    
    const newHeader = document.createElement('th');
    newHeader.style.width = '10%';
    newHeader.innerHTML = `${category} <button class="btn btn-danger btn-sm ms-2" onclick="removeBudgetColumn('${category}')"><i class="fas fa-times"></i></button>`;
    theadRow.insertBefore(newHeader, theadRow.lastElementChild);

    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const newTd = document.createElement('td');
        newTd.innerHTML = '<input type="text" placeholder="...">';
        row.insertBefore(newTd, row.lastElementChild);
    });

    select.value = '';
}

function removeBudgetColumn(category) {
    if (!confirm(`Remover coluna "${category}"?`)) return;

    budgetColumns = budgetColumns.filter(cat => cat !== category);

    const table = document.getElementById('table2');
    const theadRow = table.querySelector('thead tr');
    const thToRemove = Array.from(theadRow.children).find(th => th.textContent.includes(category));
    if (thToRemove) thToRemove.remove();

    const tbody = table.querySelector('tbody');
    tbody.querySelectorAll('tr').forEach(row => {
        const tds = Array.from(row.children);
        const tdToRemove = tds.find((td, i) => i < tds.length - 1 && td.textContent.includes(category));
        if (tdToRemove) tdToRemove.remove();
    });
    
    updateRowNumbers('table2');
}

/**************************************
 * CRIAÇÃO DE LINHAS SEM COLUNA AÇÕES (TODAS TABELAS)
 **************************************/

function addRowAnyTable(tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');
    row.dataset.rowId = Date.now();

    // Coluna #
    const tdNum = document.createElement('td');
    tdNum.className = 'text-center row-number';
    row.appendChild(tdNum);

    // Table2 tem estrutura especial
    if (tableId === 'table2') {
        // Ação/Operação
        const tdAction = document.createElement('td');
        tdAction.innerHTML = '<input type="text" placeholder="...">';
        row.appendChild(tdAction);

        // Custo Total
        const tdTotal = document.createElement('td');
        tdTotal.innerHTML = '<input type="text" placeholder="...">';
        row.appendChild(tdTotal);

        // Colunas dinâmicas
        budgetColumns.forEach(() => {
            const td = document.createElement('td');
            td.innerHTML = '<input type="text" placeholder="...">';
            row.appendChild(td);
        });
    } else {
        // Outras tabelas: colunas fixas
        for (let i = 0; i < tableConfigs[tableId]; i++) {
            const td = document.createElement('td');
            td.innerHTML = '<input type="text" placeholder="...">';
            row.appendChild(td);
        }
    }

    tbody.appendChild(row);
    updateRowNumbers(tableId);

    // Botão flutuante em TODAS as linhas
    row.addEventListener('mouseenter', showDeleteButton);
    row.addEventListener('mouseleave', hideDeleteButton);
}

function showDeleteButton(e) {
    const row = e.currentTarget;
    if (row.querySelector('.floating-delete')) return;

    const btn = document.createElement('button');
    btn.className = 'btn btn-danger btn-sm floating-delete position-absolute';
    btn.style.cssText = `
        top: 5px; right: 5px; z-index: 1000; 
        opacity: 0; transition: all 0.2s ease;
        background: #dc3545 !important; border: none !important;
    `;
    btn.innerHTML = '<i class="fas fa-trash"></i>';
    btn.onclick = (ev) => {
        ev.stopPropagation();
        deleteFloatingRow(btn);
    };

    row.style.position = 'relative';
    row.appendChild(btn);
    setTimeout(() => btn.style.opacity = '1', 50);
}

function hideDeleteButton(e) {
    const btn = e.currentTarget.querySelector('.floating-delete');
    if (btn) {
        btn.style.opacity = '0';
        setTimeout(() => {
            if (btn.parentNode) btn.remove();
        }, 200);
    }
}

function deleteFloatingRow(btn) {
    if (!confirm('Remover esta linha?')) return;
    const row = btn.closest('tr');
    const tableId = row.closest('table').id;
    row.remove();
    updateRowNumbers(tableId);
}

/**************************************
 * FUNÇÕES GLOBAIS
 **************************************/

window.addRow = function(tableId) {
    addRowAnyTable(tableId);
};

window.deleteRow = function() {
    // Não usado mais - tudo é flutuante
};

function updateRowNumbers(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach((row, index) => {
        const numCell = row.querySelector('.row-number') || row.cells[0];
        numCell.textContent = index + 1;
    });
}

/**************************************
 * INICIALIZAÇÃO
 **************************************/

document.addEventListener('DOMContentLoaded', function() {
    // Limpa todas as tabelas
    Object.keys(tableConfigs).forEach(tableId => {
        const tbody = document.querySelector(`#${tableId} tbody`);
        if (tbody) tbody.innerHTML = '';
    });
    
    // Cria 8 linhas em todas
    Object.keys(tableConfigs).forEach(tableId => {
        for (let i = 0; i < 8; i++) {
            addRow(tableId);
        }
    });

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.body.classList.toggle('sb-sidenav-toggled');
        });
    }
});
