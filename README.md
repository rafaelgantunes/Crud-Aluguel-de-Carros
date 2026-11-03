# Sistema de Aluguel de Carros (AutoRent PUC Minas)

<p align="left">
  <img src="docs/img/Logo.jfif" alt="Logo AutoRent PUC Minas" width="130" style="border-radius: 18px;" />
</p>

![Java](https://img.shields.io/badge/Java-JDK_25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Sistema Web desenvolvido na disciplina de **Desenvolvimento e Integração de Aplicações Web (DIAW)** do curso de **Engenharia de Software da PUC Minas (Laboratório 02)**. O objetivo do projeto é apoiar a gestão de aluguéis de automóveis através da Internet, permitindo introduzir, consultar, modificar, avaliar financeiramente e cancelar pedidos de locação, gerenciar contratantes (clientes e seus rendimentos), controlar a titularidade da frota e associar contratos de crédito bancário.

---

## Alunos

* **Rafael Gomes Antunes de Oliveira**

## Professor responsáveis

* **João Paulo Carneiro Aramuni**

---

## Sumário

1. [Descrição e Regras de Negócio](#descrição-e-regras-de-negócio)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Histórias de Usuários](#histórias-de-usuários)
4. [Modelagem do Sistema (UML)](#modelagem-do-sistema-uml)
   - [Diagrama de Casos de Uso](#1-diagrama-de-casos-de-uso)
   - [Diagrama de Classes (Evolução: Modelo Inicial vs. Modelo Final)](#2-diagrama-de-classes-evolução-do-modelo)
   - [Diagrama de Pacotes — Visão Lógica (Arquitetura MVC)](#3-diagrama-de-pacotes--visão-lógica-arquitetura-mvc)
5. [Protótipo e Telas do Sistema](#protótipo-e-telas-do-sistema)
6. [Instruções de utilização](#instruções-de-utilização)
7. [Endpoints da API REST (MVC)](#endpoints-da-api-rest-mvc)
8. [Histórico de versões](#histórico-de-versões)

---

## Descrição e Regras de Negócio

1. **Autenticação Obrigatória:** O sistema só pode ser utilizado após cadastro prévio e autenticação (login com usuário e senha), distinguindo os perfis de **Cliente** (`CLIENTE`), **Agente Empresa** (`AGENTE_EMPRESA`) e **Agente Banco** (`AGENTE_BANCO`).
2. **Gestão de Contratantes (CRUD de Cliente):** Armazena os dados de identificação civil (**RG, CPF, Nome, Endereço**), **profissão**, as **entidades empregadoras** e os respectivos **rendimentos auferidos (máximo 3)**.
3. **Gestão de Automóveis e Propriedade:** Registra **matrícula, ano, marca, modelo e placa**. Dependendo do tipo de contrato, os automóveis alugados podem ser registrados como propriedade de **clientes, empresas ou bancos**.
4. **Ciclo de Vida do Pedido de Aluguel e Análise Financeira:**
   - **Clientes** podem introduzir, modificar, consultar o status e cancelar pedidos de aluguel, além de formalizar a execução do contrato após parecer positivo.
   - **Agentes (Empresas e Bancos)** podem modificar e avaliar pedidos sob o ponto de vista financeiro e, em caso de parecer positivo, colocá-los à consideração para execução do contrato.
   - **Contrato de Crédito:** O aluguel de um automóvel pode estar associado a um contrato de crédito concedido por um dos bancos agentes.

---

## Tecnologias Utilizadas

* **Linguagem:** Java — JDK 25
* **Back-end:** Spring Boot 4.0.x (Arquitetura MVC, Spring Web, Spring Data JPA, Jakarta Validation)
* **Build e Dependências:** Apache Maven (`mvnw` / `pom.xml`)
* **Front-end:** React 19 + Vite 6 (Design System *UI/UX Pro Max* responsivo)
* **Banco de Dados:** Supabase (PostgreSQL em nuvem)

---

## Histórias de Usuários

| ID | Ator | História de Usuário | Critérios de Aceitação | Prioridade |
| :-: | :--- | :--- | :--- | :-: |
| **US01** | Usuário (Cliente / Agente) | **Como** usuário do sistema, **quero** realizar meu cadastro prévio e fazer login com usuário e senha **para** ter acesso autenticado às funcionalidades do sistema. | - Restringir o acesso às telas internas apenas a usuários autenticados;<br>- Validar credenciais e carregar perfil (`CLIENTE`, `AGENTE_EMPRESA`, `AGENTE_BANCO`). | Alta |
| **US02** | Cliente / Agente | **Como** cliente, **quero** cadastrar, visualizar, atualizar e remover meus dados pessoais (RG, CPF, Nome, Endereço, Profissão) e meus rendimentos **para** manter meu cadastro apto à análise financeira. | - CRUD completo de Cliente;<br>- Permitir registrar até no **máximo 3** entidades empregadoras e respectivos rendimentos auferidos. | Alta |
| **US03** | Cliente | **Como** cliente autenticado, **quero** introduzir um novo pedido de aluguel selecionando um automóvel, período e modalidade de contrato **para** solicitar a locação pela Internet. | - Calcular automaticamente o valor total conforme as diárias;<br>- Registrar o pedido com status inicial `AGUARDANDO_ANALISE`. | Alta |
| **US04** | Cliente | **Como** cliente autenticado, **quero** consultar o status, modificar os dados ou cancelar meu pedido de aluguel **para** gerenciar minhas solicitações. | - Exibir status atualizado, datas e parecer financeiro;<br>- Permitir modificação ou cancelamento antes da execução final. | Alta |
| **US05** | Agente (Empresa / Banco) | **Como** agente autenticado, **quero** analisar o dossiê financeiro do contratante (rendimentos e empregadores) e avaliar os pedidos de aluguel **para** emitir um parecer financeiro positivo ou negativo. | - Exibir soma de rendimentos e vínculos empregatícios;<br>- Em caso de parecer positivo, alterar status para `APROVADO_AGUARDANDO_CONTRATO`. | Alta |
| **US06** | Agente (Banco) | **Como** banco agente, **quero** conceder e associar um contrato de crédito (valor financiado, taxa de juros e parcelas) a um pedido aprovado **para** financiar a locação. | - Gerar número único de contrato (`CRED-...`) vinculado ao banco agente;<br>- Associar o contrato de crédito ao pedido de aluguel. | Média |
| **US07** | Cliente / Agente | **Como** contratante, **quero** executar o contrato de um pedido aprovado financeiramente **para** formalizar a locação e atualizar o registro de propriedade do veículo. | - Alterar status do pedido para `CONTRATO_EXECUTADO`;<br>- Atualizar a titularidade do automóvel (`CLIENTE`, `EMPRESA` ou `BANCO`) conforme a modalidade contratada. | Média |
| **US08** | Agente (Empresa / Banco) | **Como** agente, **quero** cadastrar e consultar a frota de automóveis (matrícula, ano, marca, modelo, placa e proprietário) **para** manter os veículos disponíveis no sistema. | - Validar unicidade de matrícula e placa;<br>- Indicar titularidade e disponibilidade do automóvel. | Média |

---

## Modelagem do Sistema (UML)

Os arquivos-fonte dos modelos UML estão versionados em [`docs/uml/`](docs/uml/).

### 1. Diagrama de Casos de Uso

Fonte: [`docs/uml/casos_de_uso.mmd`](docs/uml/casos_de_uso.mmd)

```mermaid
flowchart LR
    Cliente(["Cliente (Usuário Individual)"])
    AgenteEmpresa(["Agente (Empresa Locadora)"])
    AgenteBanco(["Agente (Banco)"])

    subgraph Sistema["Sistema de Gestão de Aluguel de Carros (Web)"]
        UC01("UC01 - Realizar Cadastro Prévio")
        UC02("UC02 - Autenticar no Sistema (Login)")
        UC03("UC03 - CRUD de Cliente e Rendimentos (máx. 3)")
        UC04("UC04 - Introduzir Pedido de Aluguel")
        UC05("UC05 - Consultar Status do Pedido de Aluguel")
        UC06("UC06 - Modificar Pedido de Aluguel")
        UC07("UC07 - Cancelar Pedido de Aluguel")
        UC08("UC08 - Avaliar Pedido Financeiramente (Emitir Parecer)")
        UC09("UC09 - Conceder e Associar Contrato de Crédito")
        UC10("UC10 - Executar Contrato de Aluguel")
        UC11("UC11 - Gerenciar Automóveis e Propriedade")
    end

    Cliente --> UC01
    Cliente --> UC02
    Cliente --> UC03
    Cliente --> UC04
    Cliente --> UC05
    Cliente --> UC06
    Cliente --> UC07
    Cliente --> UC10

    AgenteEmpresa --> UC02
    AgenteEmpresa --> UC06
    AgenteEmpresa --> UC08
    AgenteEmpresa --> UC10
    AgenteEmpresa --> UC11

    AgenteBanco --> UC02
    AgenteBanco --> UC06
    AgenteBanco --> UC08
    AgenteBanco --> UC09
    AgenteBanco --> UC11

    UC04 -.->|"<<include>>"| UC02
    UC08 -.->|"<<include>>"| UC02
    UC09 -.->|"<<extend>>"| UC08
    UC10 -.->|"<<include>>"| UC08
```

---

### 2. Diagrama de Classes (Evolução do Modelo)

Atendendo aos critérios de avaliação da **Apresentação Final**, apresentamos a comparação entre o **Modelo Inicial (v1)** e o **Modelo Final Revisado (v2)** alinhado ao código-fonte.

#### Versão 1 — Modelo Conceitual Inicial ([`diagrama_de_classes_v1_inicial.mmd`](docs/uml/diagrama_de_classes_v1_inicial.mmd))

```mermaid
classDiagram
    direction TB
    class Usuario {
        -Long id
        -String login
        -String senha
        +autenticar() boolean
    }
    class Cliente {
        -String rg
        -String cpf
        -String nome
        -String endereco
        -String profissao
        -List~Double~ rendimentos
    }
    class Agente {
        -String nome
        -String tipo
    }
    class Automovel {
        -String matricula
        -int ano
        -String marca
        -String modelo
        -String placa
    }
    class PedidoAluguel {
        -Long id
        -Date dataPedido
        -String status
        -boolean parecerFinanceiro
    }
    class ContratoCredito {
        -Long id
        -Double valor
    }

    Usuario <|-- Cliente
    Usuario <|-- Agente
    Cliente "1" --> "0..*" PedidoAluguel : realiza
    Agente "1" --> "0..*" PedidoAluguel : avalia
    PedidoAluguel "0..*" --> "1" Automovel : refere-se a
    PedidoAluguel "0..1" --> "0..1" ContratoCredito : possui
    Agente "1" --> "0..*" ContratoCredito : concede
```

#### Versão 2 — Modelo de Classes Final Implementado ([`diagrama_de_classes_v2_final.mmd`](docs/uml/diagrama_de_classes_v2_final.mmd))

```mermaid
classDiagram
    direction TB

    class RoleUsuario {
        <<enumeration>>
        CLIENTE
        AGENTE_EMPRESA
        AGENTE_BANCO
    }

    class StatusPedido {
        <<enumeration>>
        AGUARDANDO_ANALISE
        EM_ANALISE_FINANCEIRA
        APROVADO_AGUARDANDO_CONTRATO
        CONTRATO_EXECUTADO
        REJEITADO
        CANCELADO
    }

    class TipoProprietario {
        <<enumeration>>
        CLIENTE
        EMPRESA
        BANCO
    }

    class TipoContrato {
        <<enumeration>>
        PADRAO_EMPRESA
        CREDITO_BANCO
        PROPRIEDADE_CLIENTE
    }

    class Usuario {
        -Long id
        -String username
        -String senha
        -String nome
        -RoleUsuario role
        -LocalDateTime criadoEm
    }

    class Cliente {
        -String rg
        -String cpf
        -String endereco
        -String profissao
        -List~RendimentoCliente~ rendimentos
        +adicionarRendimento(RendimentoCliente) void
        +calcularRendaTotal() BigDecimal
    }

    class RendimentoCliente {
        -Long id
        -String entidadeEmpregadora
        -BigDecimal valorRendimento
    }

    class Agente {
        -String cnpj
        -String razaoSocial
        -String tipoAgente
    }

    class Automovel {
        -Long id
        -String matricula
        -Integer ano
        -String marca
        -String modelo
        -String placa
        -BigDecimal valorDiaria
        -Boolean disponivel
        -TipoProprietario tipoProprietario
        -String nomeProprietario
    }

    class ContratoCredito {
        -Long id
        -String numeroContrato
        -BigDecimal valorFinanciado
        -BigDecimal taxaJurosMensal
        -Integer quantidadeParcelas
        -String statusCredito
        -LocalDateTime dataConcessao
    }

    class PedidoAluguel {
        -Long id
        -String codigoPedido
        -LocalDate dataInicio
        -LocalDate dataFim
        -TipoContrato tipoContrato
        -BigDecimal valorTotal
        -StatusPedido status
        -String parecerFinanceiro
        -String observacoesCliente
        -LocalDateTime criadoEm
        -LocalDateTime atualizadoEm
    }

    Usuario <|-- Cliente
    Usuario <|-- Agente
    Usuario --> RoleUsuario
    Cliente "1" *-- "0..3" RendimentoCliente : possui (máx 3)
    Cliente "1" --> "0..*" PedidoAluguel : solicita
    Agente "0..1" --> "0..*" PedidoAluguel : avalia financeiramente
    Agente "1" --> "0..*" ContratoCredito : concede (Banco)
    PedidoAluguel "0..*" --> "1" Automovel : aluga
    PedidoAluguel "0..1" --> "0..1" ContratoCredito : associado a
    PedidoAluguel --> StatusPedido
    PedidoAluguel --> TipoContrato
    Automovel --> TipoProprietario
```

#### Quadro Comparativo de Modificações (Modelo Inicial vs. Modelo Final)

| Aspecto | Modelo Inicial (v1) | Modelo Final Revisado (v2) | Justificativa de Projeto |
| :--- | :--- | :--- | :--- |
| **Empregadores e Rendimentos** | `List<Double>` simples em `Cliente`. | Entidade `RendimentoCliente` (`entidadeEmpregadora`, `valorRendimento`) com cardinalidade `0..3`. | Atende à regra de armazenar tanto o nome das entidades empregadoras quanto os respectivos rendimentos (máximo 3). |
| **Titularidade do Automóvel** | Sem atributo de propriedade. | Adicionado `TipoProprietario` (`CLIENTE`, `EMPRESA`, `BANCO`) e `nomeProprietario` em `Automovel`. | Permite atualizar o registro de propriedade do veículo conforme o tipo de contrato executado. |
| **Ciclo do Pedido** | Atributo `String status` e `boolean parecerFinanceiro`. | Enum `StatusPedido` e campo detalhado `parecerFinanceiro`. | Controla todas as etapas desde a introdução até a aprovação financeira, execução do contrato ou cancelamento. |
| **Contrato de Crédito** | Apenas `id` e `valor`. | Entidade completa com `numeroContrato`, `bancoAgente`, `taxaJurosMensal` e `quantidadeParcelas`. | Vincula o financiamento diretamente ao banco agente concessor. |

---

### 3. Diagrama de Pacotes — Visão Lógica (Arquitetura MVC)

Fonte: [`docs/uml/diagrama_de_pacotes_mvc.mmd`](docs/uml/diagrama_de_pacotes_mvc.mmd)

```mermaid
flowchart TB
    subgraph SubsistemaWeb["Subsistema 2: Construção Dinâmica das Páginas Web (Front-end React + Vite)"]
        direction LR
        Pages["pages\n(LoginPage, ClientesPage, AutomoveisPage, PedidosPage)"]
        Components["components\n(Navbar, Icons)"]
        ServicesFE["services\n(api.js - Cliente HTTP REST)"]
        ContextFE["context\n(AuthContext - Sessão/Autenticação)"]
        Pages --> Components
        Pages --> ContextFE
        Pages --> ServicesFE
    end

    subgraph SubsistemaGestao["Subsistema 1: Gestão de Pedidos, Clientes e Contratos (Back-end Spring Boot 4 MVC)"]
        direction TB
        Controller["br.pucminas.diaw.aluguel.controller\n(AuthController, ClienteController, AutomovelController, PedidoAluguelController)"]
        DTO["br.pucminas.diaw.aluguel.dto\n(LoginRequestDTO, ClienteRequestDTO, AvaliacaoFinanceiraDTO, PedidoAluguelRequestDTO)"]
        Service["br.pucminas.diaw.aluguel.service\n(AuthService, ClienteService, AutomovelService, PedidoAluguelService)"]
        Repository["br.pucminas.diaw.aluguel.repository\n(UsuarioRepository, ClienteRepository, AutomovelRepository, PedidoAluguelRepository, ContratoCreditoRepository)"]
        Model["br.pucminas.diaw.aluguel.model\n(Usuario, Cliente, RendimentoCliente, Agente, Automovel, PedidoAluguel, ContratoCredito)"]
        Config["br.pucminas.diaw.aluguel.config\n(CorsConfig, DataInitializer)"]

        Controller --> DTO
        Controller --> Service
        Service --> Repository
        Service --> Model
        Repository --> Model
    end

    subgraph Persistencia["Camada de Persistência em Nuvem"]
        Supabase[("Supabase (PostgreSQL)")]
    end

    ServicesFE ==>|"HTTP / JSON (REST API)"| Controller
    Repository ==>|"Spring Data JPA / Hibernate"| Supabase
```

---

## Protótipo e Telas do Sistema

Abaixo estão as capturas de tela do protótipo funcional desenvolvido com **React + Vite** integrado ao **Spring Boot 4** e **Supabase**:

### 1. Tela de Autenticação Obrigatória e Cadastro Prévio
Restringe o acesso apenas a usuários autenticados, oferecendo abas para **Autenticação**, **Novo Cliente** (com até 3 vínculos empregatícios) e **Novo Agente** (Empresa ou Banco), além de acesso rápido de demonstração.

![Tela de Login e Autenticação](docs/img/01_login_autenticacao.jpg)

---

### 2. Painel de Gestão de Pedidos de Aluguel e Execução de Contratos
Apresenta indicadores executivos (KPIs), busca instantânea, filtro por status, acompanhamento de pareceres financeiros, contratos de crédito vinculados (`CRED-...`) e ações para **Modificar**, **Avaliar Finanças**, **Executar Contrato** e **Cancelar**.

![Gestão de Pedidos de Aluguel e Contratos](docs/img/02_pedidos_contratos.jpg)

---

### 3. Modal de Introdução de Novo Pedido de Aluguel
Permite ao contratante escolher o automóvel desejado, definir o período de locação, selecionar a modalidade de contrato/registro de propriedade (`Empresa`, `Banco` ou `Cliente`) e enviar para análise financeira.

![Modal Introduzir Novo Pedido de Aluguel](docs/img/05_modal_novo_pedido.jpg)

---

### 4. Gestão de Contratantes (CRUD Completo de Clientes)
Gerencia os dados civis do contratante (**RG, CPF, Nome, Endereço e Profissão**) e suas **entidades empregadoras com os respectivos rendimentos auferidos (máximo 3)**, calculando automaticamente a renda total para análise de crédito.

![Gestão de Contratantes - CRUD de Clientes](docs/img/03_crud_clientes.jpg)

---

### 5. Frota de Automóveis e Registro de Propriedade
Lista todos os veículos cadastrados (**matrícula, marca, modelo, ano, placa Mercosul e valor da diária**), destacando a titularidade jurídica atual (`Propriedade: EMPRESA`, `Propriedade: BANCO` ou `Propriedade: CLIENTE`) e o status de disponibilidade.

![Frota de Automóveis e Registro de Propriedade](docs/img/04_frota_automoveis.jpg)

---

## Instruções de utilização

### Pré-requisitos
* **Java JDK 25** instalado
* **Node.js 20+** e **npm** instalados
* Banco de dados **Supabase (PostgreSQL)** configurado em [`backend/src/main/resources/application.properties`](backend/src/main/resources/application.properties) (script DDL disponível em [`docs/sql/supabase_schema.sql`](docs/sql/supabase_schema.sql))

### Passo 1 — Executar o Back-end (Spring Boot 4.0.x)
```bash
cd backend
./mvnw spring-boot:run
```
> O servidor REST MVC iniciará em `http://localhost:8080`.

### Passo 2 — Executar o Front-end (React + Vite)
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
> A aplicação web estará disponível em `http://localhost:5173`.

### Credenciais de Teste Pré-Cadastradas

| Perfil | Usuário (`username`) | Senha | Permissões Principais |
| :--- | :---: | :---: | :--- |
| **Cliente Individual** | `cliente` | `123456` | Introduzir, consultar, modificar e cancelar pedidos; executar contratos aprovados. |
| **Agente (Empresa)** | `empresa` | `123456` | Avaliar pedidos financeiramente, modificar pedidos e gerenciar frota de automóveis. |
| **Agente (Banco)** | `banco` | `123456` | Avaliar pedidos financeiramente, conceder contratos de crédito e gerenciar automóveis. |

---

## Endpoints da API REST (MVC)

| Método | Endpoint | Descrição |
| :---: | :--- | :--- |
| `POST` | `/api/auth/login` | Autentica usuário (cliente ou agente) com login e senha |
| `POST` | `/api/auth/registro-agente` | Cadastra novo Agente (`EMPRESA` ou `BANCO`) |
| `GET` | `/api/clientes` | Lista todos os clientes e seus rendimentos (máx. 3) |
| `POST` | `/api/clientes` | Cria um novo Cliente (CRUD) com até 3 empregadores/rendimentos |
| `PUT` | `/api/clientes/{id}` | Atualiza dados de identificação, profissão e rendimentos do Cliente |
| `DELETE` | `/api/clientes/{id}` | Remove o cadastro de um Cliente |
| `GET` | `/api/automoveis` | Lista a frota de automóveis e seus proprietários atuais |
| `POST` | `/api/automoveis` | Cadastra novo automóvel (matrícula, ano, marca, modelo, placa) |
| `GET` | `/api/pedidos` | Lista pedidos de aluguel (filtrável por `clienteId`) |
| `POST` | `/api/pedidos` | Introduz um novo pedido de aluguel |
| `PUT` | `/api/pedidos/{id}` | Modifica um pedido de aluguel existente |
| `PATCH` | `/api/pedidos/{id}/avaliar` | Registra parecer financeiro do Agente e associa Contrato de Crédito |
| `PATCH` | `/api/pedidos/{id}/executar-contrato` | Executa o contrato aprovado e atualiza a propriedade do veículo |
| `PATCH` | `/api/pedidos/{id}/cancelar` | Cancela um pedido de aluguel |

---

## Histórico de versões

* **0.1.0** — Modelagem inicial do sistema: Histórias de Usuário, Diagrama de Casos de Uso, Diagrama de Classes (v1) e Diagrama de Pacotes MVC.
* **0.2.0** — Implementação do Back-end em Java 25 + Spring Boot 4.0.x integrado ao Supabase (PostgreSQL), incluindo autenticação, CRUD de Clientes e gestão de pedidos/contratos.
* **0.3.0** — Implementação do Front-end em React + Vite e revisão do Diagrama de Classes (v2) alinhado à arquitetura final.
* **1.0.0** — Refatoração visual completa com Design System *UI/UX Pro Max*, responsividade mobile/tablet e documentação final com protótipo.
