-- ================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- Sistema PCA - CRN8
-- ================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS pca_crn8 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE pca_crn8;

-- ================================================
-- TABELA: planos
-- Descrição: Armazena os planos orçamentários principais
-- ================================================
CREATE TABLE IF NOT EXISTS planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setor VARCHAR(100) NOT NULL COMMENT 'Setor do plano (cadastro, fiscalizacao, formacaoprofissional)',
    projeto TEXT COMMENT 'Nome/descrição do projeto',
    acao TEXT COMMENT 'Ação ou operação a ser realizada',
    produto TEXT COMMENT 'Produto esperado',
    resultados TEXT COMMENT 'Resultados esperados do plano',
    prioridade VARCHAR(50) COMMENT 'Prioridade: Alta, Média, Baixa',
    cronograma TEXT COMMENT 'Cronograma de execução',
    realizado TEXT COMMENT 'Informações sobre realização (data/valor/%)',
    lideranca VARCHAR(255) COMMENT 'Responsável pela liderança',
    recursos TEXT COMMENT 'Recursos necessários',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setor (setor),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Tabela principal de planos orçamentários';

-- ================================================
-- TABELA: categorias_orcamentarias
-- Descrição: Categorias de custos vinculadas aos planos
-- ================================================
CREATE TABLE IF NOT EXISTS categorias_orcamentarias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plano_id INT NOT NULL COMMENT 'ID do plano vinculado',
    categoria VARCHAR(255) COMMENT 'Nome da categoria orçamentária',
    quantidade INT DEFAULT 0 COMMENT 'Quantidade de itens',
    custo_total DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Custo total em reais',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE CASCADE,
    INDEX idx_plano_id (plano_id),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Categorias orçamentárias dos planos';

