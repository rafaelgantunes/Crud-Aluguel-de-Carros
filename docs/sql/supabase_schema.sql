-- ============================================================================
-- PUC Minas - Engenharia de Software - DIAW
-- Laboratório 02: Sistema de Aluguel de Carros
-- Script SQL para Supabase (PostgreSQL)
-- ============================================================================

-- 1. Tabela Base de Usuários (Autenticação obrigatória para Clientes e Agentes)
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('CLIENTE', 'AGENTE_EMPRESA', 'AGENTE_BANCO')),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Clientes (Contratantes Individuais)
-- Armazena: RG, CPF, Nome, Endereço, Profissão
CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    rg VARCHAR(20) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    endereco VARCHAR(255) NOT NULL,
    profissao VARCHAR(100) NOT NULL
);

-- 3. Entidades Empregadoras e Rendimentos Auferidos (Máximo 3 por Cliente)
CREATE TABLE IF NOT EXISTS rendimentos_cliente (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    entidade_empregadora VARCHAR(150) NOT NULL,
    valor_rendimento NUMERIC(12, 2) NOT NULL CHECK (valor_rendimento >= 0)
);

-- 4. Tabela de Agentes (Empresas e Bancos)
CREATE TABLE IF NOT EXISTS agentes (
    id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    razao_social VARCHAR(150) NOT NULL,
    tipo_agente VARCHAR(20) NOT NULL CHECK (tipo_agente IN ('EMPRESA', 'BANCO'))
);

-- 5. Tabela de Automóveis
-- Registra: matrícula, ano, marca, modelo, placa e proprietário (CLIENTE, EMPRESA ou BANCO)
CREATE TABLE IF NOT EXISTS automoveis (
    id BIGSERIAL PRIMARY KEY,
    matricula VARCHAR(40) NOT NULL UNIQUE,
    ano INTEGER NOT NULL CHECK (ano >= 1950 AND ano <= 2100),
    marca VARCHAR(80) NOT NULL,
    modelo VARCHAR(80) NOT NULL,
    placa VARCHAR(10) NOT NULL UNIQUE,
    valor_diaria NUMERIC(10, 2) NOT NULL DEFAULT 150.00,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    tipo_proprietario VARCHAR(20) NOT NULL CHECK (tipo_proprietario IN ('CLIENTE', 'EMPRESA', 'BANCO')),
    proprietario_usuario_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 6. Tabela de Contratos de Crédito (Concedidos por Bancos Agentes)
CREATE TABLE IF NOT EXISTS contratos_credito (
    id BIGSERIAL PRIMARY KEY,
    numero_contrato VARCHAR(50) NOT NULL UNIQUE,
    banco_agente_id BIGINT NOT NULL REFERENCES agentes(id),
    valor_financiado NUMERIC(12, 2) NOT NULL CHECK (valor_financiado > 0),
    taxa_juros_mensal NUMERIC(5, 2) NOT NULL DEFAULT 1.49,
    quantidade_parcelas INTEGER NOT NULL CHECK (quantidade_parcelas >= 1),
    status_credito VARCHAR(30) NOT NULL DEFAULT 'APROVADO' CHECK (status_credito IN ('PENDENTE', 'APROVADO', 'RECUSADO')),
    data_concessao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabela de Pedidos de Aluguel e Execução de Contrato
CREATE TABLE IF NOT EXISTS pedidos_aluguel (
    id BIGSERIAL PRIMARY KEY,
    codigo_pedido VARCHAR(40) NOT NULL UNIQUE,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    automovel_id BIGINT NOT NULL REFERENCES automoveis(id),
    agente_avaliador_id BIGINT REFERENCES agentes(id),
    contrato_credito_id BIGINT UNIQUE REFERENCES contratos_credito(id) ON DELETE SET NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    tipo_contrato VARCHAR(30) NOT NULL CHECK (tipo_contrato IN ('PADRAO_EMPRESA', 'CREDITO_BANCO', 'PROPRIEDADE_CLIENTE')),
    valor_total NUMERIC(12, 2) NOT NULL,
    status VARCHAR(35) NOT NULL DEFAULT 'AGUARDANDO_ANALISE'
        CHECK (status IN (
            'AGUARDANDO_ANALISE',
            'EM_ANALISE_FINANCEIRA',
            'APROVADO_AGUARDANDO_CONTRATO',
            'CONTRATO_EXECUTADO',
            'REJEITADO',
            'CANCELADO'
        )),
    parecer_financeiro TEXT,
    observacoes_cliente TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização de consultas e chaves estrangeiras (Best Practices Supabase)
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos_aluguel(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_automovel ON pedidos_aluguel(automovel_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_agente ON pedidos_aluguel(agente_avaliador_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos_aluguel(status);
CREATE INDEX IF NOT EXISTS idx_rendimentos_cliente ON rendimentos_cliente(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contratos_banco ON contratos_credito(banco_agente_id);
CREATE INDEX IF NOT EXISTS idx_automoveis_proprietario ON automoveis(proprietario_usuario_id);

-- Habilita Row Level Security (RLS) no schema public (Protege a Data API pública do Supabase,
-- enquanto o back-end Spring Boot conecta via role 'postgres' com BYPASSRLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rendimentos_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE agentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE automoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_aluguel ENABLE ROW LEVEL SECURITY;


