import { useConversationManager } from './hooks/useConversationManager';
import ConversationSidebar from './components/ConversationSidebar';
import ConversationViewer from './components/ConversationViewer';
import { Toaster } from './components/ui/sonner';
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
    selectedConversation,
    selectedId,
    searchQuery,
    setSearchQuery,
    setSelectedId,
    fileName,
    loadFromFile,
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
  } = useConversationManager();

  // Carregar dados de exemplo do localStorage se disponível
  useEffect(() => {
    const savedConversations = localStorage.getItem('chatgpt_conversations');
    const savedFileName = localStorage.getItem('chatgpt_conversations_filename');
    if (savedConversations && conversations.length === 0) {
      try {
        const data = JSON.parse(savedConversations);
        const file = new File(
          [JSON.stringify(data)],
          savedFileName ?? 'conversations.json',
          {
            type: 'application/json',
          }
        );
        loadFromFile(file, savedFileName ?? undefined);
      } catch (error) {
        console.error('Erro ao carregar conversas salvas:', error);
      }
    }
  }, [conversations.length, loadFromFile]);

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
        tags: conv.tags ?? [],
      }));
      localStorage.setItem('chatgpt_conversations', JSON.stringify(dataToSave));
      if (fileName) {
        localStorage.setItem('chatgpt_conversations_filename', fileName);
      }
    }
  }, [conversations, fileName]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 flex flex-col border-r border-border overflow-y-scroll">
        <ConversationSidebar
          conversations={conversations}
          selectedId={selectedId}
          searchQuery={searchQuery}
          fileName={fileName}
          onSearchChange={setSearchQuery}
          onSelectConversation={setSelectedId}
          onDeleteConversations={deleteConversations}
          onExportConversation={exportConversation}
          onLoadFile={loadFromFile}
          onExportAll={exportAllConversations}
          allTags={allTags}
          onAddTagsToConversations={addTagsToConversations}
          onRenameTag={renameTag}
          onDeleteTag={deleteTag}
          includeTagsInExport={includeTagsInExport}
          onIncludeTagsInExportChange={setIncludeTagsInExport}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 hidden md:flex flex-col overflow-y-scroll">
        <ConversationViewer
          conversation={selectedConversation || null}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />
      </div>

      {/* Mobile View */}
      <div className="flex-1 md:hidden flex flex-col overflow-y-scroll">
        {selectedConversation ? (
          <ConversationViewer
            conversation={selectedConversation}
            onAddTag={addTag}
            onRemoveTag={removeTag}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Selecione uma conversa para visualizar</p>
            </div>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  );
}