-- ================================================
-- TABELA: distribuicao_mensal
-- Descrição: Distribuição de custos por mês
-- ================================================
CREATE TABLE IF NOT EXISTS distribuicao_mensal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setor VARCHAR(100) NOT NULL COMMENT 'Setor ao qual pertence',
    acao TEXT COMMENT 'Ação/operação',
    custo_total DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Custo total anual',
    jan DECIMAL(12, 2) DEFAULT 0.00,
    fev DECIMAL(12, 2) DEFAULT 0.00,
    mar DECIMAL(12, 2) DEFAULT 0.00,
    abr DECIMAL(12, 2) DEFAULT 0.00,
    mai DECIMAL(12, 2) DEFAULT 0.00,
    jun DECIMAL(12, 2) DEFAULT 0.00,
    jul DECIMAL(12, 2) DEFAULT 0.00,
    ago DECIMAL(12, 2) DEFAULT 0.00,
    set_mes DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'SET é palavra reservada',
    out_mes DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'OUT é palavra reservada',
    nov DECIMAL(12, 2) DEFAULT 0.00,
    dez DECIMAL(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setor (setor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Distribuição mensal de custos';

-- ================================================
-- TABELA: realizacao_anual
-- Descrição: Realização de custos vs orçado
-- ================================================
CREATE TABLE IF NOT EXISTS realizacao_anual (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setor VARCHAR(100) NOT NULL COMMENT 'Setor ao qual pertence',
    acao TEXT COMMENT 'Ação/operação',
    custo_orcado DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Custo orçado',
    jan DECIMAL(12, 2) DEFAULT 0.00,
    fev DECIMAL(12, 2) DEFAULT 0.00,
    mar DECIMAL(12, 2) DEFAULT 0.00,
    abr DECIMAL(12, 2) DEFAULT 0.00,
    mai DECIMAL(12, 2) DEFAULT 0.00,
    jun DECIMAL(12, 2) DEFAULT 0.00,
    jul DECIMAL(12, 2) DEFAULT 0.00,
    ago DECIMAL(12, 2) DEFAULT 0.00,
    set_mes DECIMAL(12, 2) DEFAULT 0.00,
    out_mes DECIMAL(12, 2) DEFAULT 0.00,
    nov DECIMAL(12, 2) DEFAULT 0.00,
    dez DECIMAL(12, 2) DEFAULT 0.00,
    custo_realizado DECIMAL(12, 2) GENERATED ALWAYS AS (
        jan + fev + mar + abr + mai + jun + jul + ago + set_mes + out_mes + nov + dez
    ) STORED COMMENT 'Soma automática dos meses',
    diferenca DECIMAL(12, 2) GENERATED ALWAYS AS (
        custo_orcado - (jan + fev + mar + abr + mai + jun + jul + ago + set_mes + out_mes + nov + dez)
    ) STORED COMMENT 'Diferença entre orçado e realizado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setor (setor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Realização anual de custos';

-- ================================================
-- TABELA: usuarios (OPCIONAL - para futuro)
-- Descrição: Usuários do sistema
-- ================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL COMMENT 'Hash da senha',
    setor VARCHAR(100) COMMENT 'Setor do usuário',
    nivel_acesso ENUM('admin', 'gestor', 'usuario') DEFAULT 'usuario',
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_acesso TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_setor (setor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Usuários do sistema (para implementação futura)';

-- ================================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ================================================

-- Inserir alguns dados de exemplo para teste
INSERT INTO planos (setor, projeto, acao, produto, resultados, prioridade, cronograma, realizado, lideranca, recursos) VALUES
('fiscalizacao', 'Fiscalização de Estabelecimentos', 'Inspeção de Restaurantes Comerciais', 'Relatórios de Conformidade', 'Garantir conformidade sanitária e nutricional', 'Alta', 'Janeiro a Dezembro/2026', '0%', 'João Silva', 'Equipe de 3 fiscais, veículo'),
('fiscalizacao', 'Atualização de Registros', 'Revisão Cadastral de Profissionais', 'Base de dados atualizada', 'Manter cadastro atualizado de nutricionistas', 'Média', 'Março a Junho/2026', '0%', 'Maria Santos', 'Sistema informatizado, 2 funcionários'),
('cadastro', 'Modernização do Sistema', 'Implantação de Sistema Digital', 'Portal Web Funcional', 'Facilitar registro e consultas online', 'Alta', 'Fevereiro a Agosto/2026', '0%', 'Carlos Oliveira', 'Empresa de TI, Servidor');

-- Inserir categorias orçamentárias para os planos de exemplo
INSERT INTO categorias_orcamentarias (plano_id, categoria, quantidade, custo_total) VALUES
(1, 'Diárias e Deslocamento', 50, 15000.00),
(1, 'Material Consumo', 100, 5000.00),
(2, 'Assessorias', 1, 25000.00),
(2, 'Material Consumo', 50, 3000.00),
(3, 'Assessorias', 1, 80000.00),
(3, 'Locação de Equipamentos', 12, 24000.00);

-- ================================================
-- VIEWS ÚTEIS
-- ================================================

-- View para visualizar planos com soma de custos
CREATE OR REPLACE VIEW vw_planos_com_custos AS
SELECT 
    p.id,
    p.setor,
    p.projeto,
    p.acao,
    p.prioridade,
    p.cronograma,
    p.lideranca,
    COUNT(c.id) as qtd_categorias,
    COALESCE(SUM(c.custo_total), 0) as custo_total_plano,
    p.created_at,
    p.updated_at
FROM planos p
LEFT JOIN categorias_orcamentarias c ON p.id = c.plano_id
GROUP BY p.id;

-- View para resumo por setor
CREATE OR REPLACE VIEW vw_resumo_por_setor AS
SELECT 
    p.setor,
    COUNT(DISTINCT p.id) as total_planos,
    COUNT(c.id) as total_categorias,
    COALESCE(SUM(c.custo_total), 0) as custo_total_setor
FROM planos p
LEFT JOIN categorias_orcamentarias c ON p.id = c.plano_id
GROUP BY p.setor;

-- ================================================
-- PROCEDURES ÚTEIS (OPCIONAL)
-- ================================================

DELIMITER //

-- Procedure para calcular custo total de um plano
CREATE PROCEDURE sp_calcular_custo_plano(IN plano_id_param INT)
BEGIN
    SELECT 
        p.id,
        p.projeto,
        COALESCE(SUM(c.custo_total), 0) as custo_total
    FROM planos p
    LEFT JOIN categorias_orcamentarias c ON p.id = c.plano_id
    WHERE p.id = plano_id_param
    GROUP BY p.id;
END //

-- Procedure para listar planos por prioridade
CREATE PROCEDURE sp_planos_por_prioridade(IN setor_param VARCHAR(100), IN prioridade_param VARCHAR(50))
BEGIN
    SELECT 
        p.*,
        COUNT(c.id) as qtd_categorias,
        COALESCE(SUM(c.custo_total), 0) as custo_total
    FROM planos p
    LEFT JOIN categorias_orcamentarias c ON p.id = c.plano_id
    WHERE p.setor = setor_param 
    AND p.prioridade = prioridade_param
    GROUP BY p.id
    ORDER BY p.created_at DESC;
END //

DELIMITER ;

-- ================================================
-- MENSAGEM FINAL
-- ================================================
SELECT 'Banco de dados PCA-CRN8 criado com sucesso!' as Mensagem;
SELECT 'Tabelas criadas: planos, categorias_orcamentarias, distribuicao_mensal, realizacao_anual, usuarios' as Info;
SELECT 'Views criadas: vw_planos_com_custos, vw_resumo_por_setor' as Info;
SELECT 'Dados de exemplo inseridos!' as Info;