# Ideias de Design - ChatGPT Conversation Manager

## Abordagem Selecionada: Minimalismo Funcional com Acentos de Cor

### Design Movement
**Minimalismo Moderno com Influências de Design de Sistemas** — inspirado em ferramentas profissionais como Notion, Linear e Figma. Foco em clareza, hierarquia visual e eficiência.

### Core Principles
1. **Clareza Radical**: Cada elemento tem um propósito claro. Sem decoração desnecessária, mas com refinamento.
2. **Hierarquia Visual Forte**: Tamanho, peso e cor trabalham juntos para guiar a atenção.
3. **Eficiência de Espaço**: Barra lateral compacta e conteúdo principal expansível para maximizar a visualização de conversas.
4. **Feedback Imediato**: Transições suaves e estados visuais claros para cada ação (seleção, exclusão, exportação).

### Color Philosophy
- **Paleta Principal**: Azul profundo (`#1e40af`) como cor primária, representando confiança e profissionalismo.
- **Acentos**: Laranja suave (`#f97316`) para ações destrutivas (delete) e verde (`#10b981`) para ações positivas (export).
- **Neutros**: Cinza claro para backgrounds, cinza escuro para texto — contraste alto para legibilidade.
- **Reasoning**: Cores vibrantes mas contidas, sem gradientes excessivos. O foco está no conteúdo, não na decoração.

### Layout Paradigm
- **Sidebar Esquerda Fixa**: Lista de conversas com busca/filtro no topo. Altura máxima com scroll interno.
- **Painel Principal Expansível**: Exibe a conversa selecionada em cards com timestamps, autores e mensagens.
- **Header Compacto**: Título, ícone de upload e botões de ação (export, delete) alinhados à direita.
- **Assimétrico**: Sidebar ocupa ~25% da largura em desktop, conversas ocupam 75%. Em mobile, stack vertical.

### Signature Elements
1. **Card de Conversa com Hover Elevado**: Sutil elevação (shadow) ao passar o mouse, indicando interatividade.
2. **Indicador de Seleção**: Borda esquerda azul grossa em conversas selecionadas na sidebar.
3. **Badges de Metadata**: Data de criação, número de mensagens, última atualização em badges pequenas e discretas.

### Interaction Philosophy
- **Seleção Imediata**: Clique na sidebar seleciona a conversa e carrega no painel principal instantaneamente.
- **Confirmação para Ações Destrutivas**: Delete abre um dialog de confirmação com aviso visual em laranja.
- **Feedback Tátil**: Botões mudam de cor ao hover, pressionam levemente ao click (scale 0.97).
- **Transições Suaves**: Fade-in de conversas, slide de modais, sem animações que distraem.

### Animation
- **Entrada de Conversas**: Fade-in com delay de 30-50ms entre items (cascata suave).
- **Hover de Botões**: Scale 0.97 + mudança de cor em 150ms ease-out.
- **Modais**: Scale de 0.95 + opacity 0 → 1 em 200ms ease-out, origem centrada.
- **Transição de Conversa**: Fade-out da anterior + fade-in da nova em 150ms.
- **Respeito a `prefers-reduced-motion`**: Todas as animações desabilitadas se o usuário preferir.

### Typography System
- **Display**: `Geist` (Google Fonts) — bold, 28px para títulos principais. Transmite modernidade e clareza.
- **Body**: `Inter` — regular 14px para texto de conversas, 12px para metadata. Altamente legível em telas.
- **Monospace**: `Monaco` ou `Courier New` para timestamps e IDs de conversa (quando necessário).
- **Hierarchy**: H1 (28px bold), H2 (20px semibold), H3 (16px semibold), Body (14px regular), Caption (12px regular).

---

## Alternativas Não Selecionadas

### Abordagem 2: Dark Mode Futurista (Probabilidade: 0.08)
Tema escuro com gradientes neon, inspirado em dashboards de hacker/sci-fi. Paleta: preto profundo, ciano, magenta. Seria visualmente impactante mas poderia cansar os olhos em sessões longas.

### Abordagem 3: Soft Brutalism (Probabilidade: 0.07)
Design com bordas retas, tipografia pesada, e muito whitespace. Cores terrosas (bege, marrom, verde oliva). Seria único mas menos intuitivo para uma ferramenta de produtividade.

---

## Decisão Final
**Minimalismo Funcional** foi escolhido porque:
- Maximiza a legibilidade e usabilidade para uma ferramenta de gerenciamento.
- Permite que o conteúdo (conversas) seja o foco principal.
- Escala bem em diferentes tamanhos de tela.
- Transmite profissionalismo e confiança.
