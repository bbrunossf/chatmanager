import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import type { ConversationData, Message } from '@/hooks/useConversationManager';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageCircle, Bot, X, Tag, Copy } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.css';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import graphql from 'highlight.js/lib/languages/graphql';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

// Registra as linguagens suportadas (imports seletivos mantêm o bundle enxuto)
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('go', go);
hljs.registerLanguage('graphql', graphql);
hljs.registerLanguage('ini', ini);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('kotlin', kotlin);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('php', php);
hljs.registerLanguage('powershell', powershell);
hljs.registerLanguage('python', python);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('yaml', yaml);

// Sem regras → apenas escapa o HTML, sem colorir
hljs.registerLanguage('plaintext', () => ({ name: 'Plain text', contains: [] }));

// Identificadores comuns que não são nomes diretos de linguagem no highlight.js
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'xml',
  htm: 'xml',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  py: 'python',
  rb: 'ruby',
  md: 'markdown',
  cs: 'csharp',
  'c#': 'csharp',
  'c++': 'cpp',
  rs: 'rust',
  jsonc: 'json',
  txt: 'plaintext',
  text: 'plaintext',
  console: 'plaintext',
};

function highlightCode(code: string, language: string): string {
  const lang = LANGUAGE_ALIASES[language] ?? language;
  const resolved = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  try {
    return hljs.highlight(code, { language: resolved }).value;
  } catch {
    return hljs.highlight(code, { language: 'plaintext' }).value;
  }
}

interface ConversationViewerProps {
  conversation: ConversationData | null;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
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

type MessageSegment =
  | { type: 'text'; content: string }
  | { type: 'code'; language: string; code: string };

// Divide o texto em trechos de texto comum e blocos de código delimitados por ```
function parseSegments(text: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  const regex = /```([a-zA-Z0-9_+\-.]*)[ \t]*\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Texto comum antes do bloco de código
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }

    segments.push({
      type: 'code',
      language: match[1] || '',
      code: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const highlighted = highlightCode(code, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('Código copiado');
    } catch {
      toast.error('Não foi possível copiar o código');
    }
  };

  return (
    <div className="rounded-md border border-border overflow-hidden my-2">
      <div className="flex items-center justify-between bg-muted px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          {language || 'texto'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copiar código"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Copy size={12} />
          Copiar
        </button>
      </div>
      <pre className="overflow-x-auto">
        <code
          className="hljs font-mono text-[13px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}


export default function ConversationViewer({ conversation, onAddTag, onRemoveTag }: ConversationViewerProps) {
  const tagInputRef = useRef<HTMLInputElement>(null);

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
  const tags = conversation.tags ?? [];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const input = tagInputRef.current;
    if (!input) return;
    const tag = input.value.trim();
    if (tag) {
      onAddTag(conversation.id, tag);
    }
    input.value = '';
  };

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

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded"
            >
              <Tag size={12} />
              {tag}
              <button
                type="button"
                aria-label={`Remover tag ${tag}`}
                onClick={() => onRemoveTag(conversation.id, tag)}
                className="text-primary/60 hover:text-destructive transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <form onSubmit={handleAddTag} className="inline-flex">
            <input
              ref={tagInputRef}
              type="text"
              placeholder={tags.length === 0 ? 'Adicionar tag...' : 'Nova tag...'}
              aria-label="Adicionar tag"
              className="w-32 text-xs bg-background border border-border rounded px-2 py-1 outline-none focus:border-ring"
            />
          </form>
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
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
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
                      <div className="text-sm text-card-foreground whitespace-pre-wrap wrap-break-word">
                        {parseSegments(getMessageText(message)).map((segment, index) =>
                          segment.type === 'code' ? (
                            <CodeBlock
                              key={index}
                              language={segment.language}
                              code={segment.code}
                            />
                          ) : (
                            <span key={index}>{segment.content}</span>
                          )
                        )}
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
