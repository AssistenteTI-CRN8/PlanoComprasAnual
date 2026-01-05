<?php
/**
 * API REST para Sistema PCA - CRN8
 * Plano de Controle Anual - Conselho Regional de Nutrição da 8ª Região
 * 
 * Endpoints disponíveis:
 * - GET  ?action=list&setor=xxx          -> Lista todos os planos
 * - GET  ?action=get&id=xxx              -> Busca um plano específico
 * - POST ?action=create&setor=xxx        -> Cria novo plano
 * - POST ?action=update&setor=xxx        -> Atualiza plano existente
 * - POST ?action=delete&setor=xxx        -> Deleta plano
 * - GET  ?action=stats&setor=xxx         -> Estatísticas do setor
 */

// Incluir arquivo de configuração
require_once 'config.php';

// Configurar headers para API
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Tratar requisições OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obter conexão com banco de dados
$conn = getConnection();

// Obter parâmetros da requisição
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$setor = isset($_GET['setor']) ? $_GET['setor'] : 'fiscalizacao';

// Validar setor
$setoresValidos = ['cadastro', 'fiscalizacao', 'formacaoprofissional'];
if (!in_array($setor, $setoresValidos)) {
    jsonResponse([
        'success' => false, 
        'error' => 'Setor inválido. Valores aceitos: ' . implode(', ', $setoresValidos)
    ], 400);
}

// ================================================
// ROTA: LISTAR PLANOS
// ================================================
if ($method === 'GET' && $action === 'list') {
    try {
        $stmt = $conn->prepare("
            SELECT 
                p.id,
                p.setor,
                p.projeto,
                p.acao,
                p.produto,
                p.resultados,
                p.prioridade,
                p.cronograma,
                p.realizado,
                p.lideranca,
                p.recursos,
                p.created_at,
                p.updated_at,
                GROUP_CONCAT(
                    CONCAT(
                        '{\"id\":', c.id, 
                        ',\"categoria\":\"', COALESCE(REPLACE(c.categoria, '\"', '\\\\\"'), ''), 
                        '\",\"quantidade\":', COALESCE(c.quantidade, 0), 
                        ',\"custoTotal\":', COALESCE(c.custo_total, 0), '}'
                    ) SEPARATOR ','
                ) as categorias
            FROM planos p
            LEFT JOIN categorias_orcamentarias c ON p.id = c.plano_id
            WHERE p.setor = ?
            GROUP BY p.id
            ORDER BY p.id DESC
        ");
        
        $stmt->bind_param("s", $setor);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $planos = [];
        while ($row = $result->fetch_assoc()) {
            // Processar categorias
            if ($row['categorias']) {
                try {
                    $row['categorias'] = json_decode('[' . $row['categorias'] . ']', true);
                } catch (Exception $e) {
                    $row['categorias'] = [];
                }
            } else {
                $row['categorias'] = [];
            }
            $planos[] = $row;
        }
        
        jsonResponse([
            'success' => true, 
            'count' => count($planos),
            'data' => $planos
        ]);
        
    } catch (Exception $e) {
        jsonResponse([
            'success' => false, 
            'error' => 'Erro ao listar planos: ' . $e->getMessage()
        ], 500);
    }
}

// ================================================
// ROTA: BUSCAR PLANO ESPECÍFICO
// ================================================
if ($method === 'GET' && $action === 'get') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if ($id <= 0) {
        jsonResponse(['success' => false, 'error' => 'ID inválido'], 400);
    }
    
    try {
        $stmt = $conn->prepare("
            SELECT 
                p.*,
                GROUP_CONCAT(
                    CONCAT(
                        '{\"id\":', c.id, 
                        ',\"categoria\":\"', COALESCE(c.categoria, ''), 
                        '\",\"quantidade\":', COALESCE(c.quantidade, 0), 
                        ',\"custoTotal\":', COALESCE(c.custo_total, 0), '}'
                    ) SEPARATOR ','
                ) as categorias
            FROM planos p
            LEFT JOIN categorias_orcamentarias c ON p.id = c.plano_id
            WHERE p.id = ? AND p.setor = ?
            GROUP BY p.id
        ");
        
        $stmt->bind_param("is", $id, $setor);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            if ($row['categorias']) {
                $row['categorias'] = json_decode('[' . $row['categorias'] . ']', true);
            } else {
                $row['categorias'] = [];
            }
            jsonResponse(['success' => true, 'data' => $row]);
        } else {
            jsonResponse(['success' => false, 'error' => 'Plano não encontrado'], 404);
        }
        
    } catch (Exception $e) {
        jsonResponse([
            'success' => false, 
            'error' => 'Erro ao buscar plano: ' . $e->getMessage()
        ], 500);
    }
}

