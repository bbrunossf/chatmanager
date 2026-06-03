import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import type { ConversationData, Message } from '@/hooks/useConversationManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Bot } from 'lucide-react';

interface ConversationViewerProps {
  conversation: ConversationData | null;
}

function formatTime(timestamp: number): string {
  return format(new Date(timestamp * 1000), 'dd MMM yyyy HH:mm', {
    locale: ptBR,
  });
}

function getAuthorInfo(message: Message) {
  const role = message.author?.role || 'unknown';
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  return {
    isUser,
    isAssistant,
    label: isAssistant ? 'ChatGPT' : isUser ? 'Você' : 'Sistema',
    icon: isAssistant ? Bot : MessageCircle,
  };
}

function getMessageText(message: Message): string {
  const content = message.content;
  if (!content?.parts) return 'Mensagem vazia';

  // Conteúdo de texto simples
  if (content.content_type === 'text') {
    return content.parts[0] || 'Mensagem vazia';
  }

  // Conteúdo multimodal (ex: áudio com transcrição)
  if (content.content_type === 'multimodal_text') {
    const transcriptionPart = content.parts.find(
      (part: unknown) =>
        typeof part === 'object' &&
        part !== null &&
        (part as Record<string, unknown>).content_type === 'audio_transcription' &&
        typeof (part as Record<string, unknown>).text === 'string'
    ) as { text: string } | undefined;

    if (transcriptionPart) {
      return transcriptionPart.text;
    }

    // Fallback: procura qualquer part que tenha a chave "text"
    const anyTextPart = content.parts.find(
      (part: unknown) =>
        typeof part === 'object' &&
        part !== null &&
        typeof (part as Record<string, unknown>).text === 'string'
    ) as { text: string } | undefined;

    if (anyTextPart) {
      return anyTextPart.text;
    }
  }

  return 'Mensagem vazia';
}


export default function ConversationViewer({ conversation }: ConversationViewerProps) {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-lg font-medium text-foreground mb-2">Nenhuma conversa selecionada</p>
          <p className="text-sm text-muted-foreground">
            Carregue um arquivo JSON ou selecione uma conversa na barra lateral
          </p>
        </div>
      </div>
    );
  }

  const messages = conversation.messages || [];

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-6 bg-card">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {conversation.title || 'Sem título'}
        </h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>
            Criada: {format(new Date(conversation.create_time * 1000), 'dd MMM yyyy HH:mm', { locale: ptBR })}
          </span>
          <span>
            Atualizada: {format(new Date(conversation.update_time * 1000), 'dd MMM yyyy HH:mm', { locale: ptBR })}
          </span>
          <span>{messages.length} mensagens</span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma mensagem nesta conversa</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const author = getAuthorInfo(message);
              const Icon = author.icon;

              return (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      author.isAssistant
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary/10 text-secondary-foreground'
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">
                        {author.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.create_time)}
                      </span>
                    </div>

                    <Card className="bg-card border border-border p-4">
                      <div className="text-sm text-card-foreground whitespace-pre-wrap break-words">
                        {getMessageText(message)}
                      </div>
                    </Card>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
