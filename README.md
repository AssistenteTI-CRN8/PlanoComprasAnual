Plano de Compras Anual do Conselho Regional de Nutrição da 8ª região.

# Sistema PCA - CRN8
## Plano de Controle Anual - Conselho Regional de Nutrição da 8ª Região

### Requisitos do Sistema

- PHP 7.4 ou superior
- MySQL 5.7 ou superior
- Servidor web (Apache/Nginx)
- Extensões PHP necessárias:
  - mysqli
  - json
  - session

### Instalação

#### 1. Configurar o Banco de Dados

Execute o script SQL para criar o banco de dados e tabelas:

```bash
mysql -u root -p < database.sql
```

Ou importe o arquivo `database.sql` através do phpMyAdmin.

#### 2. Configurar a Conexão com o Banco

Edite o arquivo `config.php` e configure suas credenciais:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'seu_usuario');
define('DB_PASS', 'sua_senha');
define('DB_NAME', 'pca_crn8');
```

#### 3. Estrutura de Arquivos

Organize os arquivos da seguinte forma:

```
/seu-projeto/
├── config.php
├── api.php
├── tables.php
├── index.php (opcional)
├── database.sql
├── css/
│   ├── styles.css
│   └── styletables.css
└── js/
    └── scripttables.js
```

#### 4. Configurar Permissões

Certifique-se de que o servidor web tem permissão de leitura nos arquivos:

```bash
chmod 644 *.php
chmod 755 css/ js/
```

#### 5. Acessar o Sistema

Abra o navegador e acesse:

```
http://localhost/seu-projeto/tables.php
```

### Funcionalidades Implementadas

✅ **CRUD Completo**
- Criar novos planos
- Editar planos existentes
- Excluir planos
- Visualizar detalhes expandidos

✅ **Gestão de Categorias Orçamentárias**
- Adicionar múltiplas categorias por plano
- Categorias predefinidas
- Valores e quantidades

✅ **Múltiplos Setores**
- Setor de Cadastro
- Setor de Fiscalização
- Comissão de Formação Profissional

✅ **Interface Responsiva**
- Design Bootstrap 5
- Tabelas responsivas
- Modal para edição

### Estrutura do Banco de Dados

#### Tabela: planos
Armazena os dados principais dos planos orçamentários.

#### Tabela: categorias_orcamentarias
Armazena as categorias orçamentárias vinculadas a cada plano (relacionamento 1:N).

#### Tabelas: distribuicao_mensal e realizacao_anual
Preparadas para implementação futura das abas 2 e 3.

### API Endpoints

**GET** `/api.php?action=list&setor=fiscalizacao`
- Lista todos os planos de um setor

**POST** `/api.php?action=create&setor=fiscalizacao`
- Cria um novo plano

**POST** `/api.php?action=update&setor=fiscalizacao`
- Atualiza um plano existente

**POST** `/api.php?action=delete&setor=fiscalizacao`
- Exclui um plano

### Próximos Passos

- [ ] Implementar abas "Distribuição no ano" e "Realização no ano"
- [ ] Adicionar sistema de autenticação
- [ ] Implementar exportação para Excel/PDF
- [ ] Adicionar gráficos e relatórios
- [ ] Implementar backup automático

### Segurança

⚠️ **Importante:**
- Implemente autenticação antes de usar em produção
- Use prepared statements (já implementado)
- Configure HTTPS
- Defina permissões adequadas no banco de dados
- Valide todas as entradas do usuário

### Suporte

Para dúvidas ou problemas:
1. Verifique os logs de erro do PHP
2. Verifique as configurações do banco de dados
3. Confirme que todas as extensões PHP estão instaladas
4. Teste a conexão com o banco usando um script simples

### Licença

Copyright © Conselho Regional de Nutrição da 8ª região.