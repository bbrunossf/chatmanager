import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, Trash2, Download, ArrowUpDown, Tag, Settings2, Pencil, X, FileJson } from 'lucide-react';
import type { ConversationData } from '@/hooks/useConversationManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface ConversationSidebarProps {
  conversations: ConversationData[];
  selectedId: string | null;
  searchQuery: string;
  fileName: string | null;
  allTags: { tag: string; count: number }[];
  includeTagsInExport: boolean;
  onSearchChange: (query: string) => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversations: (ids: string[]) => void;
  onExportConversation: (id: string) => void;
  onLoadFile: (file: File) => void;
  onExportAll: () => void;
  onAddTagsToConversations: (ids: string[], tag: string) => void;
  onRenameTag: (oldTag: string, newTag: string) => void;
  onDeleteTag: (tag: string) => void;
  onIncludeTagsInExportChange: (checked: boolean) => void;
}

type SortMode = 'update-desc' | 'update-asc' | 'create-desc' | 'create-asc';

export default function ConversationSidebar({
  conversations,
  selectedId,
  searchQuery,
  fileName,
  allTags,
  includeTagsInExport,
  onSearchChange,
  onSelectConversation,
  onDeleteConversations,
  onExportConversation,
  onLoadFile,
  onExportAll,
  onAddTagsToConversations,
  onRenameTag,
  onDeleteTag,
  onIncludeTagsInExportChange,
}: ConversationSidebarProps) {
  const [sortMode, setSortMode] = useState<SortMode>('update-desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const [manageTagsOpen, setManageTagsOpen] = useState(false);
  const [renamingTag, setRenamingTag] = useState<string | null>(null);
  const bulkTagInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Novo arquivo carregado: limpa a seleção de exclusão
      setSelectedIds(new Set());
      onLoadFile(file);
    }
    e.target.value = '';
  };

  const filteredConversations = conversations
    .filter((conv) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        conv.title.toLowerCase().includes(query) ||
        (conv.tags ?? []).some((tag) => tag.includes(query));
      const matchesTag = !activeTag || (conv.tags ?? []).includes(activeTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      const field = sortMode.startsWith('create') ? 'create_time' : 'update_time';
      const direction = sortMode.endsWith('asc') ? 1 : -1;
      return (a[field] - b[field]) * direction;
    });

  const visibleIds = filteredConversations.map((conv) => conv.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleDeleteOne = (id: string) => {
    toast('Excluir conversa?', {
      description: 'Essa ação não pode ser desfeita.',
      duration: Infinity,
      cancel: { label: 'Cancelar', onClick: () => {} },
      action: {
        label: 'Excluir',
        onClick: () => onDeleteConversations([id]),
      },
    });
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    toast(`Excluir ${count} conversa${count !== 1 ? 's' : ''}?`, {
      description: 'Essa ação não pode ser desfeita.',
      duration: Infinity,
      cancel: { label: 'Cancelar', onClick: () => {} },
      action: {
        label: 'Excluir',
        onClick: () => {
          onDeleteConversations(Array.from(selectedIds));
          setSelectedIds(new Set());
          setTagInputOpen(false);
        },
      },
    });
  };

  const handleBulkAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const input = bulkTagInputRef.current;
    if (!input) return;
    const tag = input.value.trim();
    if (tag && selectedIds.size > 0) {
      onAddTagsToConversations(Array.from(selectedIds), tag);
      toast.success(
        `Tag "${tag}" adicionada a ${selectedIds.size} conversa${selectedIds.size !== 1 ? 's' : ''}`
      );
    }
    input.value = '';
    setTagInputOpen(false);
  };

  const handleRenameTag = (oldTag: string) => (e: React.FormEvent) => {
    e.preventDefault();
    const input = renameInputRef.current;
    if (!input) return;
    const newTag = input.value.trim();
    if (newTag) {
      const normalized = newTag.toLowerCase();
      if (normalized !== oldTag) {
        onRenameTag(oldTag, newTag);
        setActiveTag((prev) => (prev === oldTag ? normalized : prev));
      }
    }
    setRenamingTag(null);
  };

  const handleDeleteTag = (tag: string) => {
    onDeleteTag(tag);
    setActiveTag((prev) => (prev === tag ? null : prev));
    setRenamingTag(null);
  };

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

        {/* Loaded file name */}
        {fileName && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-sidebar-accent rounded-md px-2.5 py-1.5">
            <FileJson size={14} className="shrink-0" />
            <span className="truncate" title={fileName}>
              {fileName}
            </span>
          </div>
        )}

        {/* Search Input */}
        <Input
          placeholder="Buscar conversas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-sm"
        />

        {/* Sort by date */}
        {conversations.length > 0 && (
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-muted-foreground shrink-0" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              aria-label="Ordenar conversas por data"
              className="w-full h-8 text-sm bg-background border border-border rounded-md px-2 text-foreground outline-none focus:border-ring"
            >
              <option value="update-desc">Atualização (mais recente)</option>
              <option value="update-asc">Atualização (mais antiga)</option>
              <option value="create-desc">Criação (mais recente)</option>
              <option value="create-asc">Criação (mais antiga)</option>
            </select>
          </div>
        )}

        {/* Export All Button */}
        {conversations.length > 0 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={onExportAll}
            >
              <Download size={16} />
              Exportar Todas
            </Button>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeTagsInExport}
                onChange={(e) => onIncludeTagsInExportChange(e.target.checked)}
                className="accent-primary h-3.5 w-3.5"
              />
              Incluir tags no export
            </label>
          </>
        )}
      </div>

      {/* Selection Toolbar */}
      {conversations.length > 0 && (
        <div className="px-4 py-2 border-b border-sidebar-border space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleSelectAll}
                className="accent-primary h-4 w-4"
              />
              Selecionar todas
            </label>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => setTagInputOpen((open) => !open)}
                >
                  <Tag size={14} />
                  Tag
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 size={14} />
                  Excluir ({selectedIds.size})
                </Button>
              </div>
            )}
          </div>
          {tagInputOpen && selectedIds.size > 0 && (
            <form onSubmit={handleBulkAddTag} className="flex items-center gap-1.5">
              <input
                ref={bulkTagInputRef}
                type="text"
                placeholder="Nome da tag"
                aria-label="Nome da tag para as conversas selecionadas"
                className="flex-1 min-w-0 text-xs bg-background border border-border rounded px-2 py-1 outline-none focus:border-ring"
              />
              <Button type="submit" variant="secondary" size="sm" className="h-7 text-xs">
                Aplicar
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Tag Filter Bar */}
      {allTags.length > 0 && (
        <div className="px-4 py-2 border-b border-sidebar-border">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                activeTag === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-sidebar-accent text-sidebar-foreground hover:bg-muted'
              }`}
            >
              Todas
            </button>
            {allTags.map(({ tag, count }) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  activeTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-sidebar-accent text-sidebar-foreground hover:bg-muted'
                }`}
              >
                #{tag} ({count})
              </button>
            ))}
            <button
              type="button"
              onClick={() => setManageTagsOpen((open) => !open)}
              aria-label="Gerenciar tags"
              aria-pressed={manageTagsOpen}
              className={`shrink-0 p-1.5 rounded transition-colors ${
                manageTagsOpen
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Settings2 size={14} />
            </button>
          </div>

          {manageTagsOpen && (
            <div className="mt-2 pt-2 border-t border-sidebar-border space-y-1.5">
              {allTags.map(({ tag, count }) => (
                <div key={tag} className="flex items-center gap-1.5 min-w-0">
                  {renamingTag === tag ? (
                    <form
                      onSubmit={handleRenameTag(tag)}
                      className="flex-1 flex items-center gap-1.5 min-w-0"
                    >
                      <input
                        ref={renameInputRef}
                        type="text"
                        defaultValue={tag}
                        aria-label={`Novo nome para a tag ${tag}`}
                        className="flex-1 min-w-0 text-xs bg-background border border-border rounded px-2 py-0.5 outline-none focus:border-ring"
                      />
                      <Button type="submit" size="sm" className="h-6 text-xs">
                        OK
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span className="flex-1 min-w-0 text-xs text-sidebar-foreground truncate">
                        #{tag} <span className="text-muted-foreground">({count})</span>
                      </span>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Renomear tag ${tag}`}
                        onClick={() => setRenamingTag(tag)}
                        className="h-6 w-6"
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        aria-label={`Excluir tag ${tag}`}
                        onClick={() => handleDeleteTag(tag)}
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X size={12} />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                className={`p-3 rounded-lg border-l-4 transition-all duration-150 ${
                  selectedId === conversation.id
                    ? 'bg-sidebar-accent border-l-primary shadow-sm'
                    : 'bg-sidebar border-l-transparent hover:bg-sidebar-accent'
                } ${
                  selectedIds.has(conversation.id)
                    ? 'ring-2 ring-destructive/40'
                    : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    aria-label={`Selecionar conversa ${conversation.title || 'sem título'}`}
                    checked={selectedIds.has(conversation.id)}
                    onChange={() => toggleSelect(conversation.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="accent-primary h-4 w-4 mt-1 shrink-0"
                  />

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    {/* Title */}
                    <h3 className="font-medium text-sm text-sidebar-foreground truncate mb-1">
                      {conversation.title || 'Sem título'}
                    </h3>

                    {/* Tags */}
                    {(conversation.tags ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {(conversation.tags ?? []).map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTag(activeTag === tag ? null : tag);
                            }}
                            className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                              activeTag === tag
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-primary/10 text-primary hover:bg-primary/20'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    )}

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
                          handleDeleteOne(conversation.id);
                        }}
                      >
                        <Trash2 size={14} />
                        Deletar
                      </Button>
                    </div>
                  </div>
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
