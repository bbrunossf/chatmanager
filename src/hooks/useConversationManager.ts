import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  author: {
    role: string;
    name?: string;
  };
  create_time: number;
  content: {
    content_type: string;
    parts: string[];
  };
}

export interface Conversation {
  id: string;
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, any>;
  current_node?: string;
}

export interface ConversationData extends Conversation {
  messages?: Message[];
}

export function useConversationManager() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Extrair mensagens de uma conversa
  const extractMessages = useCallback((conversation: Conversation): Message[] => {
    const messages: Message[] = [];
    let currentNode = conversation.current_node;
    const mapping = conversation.mapping || {};

    while (currentNode) {
      const node = mapping[currentNode];
      if (!node) break;

      const message = node.message;
      if (message) {
        messages.push(message);
      }

      currentNode = node.parent;
    }

    return messages.reverse();
  }, []);

  // Carregar arquivo JSON
  const loadFromFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const conversationList = Array.isArray(data) ? data : [data];
        
        const processedConversations = conversationList.map((conv: any) => ({
          ...conv,
          messages: extractMessages(conv),
        }));

        setConversations(processedConversations);
        if (processedConversations.length > 0) {
          setSelectedId(processedConversations[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar arquivo:', error);
        alert('Erro ao carregar o arquivo JSON. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  }, [extractMessages]);

  // Deletar conversa
  const deleteConversation = useCallback((id: string) => {
    const newConversations = conversations.filter((conv) => conv.id !== id);
    setConversations(newConversations);

    if (selectedId === id) {
      setSelectedId(newConversations.length > 0 ? newConversations[0].id : null);
    }
  }, [conversations, selectedId]);

  // Exportar conversa
  const exportConversation = useCallback((id: string) => {
    const conversation = conversations.find((conv) => conv.id === id);
    if (!conversation) return;

    const dataToExport = {
      id: conversation.id,
      title: conversation.title,
      create_time: conversation.create_time,
      update_time: conversation.update_time,
      mapping: conversation.mapping,
      current_node: conversation.current_node,
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${id.slice(0, 8)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [conversations]);

  // Exportar todas as conversas
  const exportAllConversations = useCallback(() => {
    const dataToExport = conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      create_time: conv.create_time,
      update_time: conv.update_time,
      mapping: conv.mapping,
      current_node: conv.current_node,
    }));

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversations_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [conversations]);

  // Filtrar conversas por busca
  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find((conv) => conv.id === selectedId);

  return {
    conversations,
    filteredConversations,
    selectedConversation,
    selectedId,
    searchQuery,
    setSearchQuery,
    setSelectedId,
    loadFromFile,
    deleteConversation,
    exportConversation,
    exportAllConversations,
  };
}
