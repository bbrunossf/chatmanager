# ChatGPT Conversation Manager - Documentação Técnica

## 🏗️ Arquitetura

### Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Roteamento**: Wouter (client-side)
- **Utilitários**: date-fns (formatação de datas)
- **Build**: Vite 7

### Estrutura de Pastas

```
client/
├── src/
│   ├── pages/
│   │   ├── Home.tsx              # Página principal com layout
│   │   └── NotFound.tsx          # Página 404
│   ├── components/
│   │   ├── ConversationSidebar.tsx    # Barra lateral com lista
│   │   ├── ConversationViewer.tsx     # Visualizador de mensagens
│   │   └── ui/                        # Componentes shadcn/ui
│   ├── hooks/
│   │   └── useConversationManager.ts  # Hook de gerenciamento de estado
│   ├── contexts/
│   │   └── ThemeContext.tsx      # Contexto de tema
│   ├── lib/
│   │   └── utils.ts              # Utilitários
│   ├── App.tsx                   # Componente raiz
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos globais
├── public/
│   └── favicon.ico
└── index.html
```

## 🎨 Design System

### Cores (OKLCH)

- **Primária**: `oklch(0.45 0.25 260)` - Azul profundo
- **Primária Foreground**: `oklch(0.98 0 0)` - Branco
- **Destructiva**: `oklch(0.6 0.22 30)` - Laranja
- **Accent**: `oklch(0.65 0.2 50)` - Laranja claro
- **Background**: `oklch(0.99 0.001 0)` - Branco quase puro
- **Foreground**: `oklch(0.2 0.01 260)` - Cinza escuro

### Tipografia

- **Display**: Geist (Google Fonts) - Bold, 28px para títulos
- **Body**: Inter (Google Fonts) - Regular, 14px para texto
- **Monospace**: Monaco/Courier New - Para timestamps

### Espaçamento

- Radius padrão: `0.5rem`
- Padding padrão: `1rem`
- Gap entre elementos: `0.5rem - 1rem`

## 🔧 Componentes Principais

### `useConversationManager` Hook

Gerencia todo o estado das conversas:

```typescript
const {
  conversations,              // Array de todas as conversas
  filteredConversations,      // Conversas filtradas por busca
  selectedConversation,       // Conversa selecionada
  selectedId,                 // ID da conversa selecionada
  searchQuery,                // Query de busca
  setSearchQuery,             // Atualizar query
  setSelectedId,              // Selecionar conversa
  loadFromFile,               // Carregar de arquivo
  deleteConversation,         // Deletar conversa
  exportConversation,         // Exportar individual
  exportAllConversations,     // Exportar todas
} = useConversationManager();
```

### `ConversationSidebar` Componente

Exibe a lista de conversas com:
- Upload de arquivo JSON
- Campo de busca
- Lista de conversas com metadados
- Botões de ação (exportar, deletar)
- Estatísticas

### `ConversationViewer` Componente

Exibe a conversa selecionada com:
- Header com título e metadados
- Lista de mensagens com timestamps
- Avatares diferenciados por autor
- Scroll infinito para conversas longas

## 📦 Dependências Principais

```json
{
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "typescript": "5.6.3",
  "tailwindcss": "^4.1.14",
  "date-fns": "4.3.0",
  "lucide-react": "^0.453.0",
  "wouter": "^3.3.5",
  "zod": "^4.1.12"
}
```

## 🚀 Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- pnpm 10+

### Instalação

```bash
cd /home/ubuntu/chatgpt-manager
pnpm install
```

### Executar Dev Server

```bash
pnpm dev
```

O servidor estará disponível em `http://localhost:3000`

### Build para Produção

```bash
pnpm build
```

Gera arquivos otimizados em `dist/`

### Verificação de Tipos

```bash
pnpm check
```

### Formatação de Código

```bash
pnpm format
```

## 🔄 Fluxo de Dados

