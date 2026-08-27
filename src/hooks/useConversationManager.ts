import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

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

export interface ConversationMappingNode {
  message?: Message | null;
  parent?: string;
}

export interface Conversation {
  id: string;
  title: string;
  create_time: number;
  update_time: number;
  mapping: Record<string, ConversationMappingNode>;
  current_node?: string;
  tags?: string[];
}

export interface ConversationData extends Conversation {
  messages?: Message[];
}

export function useConversationManager() {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [includeTagsInExport, setIncludeTagsInExport] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

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
  const loadFromFile = useCallback((file: File, fileNameOverride?: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as
          | Conversation[]
          | Conversation;
        const conversationList = Array.isArray(data) ? data : [data];
        
        const processedConversations = conversationList.map((conv) => ({
          ...conv,
          messages: extractMessages(conv),
        }));

        setConversations(processedConversations);
        setFileName(fileNameOverride ?? file.name);
        if (processedConversations.length > 0) {
          setSelectedId(processedConversations[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar arquivo:', error);
        toast.error('Erro ao carregar o arquivo JSON. Verifique o formato.');
      }
    };
    reader.readAsText(file);
  }, [extractMessages]);

  // Deletar múltiplas conversas de uma vez
  const deleteConversations = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    const newConversations = conversations.filter((conv) => !idSet.has(conv.id));
    setConversations(newConversations);

    if (newConversations.length === 0) {
      setFileName(null);
    }

    if (selectedId && idSet.has(selectedId)) {
      setSelectedId(newConversations.length > 0 ? newConversations[0].id : null);
    }

    toast.success(
      `${ids.length} conversa${ids.length !== 1 ? 's' : ''} excluída${ids.length !== 1 ? 's' : ''}`
    );
  }, [conversations, selectedId]);

  // Deletar uma conversa
  const deleteConversation = useCallback((id: string) => {
    deleteConversations([id]);
  }, [deleteConversations]);

  // Adicionar tag a várias conversas de uma vez (normaliza: trim + minúsculas, sem duplicatas)
  const addTagsToConversations = useCallback((ids: string[], tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized) return;

    const idSet = new Set(ids);
    setConversations((prev) =>
      prev.map((conv) => {
        if (!idSet.has(conv.id)) return conv;
        const tags = conv.tags ?? [];
        return tags.includes(normalized)
          ? conv
          : { ...conv, tags: [...tags, normalized] };
      })
    );
  }, []);

  // Adicionar tag a uma conversa
  const addTag = useCallback((id: string, tag: string) => {
    addTagsToConversations([id], tag);
  }, [addTagsToConversations]);

  // Remover tag de uma conversa
  const removeTag = useCallback((id: string, tag: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id
          ? { ...conv, tags: (conv.tags ?? []).filter((t) => t !== tag) }
          : conv
      )
    );
  }, []);

  // Renomear uma tag em todas as conversas
  const renameTag = useCallback((oldTag: string, newTag: string) => {
    const normalized = newTag.trim().toLowerCase();
    if (!normalized || normalized === oldTag) return;

    setConversations((prev) =>
      prev.map((conv) => {
        const tags = conv.tags ?? [];
        if (!tags.includes(oldTag)) return conv;
        const withoutOld = tags.filter((t) => t !== oldTag);
        return withoutOld.includes(normalized)
          ? { ...conv, tags: withoutOld }
          : { ...conv, tags: [...withoutOld, normalized] };
      })
    );
  }, []);

  // Remover uma tag de todas as conversas
  const deleteTag = useCallback((tag: string) => {
    const affected = conversations.filter((conv) =>
      (conv.tags ?? []).includes(tag)
    ).length;

    setConversations((prev) =>
      prev.map((conv) =>
        conv.tags
          ? { ...conv, tags: conv.tags.filter((t) => t !== tag) }
          : conv
      )
    );

    toast.success(
      `Tag "${tag}" removida de ${affected} conversa${affected !== 1 ? 's' : ''}`
    );
  }, [conversations]);

  // Todas as tags usadas, com contagem de conversas por tag
  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const conv of conversations) {
      for (const tag of conv.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts, ([tag, count]) => ({ tag, count })).sort((a, b) =>
      a.tag.localeCompare(b.tag)
    );
  }, [conversations]);

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
      ...(includeTagsInExport ? { tags: conversation.tags ?? [] } : {}),
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
  }, [conversations, includeTagsInExport]);

  // Exportar todas as conversas
  const exportAllConversations = useCallback(() => {
    const dataToExport = conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      create_time: conv.create_time,
      update_time: conv.update_time,
      mapping: conv.mapping,
      current_node: conv.current_node,
      ...(includeTagsInExport ? { tags: conv.tags ?? [] } : {}),
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
  }, [conversations, includeTagsInExport]);

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
    fileName,
    loadFromFile,
    deleteConversation,
    deleteConversations,
    addTag,
    removeTag,
    addTagsToConversations,
    renameTag,
    deleteTag,
    allTags,
    includeTagsInExport,
    setIncludeTagsInExport,
    exportConversation,
    exportAllConversations,
  };
}
