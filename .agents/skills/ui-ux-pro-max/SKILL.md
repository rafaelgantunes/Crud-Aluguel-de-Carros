---
name: ui-ux-pro-max
description: >-
  Professional Design Intelligence Skill (based on nextlevelbuilder/ui-ux-pro-max-skill).
  Activate whenever designing, building, refactoring, or reviewing any frontend UI/UX page,
  component, stylesheet, layout, color palette, typography system, or interactive flow.
---

# UI/UX Pro Max — Design Intelligence Skill

Baseado no repositório `nextlevelbuilder/ui-ux-pro-max-skill`, este guia estabelece o fluxo de trabalho obrigatório e o checklist de qualidade para qualquer criação ou refatoração de Front-end.

---

## 1. Fluxo de Trabalho Obrigatório (Design System First)

Nunca escreva código de interface no improviso. Siga sempre as 3 etapas:
1. **Análise de Domínio e Produto**:
   - Identifique a categoria do produto (ex.: *Automotive SaaS & FinTech Rental Management*).
   - Selecione o estilo estrutural adequado (ex.: *Modern SaaS Bento Dashboard + Clean Corporate FinTech*).
2. **Definição do Design System (`design-system/MASTER.md`)**:
   - **Tipografia Pareada**: Fonte de destaque geométrica para títulos (`Plus Jakarta Sans`), fonte de alta legibilidade para corpo/tabelas (`Inter`) e fonte monoespaçada para códigos, placas, matrículas e valores financeiros (`JetBrains Mono` + `tabular-nums`).
   - **Paleta Semântica com Contraste WCAG AA+**: Cores primárias, superfícies em camadas, bordas sutis (`1px solid`) e estados semânticos (`success`, `warning`, `danger`, `info`).
   - **Tokens de Espaçamento, Raios e Sombras**: Escala consistente (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`).
3. **Implementação Fiel aos Tokens e Auditoria Pré-Entrega**.

---

## 2. Regras de Ouro & Anti-Padrões (Pro Rules)

1. **PROIBIDO usar Emojis como Ícones de UI (`No Emojis as Icons`)**:
   - Nunca utilize emojis (`🚗`, `👤`, `✏️`, `🗑️`, `🔍`) em botões, abas de navegação, badges ou cabeçalhos.
   - Utilize **sempre ícones vetoriais SVG** (padrão Lucide / Heroicons) com `stroke-width` uniforme (`1.75` ou `2`) e tamanhos padronizados (`16px`, `18px`, `20px`, `24px`).
2. **Consistência de Bordas, Cursores e Micro-interações**:
   - Todo elemento clicável (`button`, links, cards interativos, abas) DEVE ter `cursor: pointer`.
   - Transições suaves entre `150ms` e `250ms` (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Evite transformações `scale()` exageradas que desloquem elementos vizinhos; prefira elevação sutil (`translateY(-1px)`) e mudança de cor de borda/sombra.
3. **Hierarquia Visual e Dados Tabulares**:
   - Valores monetários (`R$`), datas, CPFs, placas e códigos de contrato devem usar `font-variant-numeric: tabular-nums` ou fonte monoespaçada para alinhamento vertical perfeito.
   - Páginas de gestão devem apresentar **Cards de KPI (Resumo Executivo)** no topo antes de tabelas densas.
4. **Acessibilidade (a11y) e Estados de Interface**:
   - Estados `:focus-visible` nítidos com anel de foco (`box-shadow: 0 0 0 3px var(--ring)`).
   - Sempre associe `<label>` aos campos de formulário e forneça feedback claro de carregamento, erro, sucesso e estado vazio (*Empty State* ilustrado com SVG).

---

## 3. Pre-Delivery Checklist (Verificação Obrigatória Antes de Entregar)

- [ ] **Zero emojis usados como ícones** (todos substituídos por componentes SVG limpos).
- [ ] **`cursor: pointer`** presente em todos os botões, abas e ações.
- [ ] **Contraste de texto** mínimo de 4.5:1 em relação ao fundo.
- [ ] **Tipografia pareada** carregada e aplicada corretamente (`Plus Jakarta Sans` + `Inter` + `JetBrains Mono`).
- [ ] **Responsividade** testada sem quebra de layout ou scroll horizontal indesejado na página.
- [ ] **Estados de foco, hover e disabled** implementados em todos os controles interativos.