1. **Carregamento**: Usuário seleciona arquivo JSON → `loadFromFile()` → Parse JSON → Extração de mensagens
2. **Seleção**: Usuário clica em conversa → `setSelectedId()` → Re-render do `ConversationViewer`
3. **Busca**: Usuário digita → `setSearchQuery()` → Filtro em tempo real
4. **Exportação**: Usuário clica exportar → Blob criado → Download iniciado
5. **Exclusão**: Usuário confirma delete → Conversa removida do estado → localStorage atualizado

## 💾 Persistência

### localStorage

- **Chave**: `chatgpt_conversations`
- **Formato**: JSON stringificado
- **Atualização**: Automática sempre que `conversations` muda
- **Carregamento**: Na primeira renderização se houver dados salvos

## 🧪 Testando

### Com Arquivo de Exemplo

1. Abra a aplicação
2. Clique em "Carregar JSON"
3. Selecione `sample_conversations.json`
4. Teste as funcionalidades:
   - Selecionar conversas
   - Buscar por título
   - Exportar individual
   - Exportar todas
   - Deletar com confirmação

### Casos de Teste

- [ ] Carregar arquivo JSON válido
- [ ] Carregar arquivo JSON inválido (erro tratado)
- [ ] Buscar conversa existente
- [ ] Buscar conversa inexistente (sem resultados)
- [ ] Selecionar conversa e visualizar mensagens
- [ ] Exportar conversa individual
- [ ] Exportar todas as conversas
- [ ] Deletar conversa com confirmação
- [ ] Deletar conversa e selecionar próxima
- [ ] Persistência em localStorage
- [ ] Responsividade em mobile/tablet

## 🎯 Funcionalidades Futuras

- [ ] Editar título de conversa
- [ ] Adicionar tags/categorias
- [ ] Filtrar por data
- [ ] Busca avançada (por conteúdo de mensagens)
- [ ] Tema escuro
- [ ] Sincronização com nuvem
- [ ] Compartilhamento de conversas
- [ ] Análise de conversas (estatísticas)
- [ ] Integração com APIs externas

## 🐛 Debugging

### Console do Navegador

Abra F12 e verifique:
- Erros de JavaScript
- Warnings de React
- Requisições de rede

### Estrutura do JSON

Se houver problemas ao carregar:

```javascript
// No console, teste:
const data = JSON.parse(fileContent);
console.log(data[0]); // Verifique a estrutura
```

## 📊 Performance

- **Renderização**: Otimizada com React 19 (auto batching)
- **Busca**: Filtro em O(n) - aceitável para <10k conversas
- **Animações**: Apenas `transform` e `opacity` (GPU accelerated)
- **Bundle**: ~150KB (gzipped)

## 🔐 Segurança

- **Dados Locais**: Nenhuma informação é enviada para servidores
- **Sanitização**: Não há risco de XSS (React sanitiza por padrão)
- **Validação**: JSON é validado antes de processar
- **CORS**: Não aplicável (frontend-only)

## 📝 Convenções de Código

- **Componentes**: PascalCase, arquivo .tsx
- **Hooks**: camelCase com prefixo `use`, arquivo .ts
- **Tipos**: PascalCase, exportados de componentes/hooks
- **Constantes**: UPPER_SNAKE_CASE
- **Estilos**: Tailwind classes, sem CSS customizado quando possível

## 🚢 Deployment

A aplicação é um projeto **web-static** e pode ser deployada em:

- Manus (built-in)
- Vercel
- Netlify
- GitHub Pages
- Qualquer servidor estático

### Build para Deploy

```bash
pnpm build
# Arquivos em dist/ prontos para servir
```

## 📚 Referências

- [React 19 Docs](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [date-fns](https://date-fns.org)
- [Wouter](https://github.com/molefrog/wouter)

---

**Versão**: 1.0.0  
**Última atualização**: Maio 2026
