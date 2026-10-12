# ChatGPT Conversation Manager

Uma aplicação React moderna e responsiva para gerenciar, visualizar, buscar, organizar com tags, deletar e exportar suas conversas exportadas do ChatGPT. Roda inteiramente no navegador — **nenhum dado sai da sua máquina**.

## ✨ Funcionalidades

- 📋 **Carregamento de JSON**: importe seu `conversations.json` exportado do ChatGPT (array de conversas ou uma conversa única)
- 🧪 **Dados de exemplo automáticos**: sem nada salvo no navegador, a aplicação abre com 6 conversas sintéticas — nunca há tela vazia
- 🏷️ **Tags próprias**: crie, renomeie e apague tags; aplique em uma conversa ou em várias de uma vez; filtre a lista por tag
- 🔍 **Busca e ordenação**: busque por título em tempo real e ordene por criação ou atualização, do mais recente ao mais antigo
- 💬 **Visualização completa**: todas as mensagens, com autor e horário formatados em pt-BR
- 🎨 **Realce de código**: blocos de código destacados por linguagem, com botão de copiar
- 🎙️ **Transcrições de áudio**: exibe respostas em áudio pela transcrição (`multimodal_text`)
- 📥 **Exportação individual ou em lote**: baixe uma conversa ou todas; opção de incluir as tags no arquivo
- 🗑️ **Exclusão individual ou em massa**: com marcação por caixa de seleção, "selecionar todas" e confirmação
- 🔔 **Notificações**: avisos de sucesso e erro nas ações
- 💾 **Persistência**: conversas, tags e o nome do arquivo de origem ficam salvos no `localStorage`
- 📱 **Responsivo**: funciona em desktop, tablet e mobile

## 🎨 Design

- **Minimalismo Funcional**: interface limpa e intuitiva
- **Paleta Profissional**: Azul profundo, laranja e verde
- **Tipografia Refinada**: Geist para títulos, Inter para corpo
- **Animações Suaves**: Transições elegantes e fade-in em cascata

## 🚀 Quick Start

### 1. Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/bbrunossf/chatmanager.git
cd chatmanager

# Instalar dependências
pnpm install
# ou: npm install
# ou: yarn install
```

### 3. Desenvolvimento

```bash
pnpm dev
```

Acesse `http://localhost:5173`

### 4. Build para Produção

```bash
pnpm build
```

Os arquivos otimizados estarão em `dist/`

## 📖 Como Usar

### Conversas de exemplo

Ao abrir a aplicação sem nada salvo, ela já vem com **6 conversas sintéticas** (dados de demonstração, sem conteúdo pessoal). Para trabalhar com as suas, carregue o seu export.

### Carregar conversas

1. Clique em **"Carregar JSON"**
2. Selecione seu arquivo `conversations.json` do ChatGPT
3. As conversas substituem os exemplos e aparecem na barra lateral, com o nome do arquivo ao lado

### Organizar com tags

- Clique em **"Adicionar tag..."** no topo da conversa aberta para criar/aplicar uma tag
- Com conversas marcadas na barra lateral, use **"Adicionar tag"** para aplicar a mesma tag a todas
- Renomeie ou apague tags pelo próprio chip; use o filtro de tags para ver só um grupo

### Buscar e ordenar

Use o campo de busca para filtrar por título em tempo real. O seletor acima da lista ordena por criação ou atualização, do mais recente ou do mais antigo.

### Visualizar

Clique em uma conversa para ver todas as mensagens com timestamps e autores. Blocos de código aparecem com realce e botão de copiar.

### Exportar

- **Individual**: clique em "Exportar" na conversa
- **Todas**: clique em "Exportar Todas" no topo
- Marque **"Incluir tags no export"** para que as tags vão junto no JSON

### Deletar

- **Individual**: clique em "Deletar" na conversa e confirme
- **Em massa**: marque as conversas (ou "Selecionar todas") e use o botão de deleção da seleção

## 📁 Estrutura do Projeto

```
chatmanager/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── sample_conversations.json   # dados de exemplo carregados automaticamente
├── src/
│   ├── assets/                     # imagens usadas na interface
│   ├── components/
│   │   ├── ui/                     # componentes shadcn/ui (button, card, input, scroll-area, sonner)
│   │   ├── ConversationSidebar.tsx # lista, busca, ordenação, tags em lote e exclusão múltipla
│   │   └── ConversationViewer.tsx  # mensagens, realce de código e tags da conversa
│   ├── hooks/
│   │   └── useConversationManager.ts  # parsing, estado, tags, exportação e persistência
│   ├── lib/utils.ts
│   ├── App.tsx                     # composição da tela e carga inicial
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── components.json                 # configuração do shadcn/ui
├── GUIA_USO.md
└── README_DEV.md
```

