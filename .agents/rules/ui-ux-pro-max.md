---
trigger: always_on
description: Aplica automaticamente os padrões da skill UI/UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill) em todas as interações de Front-end.
---

# Regra Permanente de Front-end: UI/UX Pro Max

Sempre que criar, editar ou refatorar qualquer arquivo de Front-end (`frontend/src/**`, `.jsx`, `.tsx`, `.css`, `.html`):

1. **Consulte e siga o Design System** definido em `design-system/MASTER.md` e as diretrizes de `.agents/skills/ui-ux-pro-max/SKILL.md`.
2. **Proibido Emojis como Ícones**: Nunca insira emojis (`🚗`, `👤`, `🏢`, `✏️`, etc.) na interface. Use exclusivamente ícones vetoriais SVG (`frontend/src/components/Icons.jsx`).
3. **Qualidade Visual SaaS Pro Max**:
   - Use tipografia pareada (`Plus Jakarta Sans` para títulos, `Inter` para interface e `JetBrains Mono` / `tabular-nums` para códigos, placas e valores monetários);
   - Mantenha `cursor: pointer` e estados `:hover` / `:focus-visible` suaves (`180ms`) em todos os elementos interativos;
   - Garanta hierarquia visual clara com KPIs executivos, badges semânticas com indicador luminoso (dot) e tabelas limpas.