// ================================================
// ROTA: CRIAR PLANO
// ================================================
if ($method === 'POST' && $action === 'create') {
    // Obter dados JSON do corpo da requisição
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        jsonResponse(['success' => false, 'error' => 'Dados JSON inválidos'], 400);
    }
    
    // Iniciar transação
    $conn->begin_transaction();
    
    try {
        // Inserir plano principal
        $stmt = $conn->prepare("
            INSERT INTO planos (
                setor, projeto, acao, produto, resultados, 
                prioridade, cronograma, realizado, lideranca, recursos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $projeto = isset($data['projeto']) ? $data['projeto'] : '';
        $acao = isset($data['acao']) ? $data['acao'] : '';
        $produto = isset($data['produto']) ? $data['produto'] : '';
        $resultados = isset($data['resultados']) ? $data['resultados'] : '';
        $prioridade = isset($data['prioridade']) ? $data['prioridade'] : '';
        $cronograma = isset($data['cronograma']) ? $data['cronograma'] : '';
        $realizado = isset($data['realizado']) ? $data['realizado'] : '';
        $lideranca = isset($data['lideranca']) ? $data['lideranca'] : '';
        $recursos = isset($data['recursos']) ? $data['recursos'] : '';
        
        $stmt->bind_param("ssssssssss",
            $setor,
            $projeto,
            $acao,
            $produto,
            $resultados,
            $prioridade,
            $cronograma,
            $realizado,
            $lideranca,
            $recursos
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Erro ao inserir plano: ' . $stmt->error);
        }
        
        $plano_id = $conn->insert_id;
        
        // Inserir categorias orçamentárias
        if (isset($data['categorias']) && is_array($data['categorias']) && count($data['categorias']) > 0) {
            $stmt_cat = $conn->prepare("
                INSERT INTO categorias_orcamentarias (plano_id, categoria, quantidade, custo_total)
                VALUES (?, ?, ?, ?)
            ");
            
            foreach ($data['categorias'] as $cat) {
                $categoria = isset($cat['categoria']) ? $cat['categoria'] : '';
                $quantidade = isset($cat['quantidade']) ? intval($cat['quantidade']) : 0;
                $custoTotal = isset($cat['custoTotal']) ? floatval($cat['custoTotal']) : 0.0;
                
                // Pular categorias vazias
                if (empty($categoria) && $quantidade == 0 && $custoTotal == 0) {
                    continue;
                }
                
                $stmt_cat->bind_param("isid",
                    $plano_id,
                    $categoria,
                    $quantidade,
                    $custoTotal
                );
                
                if (!$stmt_cat->execute()) {
                    throw new Exception('Erro ao inserir categoria: ' . $stmt_cat->error);
                }
            }
            $stmt_cat->close();
        }
        
        // Confirmar transação
        $conn->commit();
        
        jsonResponse([
            'success' => true, 
            'message' => 'Plano criado com sucesso',
            'id' => $plano_id
        ], 201);
        
    } catch (Exception $e) {
        // Reverter transação em caso de erro
        $conn->rollback();
        jsonResponse([
            'success' => false, 
            'error' => $e->getMessage()
        ], 500);
    }
}

// ================================================
// ROTA: ATUALIZAR PLANO
// ================================================
if ($method === 'POST' && $action === 'update') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data || !isset($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID do plano não fornecido'], 400);
    }
    
    $id = intval($data['id']);
    
    // Iniciar transação
    $conn->begin_transaction();
    
    try {
        // Atualizar plano principal
        $stmt = $conn->prepare("
            UPDATE planos 
            SET projeto=?, acao=?, produto=?, resultados=?, 
                prioridade=?, cronograma=?, realizado=?, lideranca=?, recursos=?
            WHERE id=? AND setor=?
        ");
        
        $projeto = isset($data['projeto']) ? $data['projeto'] : '';
        $acao = isset($data['acao']) ? $data['acao'] : '';
        $produto = isset($data['produto']) ? $data['produto'] : '';
        $resultados = isset($data['resultados']) ? $data['resultados'] : '';
        $prioridade = isset($data['prioridade']) ? $data['prioridade'] : '';
        $cronograma = isset($data['cronograma']) ? $data['cronograma'] : '';
        $realizado = isset($data['realizado']) ? $data['realizado'] : '';
        $lideranca = isset($data['lideranca']) ? $data['lideranca'] : '';
        $recursos = isset($data['recursos']) ? $data['recursos'] : '';
        
        $stmt->bind_param("ssssssssis",
            $projeto,
            $acao,
            $produto,
            $resultados,
            $prioridade,
            $cronograma,
            $realizado,
            $lideranca,
            $recursos,
            $id,
            $setor
        );
        
        if (!$stmt->execute()) {
            throw new Exception('Erro ao atualizar plano: ' . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            throw new Exception('Plano não encontrado ou sem alterações');
        }
        
        // Deletar categorias antigas
        $stmt_del = $conn->prepare("DELETE FROM categorias_orcamentarias WHERE plano_id = ?");
        $stmt_del->bind_param("i", $id);
        $stmt_del->execute();
        $stmt_del->close();
        
        // Inserir novas categorias
        if (isset($data['categorias']) && is_array($data['categorias']) && count($data['categorias']) > 0) {
            $stmt_cat = $conn->prepare("
                INSERT INTO categorias_orcamentarias (plano_id, categoria, quantidade, custo_total)
                VALUES (?, ?, ?, ?)
            ");
            
            foreach ($data['categorias'] as $cat) {
                $categoria = isset($cat['categoria']) ? $cat['categoria'] : '';
                $quantidade = isset($cat['quantidade']) ? intval($cat['quantidade']) : 0;
                $custoTotal = isset($cat['custoTotal']) ? floatval($cat['custoTotal']) : 0.0;
                
                // Pular categorias vazias
                if (empty($categoria) && $quantidade == 0 && $custoTotal == 0) {
                    continue;
                }
                
                $stmt_cat->bind_param("isid",
                    $id,
                    $categoria,
                    $quantidade,
                    $custoTotal
                );
                
                if (!$stmt_cat->execute()) {
                    throw new Exception('Erro ao inserir categoria: ' . $stmt_cat->error);
                }
            }
            $stmt_cat->close();
        }
        
        // Confirmar transação
        $conn->commit();
        
        jsonResponse([
            'success' => true, 
            'message' => 'Plano atualizado com sucesso'
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        jsonResponse([
            'success' => false, 
            'error' => $e->getMessage()
        ], 500);
    }
}

// ================================================
// ROTA: DELETAR PLANO
// ================================================
if ($method === 'POST' && $action === 'delete') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data || !isset($data['id'])) {
        jsonResponse(['success' => false, 'error' => 'ID do plano não fornecido'], 400);
    }
    
    $id = intval($data['id']);
    
    try {
        $stmt = $conn->prepare("DELETE FROM planos WHERE id = ? AND setor = ?");
        $stmt->bind_param("is", $id, $setor);
        
        if (!$stmt->execute()) {
            throw new Exception('Erro ao deletar plano: ' . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            jsonResponse(['success' => false, 'error' => 'Plano não encontrado'], 404);
        }
        
        jsonResponse([
            'success' => true, 
            'message' => 'Plano deletado com sucesso'
        ]);
        
    } catch (Exception $e) {
        jsonResponse([
            'success' => false, 
            'error' => $e->getMessage()
        ], 500);
    }
}

// ================================================
// ROTA: ESTATÍSTICAS DO SETOR
// ================================================
if ($method === 'GET' && $action === 'stats') {
    try {
        // Total de planos
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM planos WHERE setor = ?");
        $stmt->bind_param("s", $setor);
        $stmt->execute();
        $result = $stmt->get_result();
        $total_planos = $result->fetch_assoc()['total'];
        
        // Total de custos
        $stmt = $conn->prepare("
            SELECT COALESCE(SUM(c.custo_total), 0) as total_custos
            FROM planos p
            LEFT JOIN categorias_orcamentarias c ON p.id = c.plano_id
            WHERE p.setor = ?
        ");
        $stmt->bind_param("s", $setor);
        $stmt->execute();
        $result = $stmt->get_result();
        $total_custos = $result->fetch_assoc()['total_custos'];
        
        // Planos por prioridade
        $stmt = $conn->prepare("
            SELECT prioridade, COUNT(*) as quantidade
            FROM planos
            WHERE setor = ?
            GROUP BY prioridade
        ");
        $stmt->bind_param("s", $setor);
        $stmt->execute();
        $result = $stmt->get_result();
        $por_prioridade = [];
        while ($row = $result->fetch_assoc()) {
            $por_prioridade[$row['prioridade']] = $row['quantidade'];
        }
        
        jsonResponse([
            'success' => true,
            'setor' => $setor,
            'stats' => [
                'total_planos' => intval($total_planos),
                'total_custos' => floatval($total_custos),
                'por_prioridade' => $por_prioridade
            ]
        ]);
        
    } catch (Exception $e) {
        jsonResponse([
            'success' => false, 
            'error' => 'Erro ao gerar estatísticas: ' . $e->getMessage()
        ], 500);
    }
}

// ================================================
// ROTA NÃO ENCONTRADA
// ================================================
jsonResponse([
    'success' => false, 
    'error' => 'Ação inválida ou método não permitido',
    'method' => $method,
    'action' => $action
], 400);

// Fechar conexão
$conn->close();
?>