## 🛠️ Stack Tecnológico

| Biblioteca | Papel |
|---|---|
| **React 19** | interface |
| **TypeScript** | tipagem |
| **Vite** | build e servidor de desenvolvimento |
| **Tailwind CSS 4** | estilo |
| **shadcn/ui** (em `src/components/ui`) | componentes de interface |
| **class-variance-authority + clsx + tailwind-merge** | variantes e composição de classes |
| **highlight.js** | realce dos blocos de código |
| **sonner** | notificações |
| **date-fns** | datas em pt-BR |
| **lucide-react** | ícones |

As **versões exatas** estão em [`package.json`](./package.json) — deliberadamente não repetidas aqui, para não envelhecerem no README.

> Duas dependências declaradas no `package.json` — `wouter` e `zod` — **não são importadas em
> nenhum arquivo de `src/`**: são resíduos de versões anteriores e podem ser removidas.

## 🌐 Deploy

A aplicação é 100% client-side (arquivos estáticos em `dist/`), então qualquer host estático serve.

### Vercel

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages

Defina o `base` com o nome do repositório em `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/chatmanager/',
  // ...
})
```

Depois:

```bash
pnpm build
# publique o conteúdo de dist/ na branch gh-pages
```

## 📝 Documentação

- **[GUIA_USO.md](./GUIA_USO.md)** - Guia completo de uso
- **[README_DEV.md](./README_DEV.md)** - Documentação técnica

## 🧪 Teste com Exemplo

A aplicação **carrega automaticamente** os dados de exemplo ao abrir, sempre que não houver conversas salvas no navegador: são **6 conversas sintéticas** (40 mensagens), criadas para demonstração, sem nenhum dado pessoal. O arquivo fica em **[`public/sample_conversations.json`](./public/sample_conversations.json)**.

Para testar com o seu próprio export, use o botão **Carregar JSON** — o arquivo carregado substitui os exemplos.

## 💾 Persistência de Dados

- Conversas, tags e o nome do arquivo de origem são salvos automaticamente no **localStorage** do navegador
- Nenhum dado é enviado para servidores externos — não há backend
- Limpe o cache/dados do site no navegador para resetar (a aplicação volta a abrir com os exemplos)

## 🐛 Troubleshooting

### "Module not found"
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Porta 5173 em uso
```bash
pnpm dev -- --port 3000
```

### Erro ao carregar JSON
- Verifique se o arquivo é JSON válido
- Certifique-se de que foi exportado corretamente do ChatGPT
- Teste com o exemplo em `public/sample_conversations.json`

## 🎯 Roadmap

Já entregue:

- [x] Tags por conversa, aplicação em lote, renomear/apagar e filtro por tag
- [x] Exclusão em massa com seleção
- [x] Realce de código e notificações
- [x] Dados de exemplo carregados automaticamente
- [x] Ordenação por criação/atualização

Pendente:

- [ ] Edição de títulos de conversas
- [ ] Filtro por período (além da ordenação)
- [ ] Busca por conteúdo das mensagens (hoje é por título)
- [ ] Tema escuro alternável
- [ ] Testes automatizados
- [ ] Análise e estatísticas das conversas

## 📊 Estrutura do JSON do ChatGPT

```json
{
  "id": "unique-id",
  "title": "Título da Conversa",
  "create_time": 1690996989.403533,
  "update_time": 1691253876.0,
  "current_node": "node-id",
  "mapping": {
    "node-id": {
      "id": "node-id",
      "parent": "parent-node-id",
      "message": {
        "id": "message-id",
        "author": {
          "role": "user|assistant|system|tool"
        },
        "create_time": 1690996989.403809,
        "content": {
          "content_type": "text",
          "parts": ["Texto da mensagem"]
        }
      }
    }
  }
}
```

Observações de compatibilidade:

- o nó raiz de cada conversa tem `message: null`, e a leitura parte de `current_node` subindo por `parent`;
- além de `content_type: "text"`, a aplicação exibe `multimodal_text` (respostas em áudio, pela parte
  `audio_transcription`);
- campos que a aplicação não usa (como `metadata`, `plugin_ids` ou `memory_scope`) são preservados
  nos arquivos exportados.

## 📄 Licença

MIT.

---

**Última atualização**: outubro de 2026
**Autor**: Bruno Oliveira ([@bbrunossf](https://github.com/bbrunossf))
