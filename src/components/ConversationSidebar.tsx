import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Trash2, Download } from 'lucide-react';
import type { ConversationData } from '@/hooks/useConversationManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ConversationSidebarProps {
  conversations: ConversationData[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onExportConversation: (id: string) => void;
  onLoadFile: (file: File) => void;
  onExportAll: () => void;
}

export default function ConversationSidebar({
  conversations,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onDeleteConversation,
  onExportConversation,
  onLoadFile,
  onExportAll,
}: ConversationSidebarProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadFile(file);
    }
    e.target.value = '';
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border space-y-3">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Conversas</h2>

        {/* Upload Button */}
        <label className="block">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 cursor-pointer"
            onClick={(e) => {
              (e.currentTarget.parentElement?.querySelector('input[type="file"]') as HTMLInputElement)?.click();
            }}
          >
            <Upload size={16} />
            Carregar JSON
          </Button>
        </label>

        {/* Search Input */}
        <Input
          placeholder="Buscar conversas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-sm"
        />

        {/* Export All Button */}
        {conversations.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center gap-2"
            onClick={onExportAll}
          >
            <Download size={16} />
            Exportar Todas
          </Button>
        )}
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                {conversations.length === 0
                  ? 'Nenhuma conversa carregada'
                  : 'Nenhuma conversa encontrada'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all duration-150 ${
                  selectedId === conversation.id
                    ? 'bg-sidebar-accent border-l-primary shadow-sm'
                    : 'bg-sidebar border-l-transparent hover:bg-sidebar-accent'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                {/* Title */}
                <h3 className="font-medium text-sm text-sidebar-foreground truncate mb-1">
                  {conversation.title || 'Sem título'}
                </h3>

                {/* Metadata */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(conversation.create_time * 1000), 'dd MMM yyyy', {
                      locale: ptBR,
                    })}
                  </span>
                  {conversation.messages && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {conversation.messages.length} msg
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-7 text-xs gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExportConversation(conversation.id);
                    }}
                  >
                    <Download size={14} />
                    Exportar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-7 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Tem certeza que deseja deletar esta conversa?')) {
                        onDeleteConversation(conversation.id);
                      }
                    }}
                  >
                    <Trash2 size={14} />
                    Deletar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      {conversations.length > 0 && (
        <div className="p-3 border-t border-sidebar-border text-xs text-muted-foreground text-center">
          {filteredConversations.length} de {conversations.length} conversa
          {conversations.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
