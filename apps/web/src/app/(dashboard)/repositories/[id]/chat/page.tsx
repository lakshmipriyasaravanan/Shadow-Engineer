"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { useChatStream } from '@/hooks/useChatStream';
import { Send, Bot, User, Code2 } from 'lucide-react';

export default function RepositoryChatPage() {
  const params = useParams();
  const repoId = params.id as string;
  const [query, setQuery] = useState('');
  const [convId, setConvId] = useState<string | null>(null);
  
  const { messages, isStreaming, sendMessage } = useChatStream(repoId, convId);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isStreaming) return;
    
    const currentQuery = query;
    setQuery('');
    const newConvId = await sendMessage(currentQuery, convId);
    if (newConvId && !convId) {
      setConvId(newConvId);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="text-blue-500" />
          <h2 className="font-semibold text-gray-800 dark:text-white">Developer Copilot</h2>
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-mono">
          RAG Active
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <Bot size={48} className="text-gray-300 dark:text-gray-600" />
            <p>Ask anything about this repository.</p>
            <div className="flex gap-2 flex-wrap justify-center max-w-lg mt-4">
              <button onClick={() => setQuery("Explain the architecture of this project")} className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Explain Architecture</button>
              <button onClick={() => setQuery("Where is the database configuration located?")} className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Find Database Config</button>
              <button onClick={() => setQuery("Generate a summary of the authentication flow")} className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Summarize Auth Flow</button>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-purple-600 dark:text-purple-300" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {isStreaming && idx === messages.length - 1 && (
                      <span className="inline-block w-2 h-4 ml-1 bg-purple-500 animate-pulse"></span>
                    )}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-blue-600 dark:text-blue-300" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isStreaming}
            placeholder={isStreaming ? "AI is typing..." : "Ask Copilot a question..."}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={isStreaming || !query.trim()}
            className="absolute right-2 top-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
