 // Dados em memória
        let tableData = [];
        let realizacaoData = {}; // Armazena os valores realizados por linha e mês

        // Toggle sidebar
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            document.body.classList.toggle('sb-sidenav-toggled');
        });

        // Calcular total ao digitar
        document.querySelectorAll('[id^="month_"]').forEach(input => {
            input.addEventListener('input', calculateTotal);
        });

        function calculateTotal() {
            const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            let total = 0;
            months.forEach(m => {
                total += parseFloat(document.getElementById(`month_${m}`).value || 0);
            });
            document.getElementById('totalCost').textContent = total.toFixed(2);
        }

        function openAddModal() {
            document.getElementById('modalTitle').textContent = 'Adicionar Novo Item';
            document.getElementById('editingRowIndex').value = '';
            
            // Limpar campos
            document.getElementById('inputProjeto').value = '';
            document.getElementById('inputAcao').value = '';
            document.getElementById('inputProduto').value = '';
            document.getElementById('inputResultados').value = '';
            document.getElementById('inputPrioridade').value = '';
            document.getElementById('inputCronograma').value = '';
            document.getElementById('inputLideranca').value = '';
            
            // Limpar meses
            const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            months.forEach(m => {
                document.getElementById(`month_${m}`).value = '0';
            });
            calculateTotal();
            
            const modal = new bootstrap.Modal(document.getElementById('rowModal'));
            modal.show();
        }

        function editRow(index) {
            const row = tableData[index];
            document.getElementById('modalTitle').textContent = 'Editar Item';
            document.getElementById('editingRowIndex').value = index;
            
            document.getElementById('inputProjeto').value = row.projeto;
            document.getElementById('inputAcao').value = row.acao;
            document.getElementById('inputProduto').value = row.produto;
            document.getElementById('inputResultados').value = row.resultados;
            document.getElementById('inputPrioridade').value = row.prioridade;
            document.getElementById('inputCronograma').value = row.cronograma;
            document.getElementById('inputLideranca').value = row.lideranca;
            
            // Preencher meses
            const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            months.forEach(m => {
                document.getElementById(`month_${m}`).value = row.orcamento[m] || '0';
            });
            calculateTotal();
            
            const modal = new bootstrap.Modal(document.getElementById('rowModal'));
            modal.show();
        }

        function saveRowData() {
            const acao = document.getElementById('inputAcao').value.trim();
            if (!acao) {
                alert('Ação/Operação é obrigatório!');
                return;
            }

            const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            const orcamento = {};
            let total = 0;
            
            months.forEach(m => {
                const value = parseFloat(document.getElementById(`month_${m}`).value || 0);
                orcamento[m] = value;
                total += value;
            });

            const rowData = {
                projeto: document.getElementById('inputProjeto').value,
                acao: acao,
                produto: document.getElementById('inputProduto').value,
                resultados: document.getElementById('inputResultados').value,
                prioridade: document.getElementById('inputPrioridade').value,
                cronograma: document.getElementById('inputCronograma').value,
                lideranca: document.getElementById('inputLideranca').value,
                orcamento: orcamento,
                custoTotal: total
            };

            const editIndex = document.getElementById('editingRowIndex').value;
            if (editIndex === '') {
                tableData.push(rowData);
            } else {
                tableData[parseInt(editIndex)] = rowData;
            }

            renderAllTables();
            bootstrap.Modal.getInstance(document.getElementById('rowModal')).hide();
        }

        function deleteRow(index) {
            if (confirm('Tem certeza que deseja excluir este item?')) {
                tableData.splice(index, 1);
                delete realizacaoData[index];
                renderAllTables();
            }
        }

        function renderTable1() {
            const tbody = document.querySelector('#table1 tbody');
            tbody.innerHTML = tableData.map((row, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${row.projeto}</td>
                    <td>${row.acao}</td>
                    <td>${row.produto}</td>
                    <td>${row.resultados}</td>
                    <td><span class="badge bg-${row.prioridade === 'Alta' ? 'danger' : row.prioridade === 'Média' ? 'warning' : 'info'}">${row.prioridade}</span></td>
                    <td>${row.cronograma}</td>
                    <td>${row.lideranca}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editRow(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteRow(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function renderTable2() {
            const tbody = document.querySelector('#table2 tbody');
            const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            
            tbody.innerHTML = tableData.map((row, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${row.acao}</td>
                    <td>R$ ${row.custoTotal.toFixed(2)}</td>
                    ${months.map(m => `<td>R$ ${(row.orcamento[m] || 0).toFixed(2)}</td>`).join('')}
                </tr>
            `).join('');
        }

        function renderTable3() {
            const tbody = document.querySelector('#table3 tbody');
            const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            
            tbody.innerHTML = tableData.map((row, index) => {
                if (!realizacaoData[index]) {
                    realizacaoData[index] = {};
                    months.forEach(m => realizacaoData[index][m] = 0);
                }

                let totalRealizado = 0;
                months.forEach(m => {
                    totalRealizado += parseFloat(realizacaoData[index][m] || 0);
                });

                const diferenca = totalRealizado - row.custoTotal;
                const corDiferenca = diferenca > 0 ? 'text-danger' : diferenca < 0 ? 'text-success' : '';

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${row.acao}</td>
                        <td>R$ ${row.custoTotal.toFixed(2)}</td>
                        ${months.map(m => `
                            <td>
                                <input type="number" 
                                    class="form-control form-control-sm" 
                                    value="${realizacaoData[index][m] || 0}" 
                                    onchange="updateRealizacao(${index}, '${m}', this.value)"
                                    step="0.01"
                                    min="0">
                            </td>
                        `).join('')}
                        <td><strong>R$ ${totalRealizado.toFixed(2)}</strong></td>
                        <td class="${corDiferenca}"><strong>R$ ${diferenca.toFixed(2)}</strong></td>
                    </tr>
                `;
            }).join('');
        }

        function updateRealizacao(index, month, value) {
            if (!realizacaoData[index]) {
                realizacaoData[index] = {};
            }
            realizacaoData[index][month] = parseFloat(value || 0);
            renderTable3(); // Re-render para atualizar totais
        }

        function renderAllTables() {
            renderTable1();
            renderTable2();
            renderTable3();
        }

        function saveAllData() {
            const dataToSave = {
                tableData: tableData,
                realizacaoData: realizacaoData
            };
            console.log('Dados salvos:', dataToSave);
            alert('Dados salvos com sucesso!\n\nEm produção, estes dados seriam enviados ao servidor.');
            // Aqui você faria a chamada AJAX para salvar no backend
        }

        // Inicialização
        renderAllTables();
