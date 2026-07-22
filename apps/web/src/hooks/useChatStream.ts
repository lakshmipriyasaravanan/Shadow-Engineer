import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useChatStream(repositoryId: string, conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const { token } = useAuth();

  const loadHistory = async (convId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/repositories/${repositoryId}/chat/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.map((m: any) => ({ id: m.id, role: m.role, content: m.content })));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const saveMessageToDb = async (convId: string | null, role: string, content: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/repositories/${repositoryId}/chat/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          conversationId: convId,
          title: content.substring(0, 30) + '...',
          role,
          content
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.id; // Returns conversation ID
      }
    } catch (e) {
      console.error("Failed to save message", e);
    }
    return convId;
  };

  const sendMessage = async (query: string, currentConvId: string | null) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    let assistantContent = "";
    const assistantMessageId = (Date.now() + 1).toString();

    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "" }]);

    try {
      // Direct call to FastAPI AI Service for high-performance streaming
      const response = await fetch('http://localhost:8000/api/v1/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repository_id: repositoryId,
          query,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.body) throw new Error("No body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages(prev => prev.map(m => 
                  m.id === assistantMessageId ? { ...m, content: assistantContent } : m
                ));
              }
            } catch (e) {}
          }
        }
      }

      // Save to Spring Boot DB after stream completes
      let activeConvId = currentConvId;
      activeConvId = await saveMessageToDb(activeConvId, 'user', query);
      await saveMessageToDb(activeConvId, 'assistant', assistantContent);

      setIsStreaming(false);
      return activeConvId;
    } catch (e) {
      console.error(e);
      setIsStreaming(false);
      return currentConvId;
    }
  };

  return { messages, isStreaming, sendMessage, loadHistory };
}
