# ChatGPT Conversation Manager

Uma aplicação React moderna e responsiva para gerenciar, visualizar, buscar, deletar e exportar suas conversas exportadas do ChatGPT.

## ✨ Funcionalidades

- 📋 **Carregamento de JSON**: Importe suas conversas exportadas do ChatGPT
- 🔍 **Busca em Tempo Real**: Encontre conversas por título instantaneamente
- 💬 **Visualização Completa**: Veja todas as mensagens com timestamps e autores
- 📥 **Exportação Individual**: Baixe conversas específicas em JSON
- 📤 **Exportação em Lote**: Exporte todas as conversas de uma vez
- 🗑️ **Gerenciamento**: Delete conversas com confirmação
- 💾 **Persistência**: Dados salvos automaticamente no localStorage
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile

## 🎨 Design

- **Minimalismo Funcional**: Interface limpa e intuitiva
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
git clone <seu-repositorio>
cd chatgpt-manager

# Renomear arquivos standalone
cp package.json.standalone package.json
cp vite.config.standalone.ts vite.config.ts
cp tsconfig.standalone.json tsconfig.json
cp tailwind.config.standalone.ts tailwind.config.ts
cp postcss.config.standalone.js postcss.config.js
cp .gitignore.standalone .gitignore

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

### Carregar Conversas

1. Clique em **"Carregar JSON"**
2. Selecione seu arquivo `conversations.json` do ChatGPT
3. As conversas aparecerão na barra lateral

### Buscar

Use o campo de busca para filtrar conversas por título em tempo real.

### Visualizar

Clique em uma conversa para ver todas as mensagens com timestamps e autores.

### Exportar

- **Individual**: Clique em "Exportar" na conversa
- **Todas**: Clique em "Exportar Todas" no topo

### Deletar

Clique em "Deletar" e confirme. A conversa será removida.

## 📁 Estrutura do Projeto

```
chatgpt-manager/
├── client/
│   ├── src/
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── components/     # Componentes React
│   │   │   ├── ui/         # Componentes shadcn/ui
│   │   │   ├── ConversationSidebar.tsx
│   │   │   └── ConversationViewer.tsx
│   │   ├── hooks/          # Custom hooks
│   │   │   └── useConversationManager.ts
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # Utilitários
│   │   ├── App.tsx         # Componente raiz
│   │   ├── main.tsx        # Entry point
│   │   └── index.css       # Estilos globais
│   ├── public/             # Assets estáticos
│   └── index.html
├── package.json.standalone
├── vite.config.standalone.ts
├── tsconfig.standalone.json
├── tailwind.config.standalone.ts
├── postcss.config.standalone.js
├── sample_conversations.json
├── GUIA_USO.md
├── README_DEV.md
├── INSTALACAO_STANDALONE.md
└── README.standalone.md
```

## 🛠️ Stack Tecnológico

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS 4**: Styling
- **shadcn/ui**: UI components
- **Wouter**: Client-side routing
- **date-fns**: Date formatting
- **Lucide React**: Icons

## 📦 Dependências Principais

```json
{
  "react": "^19.2.1",
  "react-dom": "^19.2.1",
  "typescript": "5.6.3",
  "tailwindcss": "^4.1.14",
  "vite": "^7.1.7",
  "date-fns": "^4.3.0",
  "lucide-react": "^0.453.0",
  "wouter": "^3.3.5"
}
```

## 🌐 Deploy

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

Edite `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/chatgpt-manager/',
  // ...
})
```

Depois:
```bash
pnpm build
# Push dist/ para gh-pages branch
```

### Docker

```bash
docker build -t chatgpt-manager .
docker run -p 3000:3000 chatgpt-manager
```

## 📝 Documentação

- **[GUIA_USO.md](./GUIA_USO.md)** - Guia completo de uso
- **[README_DEV.md](./README_DEV.md)** - Documentação técnica
- **[INSTALACAO_STANDALONE.md](./INSTALACAO_STANDALONE.md)** - Instruções de instalação

## 🧪 Teste com Exemplo

Um arquivo `sample_conversations.json` está incluído com 3 conversas de exemplo para testar todas as funcionalidades.

## 💾 Persistência de Dados

- Conversas são salvas automaticamente no **localStorage** do navegador
- Nenhum dado é enviado para servidores externos
- Limpe o cache do navegador para resetar

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
- Teste com `sample_conversations.json`

## 📄 Licença

MIT - Veja LICENSE para detalhes

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para problemas ou sugestões:
- Abra uma issue no repositório
- Verifique a documentação em GUIA_USO.md
- Teste com o arquivo de exemplo

## 🎯 Roadmap

- [ ] Edição de títulos de conversas
- [ ] Tags e categorias
- [ ] Filtro por data
- [ ] Busca por conteúdo de mensagens
- [ ] Tema escuro alternável
- [ ] Sincronização com nuvem
- [ ] Compartilhamento de conversas
- [ ] Análise e estatísticas

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
          "role": "user|assistant|system"
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

---

**Versão**: 1.0.0  
**Última atualização**: Maio 2026  
**Autor**: Desenvolvido com ❤️

Aproveite! 🚀
