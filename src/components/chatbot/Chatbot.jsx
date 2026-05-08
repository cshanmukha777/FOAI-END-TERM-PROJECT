import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { generateChatResponse } from '../../services/chatService';
import { safeGetStorage, safeSetStorage } from '../../utils/storage';

export const Chatbot = ({ dashboardContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => safeGetStorage('chat_history', [
    { role: 'assistant', content: 'Hello! I am your AI assistant. I can answer questions about the ISS and news data currently visible on your dashboard.' }
  ]));
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg].slice(-30);
    setMessages(newMessages);
    safeSetStorage('chat_history', newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Build context string from dashboard context prop
      const contextStr = `
ISS Data:
- Location: Lat ${dashboardContext?.position?.lat}, Lng ${dashboardContext?.position?.lng}
- Nearest Place: ${dashboardContext?.place}
- Speed: ${dashboardContext?.speed} km/h
- People in Space: ${dashboardContext?.astronauts?.count}
- Astronauts: ${dashboardContext?.astronauts?.people?.map(p => p.name).join(', ')}

News Articles Available:
${Object.entries(dashboardContext?.articles || {}).map(([cat, arts]) => 
  `[${cat}] ${arts.map(a => a.title).join(' | ')}`
).join('\\n')}
      `.trim();

      const response = await generateChatResponse(newMessages, contextStr);
      
      const assistantMsg = { role: 'assistant', content: response };
      const finalMessages = [...newMessages, assistantMsg].slice(-30);
      setMessages(finalMessages);
      safeSetStorage('chat_history', finalMessages);
    } catch (error) {
      const errorMsg = { role: 'assistant', content: "Sorry, I am having trouble connecting to my neural network. Please check your Hugging Face API key configuration." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    const initMsg = [{ role: 'assistant', content: 'Chat history cleared. How can I help you with the dashboard data?' }];
    setMessages(initMsg);
    safeSetStorage('chat_history', initMsg);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105 z-50 cursor-pointer ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-full sm:w-[380px] h-[550px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-4 bg-blue-600 rounded-t-2xl flex items-center justify-between text-white shadow-md">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold">Dashboard AI</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearChat} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer" title="Clear Chat">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer" title="Close Chat">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex flex-shrink-0 items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800/50">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex flex-shrink-0 items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm border border-slate-300 dark:border-slate-600">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Bot className="w-4 h-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-sm flex items-center gap-1 shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the dashboard..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-inner"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
