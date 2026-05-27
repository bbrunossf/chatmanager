# ChatGPT Conversation Manager - Guia de Uso

## 📋 Visão Geral

O **ChatGPT Conversation Manager** é uma aplicação React para gerenciar, visualizar, buscar, deletar e exportar suas conversas exportadas do ChatGPT. Ele oferece uma interface limpa e intuitiva com uma barra lateral para seleção de conversas e um painel principal para visualização detalhada.

## 🚀 Como Usar

### 1. Carregar um Arquivo JSON

1. Clique no botão **"Carregar JSON"** na barra lateral esquerda
2. Selecione o arquivo `conversations.json` exportado do ChatGPT
3. As conversas serão carregadas e exibidas na lista

**Formato esperado:** O arquivo deve ser um JSON com um array de objetos de conversa ou um único objeto de conversa. Cada conversa deve ter a estrutura padrão do ChatGPT com campos como `id`, `title`, `create_time`, `update_time`, `mapping`, e `current_node`.

### 2. Selecionar uma Conversa

1. Clique em qualquer conversa na barra lateral esquerda
2. A conversa será exibida no painel principal com todas as mensagens
3. Você verá a data de criação, data de atualização e número de mensagens

### 3. Buscar Conversas

1. Use o campo **"Buscar conversas..."** na barra lateral
2. Digite o título ou parte do título da conversa que procura
3. A lista será filtrada em tempo real

### 4. Visualizar Mensagens

- Cada mensagem é exibida com:
  - **Autor**: "Você" (mensagens do usuário) ou "ChatGPT" (respostas da IA)
  - **Timestamp**: Data e hora exata da mensagem
  - **Conteúdo**: Texto completo da mensagem
  - **Avatar**: Ícone diferente para cada tipo de autor

### 5. Exportar uma Conversa Individual

1. Selecione a conversa que deseja exportar
2. Clique no botão **"Exportar"** na conversa (na barra lateral)
3. Um arquivo JSON será baixado com o nome: `{titulo_conversa}_{id_curto}.json`
4. Este arquivo contém apenas a conversa selecionada

### 6. Exportar Todas as Conversas

1. Clique no botão **"Exportar Todas"** no topo da barra lateral
2. Um arquivo JSON será baixado com o nome: `conversations_{data}.json`
3. Este arquivo contém todas as conversas carregadas

### 7. Deletar uma Conversa

1. Clique no botão **"Deletar"** na conversa (na barra lateral)
2. Uma confirmação será solicitada
3. Após confirmar, a conversa será removida da lista
4. **Nota**: A exclusão é local. Para salvar as mudanças permanentemente, exporte as conversas restantes

## 💾 Persistência de Dados

- As conversas carregadas são **automaticamente salvas no localStorage** do navegador
- Quando você retornar à aplicação, as conversas serão carregadas novamente
- **Limpeza de cache**: Se você limpar o cache/cookies do navegador, os dados serão perdidos

## 📱 Responsividade

- **Desktop**: Barra lateral à esquerda (25%) + Painel de conversas à direita (75%)
- **Tablet/Mobile**: Interface adaptada com stack vertical. Selecione uma conversa na barra lateral para visualizá-la

## 🎨 Design

A aplicação usa um design **Minimalista Funcional** com:
- **Paleta de Cores**: Azul profundo (primária), Laranja (ações destrutivas), Verde (ações positivas)
- **Tipografia**: Geist para títulos, Inter para corpo
- **Animações**: Transições suaves e fade-in em cascata para melhor UX

## 📊 Estrutura do JSON do ChatGPT

Cada conversa exportada do ChatGPT tem a seguinte estrutura:

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
      "children": ["child-node-id"],
      "message": {
        "id": "message-id",
        "author": {
          "role": "user" | "assistant" | "system",
          "name": null,
          "metadata": {}
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

## 🔧 Funcionalidades Técnicas

- **Extração de Mensagens**: A aplicação percorre a estrutura `mapping` do ChatGPT para extrair as mensagens em ordem cronológica
- **Busca em Tempo Real**: Filtra conversas por título enquanto você digita
- **Download de Arquivos**: Usa Blob API para gerar e baixar arquivos JSON
- **Responsividade**: Usa Tailwind CSS para adaptar-se a diferentes tamanhos de tela

## 📝 Exemplo de Uso

1. Exporte suas conversas do ChatGPT (Settings → Data Export)
2. Abra a aplicação e clique em "Carregar JSON"
3. Selecione o arquivo `conversations.json`
4. Navegue pelas conversas usando a barra lateral
5. Use a busca para encontrar conversas específicas
6. Exporte conversas individuais para backup ou compartilhamento
7. Delete conversas que não precisa mais

## ⚠️ Observações Importantes

- **Dados Locais**: Todos os dados são armazenados localmente no seu navegador. Nenhuma informação é enviada para servidores externos.
- **Backup**: Sempre faça backup de suas conversas importantes antes de deletar
- **Compatibilidade**: A aplicação foi testada com o formato de exportação padrão do ChatGPT (OpenAI)
- **Performance**: Para arquivos com muitas conversas (1000+), a aplicação pode levar alguns segundos para carregar

## 🐛 Troubleshooting

### "Erro ao carregar o arquivo JSON"
- Verifique se o arquivo é um JSON válido
- Certifique-se de que o arquivo foi exportado corretamente do ChatGPT
- Tente abrir o arquivo em um editor de texto para verificar a formatação

### Conversas não aparecem após carregar
- Verifique se o arquivo contém conversas com a estrutura esperada
- Tente usar o arquivo de exemplo `sample_conversations.json` para testar

### Dados desaparecem ao fechar o navegador
- Os dados são salvos no localStorage, mas podem ser perdidos se você limpar o cache
- Exporte suas conversas regularmente para backup

## 📞 Suporte

Para problemas ou sugestões, você pode:
- Verificar o console do navegador (F12) para mensagens de erro
- Testar com o arquivo de exemplo incluído
- Revisar a estrutura do seu arquivo JSON

---

**Versão**: 1.0.0  
**Última atualização**: Maio 2026
