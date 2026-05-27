import { useConversationManager } from './hooks/useConversationManager';
import ConversationSidebar from './components/ConversationSidebar';
import ConversationViewer from './components/ConversationViewer';
import { useEffect } from 'react';

/**
 * Design: Minimalismo Funcional
 * - Barra lateral fixa à esquerda com lista de conversas
 * - Painel principal expansível para visualizar conversas
 * - Paleta: Azul profundo (#1e40af), Laranja (#f97316), Verde (#10b981)
 * - Tipografia: Geist para títulos, Inter para corpo
 * - Animações suaves com fade-in e slide-in
 */
export default function Home() {
  const {
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
  } = useConversationManager();

  // Carregar dados de exemplo do localStorage se disponível
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatgpt_conversations');
    if (savedConversations && conversations.length === 0) {
      try {
        const data = JSON.parse(savedConversations);
        const file = new File([JSON.stringify(data)], 'conversations.json', {
          type: 'application/json',
        });
        loadFromFile(file);
      } catch (error) {
        console.error('Erro ao carregar conversas salvas:', error);
      }
    }
  }, []);

  // Salvar conversas no localStorage sempre que mudarem
  useEffect(() => {
    if (conversations.length > 0) {
      const dataToSave = conversations.map((conv) => ({
        id: conv.id,
        title: conv.title,
        create_time: conv.create_time,
        update_time: conv.update_time,
        mapping: conv.mapping,
        current_node: conv.current_node,
      }));
      localStorage.setItem('chatgpt_conversations', JSON.stringify(dataToSave));
    }
  }, [conversations]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 flex flex-col border-r border-border">
        <ConversationSidebar
          conversations={conversations}
          selectedId={selectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectConversation={setSelectedId}
          onDeleteConversation={deleteConversation}
          onExportConversation={exportConversation}
          onLoadFile={loadFromFile}
          onExportAll={exportAllConversations}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 hidden md:flex flex-col">
        <ConversationViewer conversation={selectedConversation || null} />
      </div>

      {/* Mobile View */}
      <div className="flex-1 md:hidden flex flex-col">
        {selectedConversation ? (
          <ConversationViewer conversation={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Selecione uma conversa para visualizar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
