# 🎨 Design System Master — AutoRent PUC Minas (UI/UX Pro Max)

> Gerado seguindo a metodologia **UI/UX Pro Max (`nextlevelbuilder/ui-ux-pro-max-skill`)**.
> Domínio: **Automotive Mobility & FinTech Credit Management SaaS**.

---

## 1. Direção Estética & Arquitetura Visual

- **Estilo Principal**: *Precision FinTech & Fleet SaaS Dashboard*
- **Superfícies**: Camadas claras de alto contraste (`#F8FAFC` background, `#FFFFFF` cards com bordas `#E2E8F0` de `1px`, cabeçalho executivo em *Deep Obsidian Slate* `#0B1120` com efeito sutil de vidro e gradiente radial).
- **Densidade de Informação**: Cards de KPI no topo das visões operacionais + barra de busca/filtro instantâneo + tabelas com alinhamento numérico tabular (`tabular-nums`).

---

## 2. Tipografia Pareada (Font Pairing)

| Papel | Família Tipográfica | Pesos | Uso |
| :--- | :--- | :---: | :--- |
| **Display / Headings** | `Plus Jakarta Sans` | `600`, `700`, `800` | Títulos de páginas, valores de KPIs, modais e marca |
| **UI Body / Labels** | `Inter` | `400`, `500`, `600` | Textos corridos, formulários, tabelas e botões |
| **Monospace / Dados** | `JetBrains Mono` | `500`, `600` | Placas Mercosul, matrículas (`MAT-...`), códigos (`PED-...`, `CRED-...`) |

---

## 3. Paleta de Cores (Design Tokens)

| Token | Hex | Aplicação |
| :--- | :---: | :--- |
| `--bg-canvas` | `#F1F5F9` | Plano de fundo geral da aplicação |
| `--bg-surface` | `#FFFFFF` | Cards, tabelas e modais |
| `--bg-subtle` | `#F8FAFC` | Cabeçalhos de tabela, boxes de dossiê financeiro |
| `--text-primary` | `#0F172A` | Títulos e dados principais (Contraste > 15:1) |
| `--text-secondary` | `#475569` | Subtítulos e metadados (Contraste > 7:1) |
| `--text-muted` | `#64748B` | Textos auxiliares e placeholders |
| `--brand-primary` | `#2563EB` | Ações principais, links ativos e destaques |
| `--brand-hover` | `#1D4ED8` | Estado hover de botões primários |
| `--status-success` | `#059669` / `#ECFDF5` | Parecer positivo, contrato executado, veículo disponível |
| `--status-warning` | `#D97706` / `#FFFBEB` | Aguardando análise financeira, propriedade empresa |
| `--status-danger` | `#DC2626` / `#FEF2F2` | Parecer negativo, pedido cancelado, exclusão |
| `--status-info` | `#0284C7` / `#F0F9FF` | Aprovado aguardando contrato, propriedade banco |
| `--status-purple` | `#7C3AED` / `#F5F3FF` | Contrato de crédito bancário, propriedade cliente |

---

## 4. Sistema de Ícones (Vector SVG Rules)

- **Biblioteca**: Componentes SVG nativos estilo Lucide (`frontend/src/components/Icons.jsx`).
- **Tamanhos Padronizados**:
  - `16px`: Ícones internos de botões compactos e badges;
  - `18px`: Ícones de navegação e inputs;
  - `20px`: Ícones de cabeçalhos de seção;
  - `24px`: Ícones de KPIs e estados vazios.
- **Traço (`stroke-width`)**: `1.85` uniforme com `stroke-linecap="round"` e `stroke-linejoin="round"`.
- **Proibição**: Zero emojis em elementos de interface.
