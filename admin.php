<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>Administração - PCA CRN8</title>
    <link href="https://cdn.jsdelivr.net/npm/startbootstrap-sb-admin@7.0.7/css/styles.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <link href="css/styleadmin.css" rel="stylesheet">
    <script src="https://use.fontawesome.com/releases/v6.3.0/js/all.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/scriptadmin.js"></script>  
</head>
<body class="sb-nav-fixed">
    <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark fixed-top">
        <a class="navbar-brand ps-3" href="#">PCA - CRN8 | ADMIN</a>
        <button class="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0 text-white" id="sidebarToggle">
            <i class="fas fa-bars"></i>
        </button>
        <ul class="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-shield fa-fw"></i> Administrador
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#">Configurações</a></li>
                    <li><a class="dropdown-item" href="#">Logs do Sistema</a></li>
                    <li><hr class="dropdown-divider" /></li>
                    <li><a class="dropdown-item" href="#">Sair</a></li>
                </ul>
            </li>
        </ul>
    </nav>

    <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
            <nav class="sb-sidenav sb-sidenav-light">
                <div class="sb-sidenav-menu">
                    <div class="nav">
                        <div class="sb-sidenav-menu-heading">Administração</div>
                        <a class="nav-link active" href="#" onclick="showSection('setores')">
                            <div class="sb-nav-link-icon"><i class="fas fa-folder"></i></div>
                            Gerenciar Setores
                        </a>
                        <a class="nav-link" href="#" onclick="showSection('usuarios')">
                            <div class="sb-nav-link-icon"><i class="fas fa-users"></i></div>
                            Gerenciar Usuários
                        </a>
                        <a class="nav-link" href="#" onclick="showSection('permissoes')">
                            <div class="sb-nav-link-icon"><i class="fas fa-key"></i></div>
                            Gerenciar Permissões
                        </a>
                        <div class="sb-sidenav-menu-heading">Sistema</div>
                        <a class="nav-link" href="#" onclick="showSection('relatorios')">
                            <div class="sb-nav-link-icon"><i class="fas fa-chart-bar"></i></div>
                            Relatórios
                        </a>
                        <a class="nav-link" href="#" onclick="showSection('logs')">
                            <div class="sb-nav-link-icon"><i class="fas fa-history"></i></div>
                            Logs de Atividades
                        </a>
                    </div>
                </div>
            </nav>
        </div>

        <div id="layoutSidenav_content">
            <main>
                <div class="container-fluid px-4">
                    <!-- Seção: Gerenciar Setores -->
                    <div id="section-setores" class="content-section">
                        <h1 class="mt-4">Gerenciar Setores</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Setores e Planilhas</li>
                        </ol>

                        <div class="row mb-4">
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-primary text-white stats-card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h6>Total de Setores</h6>
                                                <h3 id="totalSetores">20</h3>
                                            </div>
                                            <i class="fas fa-folder fa-3x opacity-50"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-success text-white stats-card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h6>Setores Ativos</h6>
                                                <h3 id="setoresAtivos">20</h3>
                                            </div>
                                            <i class="fas fa-check-circle fa-3x opacity-50"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-warning text-white stats-card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h6>Total de Usuários</h6>
                                                <h3 id="totalUsuarios">15</h3>
                                            </div>
                                            <i class="fas fa-users fa-3x opacity-50"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-info text-white stats-card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h6>Permissões Ativas</h6>
                                                <h3 id="permissoesAtivas">45</h3>
                                            </div>
                                            <i class="fas fa-key fa-3x opacity-50"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-folder me-1"></i>
                                Lista de Setores
                                <button class="btn btn-success btn-sm float-end" onclick="openSetorModal()">
                                    <i class="fas fa-plus"></i> Novo Setor
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="row" id="setoresList"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Seção: Gerenciar Usuários -->
                    <div id="section-usuarios" class="content-section" style="display:none;">
                        <h1 class="mt-4">Gerenciar Usuários</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Usuários do Sistema</li>
                        </ol>

                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-users me-1"></i>
                                Lista de Usuários
                                <button class="btn btn-success btn-sm float-end" onclick="openUsuarioModal()">
                                    <i class="fas fa-user-plus"></i> Novo Usuário
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Email</th>
                                                <th>Cargo</th>
                                                <th>Status</th>
                                                <th>Setores</th>
                                                <th>Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody id="usuariosList"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Seção: Gerenciar Permissões -->
                    <div id="section-permissoes" class="content-section" style="display:none;">
                        <h1 class="mt-4">Gerenciar Permissões</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Controle de Acesso</li>
                        </ol>

                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-key me-1"></i>
                                Matriz de Permissões
                            </div>
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">Selecione o Usuário:</label>
                                        <select class="form-select" id="selectUsuario" onchange="loadPermissoes()">
                                            <option value="">Escolha um usuário...</option>
                                        </select>
                                    </div>
                                </div>
                                <div id="permissoesMatrix"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Seção: Relatórios -->
                    <div id="section-relatorios" class="content-section" style="display:none;">
                        <h1 class="mt-4">Relatórios</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Relatórios do Sistema</li>
                        </ol>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Seção de relatórios em desenvolvimento
                        </div>
                    </div>

                    <!-- Seção: Logs -->
                    <div id="section-logs" class="content-section" style="display:none;">
                        <h1 class="mt-4">Logs de Atividades</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Histórico do Sistema</li>
                        </ol>
                        <div class="card">
                            <div class="card-body">
                                <div id="logsList"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer class="py-4 bg-light mt-auto">
                <div class="container-fluid px-4">
                    <div class="d-flex align-items-center justify-content-between small">
                        <div class="text-muted">Copyright &copy; Conselho Regional de Nutrição da 8ª região.</div>
                    </div>
                </div>
            </footer>
        </div>
    </div>

    <!-- Modal Setor -->
    <div class="modal fade" id="setorModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="setorModalTitle">Adicionar Setor</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="setorEditId">
                    <div class="mb-3">
                        <label class="form-label">Nome do Setor *</label>
                        <input type="text" class="form-control" id="setorNome" placeholder="Ex: Diretoria">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-control" id="setorDescricao" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="setorStatus">
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="saveSetor()">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Usuário -->
    <div class="modal fade" id="usuarioModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="usuarioModalTitle">Adicionar Usuário</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="usuarioEditId">
                    <div class="mb-3">
                        <label class="form-label">Nome Completo *</label>
                        <input type="text" class="form-control" id="usuarioNome">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email *</label>
                        <input type="email" class="form-control" id="usuarioEmail">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Cargo</label>
                        <input type="text" class="form-control" id="usuarioCargo">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Senha *</label>
                        <input type="password" class="form-control" id="usuarioSenha" placeholder="Mínimo 6 caracteres">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="usuarioStatus">
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="saveUsuario()">Salvar</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
        