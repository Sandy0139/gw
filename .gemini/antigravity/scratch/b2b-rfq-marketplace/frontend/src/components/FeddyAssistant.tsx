import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
  Phone,
} from 'lucide-react';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const FeddyAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Hello! 👋 I am Indic, your Quotio B2B Procurement Assistant. How can I help with your industrial sourcing today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    'How do I post an RFQ?',
    'What is Trade Escrow?',
    'How to compare supplier quotes?',
    'How to switch demo accounts?',
  ];

  const handleSend = (textToSend?: string) => {
    const msgText = textToSend || inputMsg;
    if (!msgText.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = { sender: 'user', text: msgText, time: userTime };
    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMsg('');

    // Generate automated bot response based on query
    setTimeout(() => {
      let botAnswer = "I'm glad you asked! Quotio B2B provides verified industrial requirement matching with 100% Escrow trade assurance.";
      const query = msgText.toLowerCase();

      if (query.includes('post') || query.includes('rfq')) {
        botAnswer = 'To post an RFQ requirement as a Buyer, click "+ Post Requirement" in the navbar, enter product name, quantity, delivery location, and deadline. Our Zod validator will verify your specs!';
      } else if (query.includes('escrow') || query.includes('trade')) {
        botAnswer = 'Quotio B2B Escrow holds funds securely until goods are inspected and delivered. Buyer funds are protected 100% with bank-grade encryption!';
      } else if (query.includes('compare') || query.includes('quotes')) {
        botAnswer = 'Our automated Side-by-Side Offer Matrix evaluates bids and awards Lowest Price 🟢, Fastest Shipping 🔵, and Best Value 🟡 to help buyers decide in 1 click.';
      } else if (query.includes('switch') || query.includes('demo')) {
        botAnswer = 'Use the ⚡ Demo Switcher in the top header or the floating bottom-left panel to switch between Rajesh Sharma (Buyer) and Vikram Malhotra (Supplier) instantly!';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botAnswer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none">
      {/* Floating Indic AI Assistant Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-2xl border-2 border-amber-400 flex items-center space-x-2 transition hover:scale-105 group"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <span className="font-extrabold text-xs tracking-wider pr-1">Indic AI Assistant</span>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[500px] animate-fade-in">
          {/* Header */}
          <div className="bg-[#0f172a] text-white p-4 flex items-center justify-between border-b border-amber-400/30">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center space-x-1">
                  <span>Indic Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                  ● Online | Quotio Sourcing Guide
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-300 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl space-y-1 shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed font-medium">{m.text}</p>
                  <span
                    className={`text-[9px] block text-right font-semibold ${
                      m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex overflow-x-auto space-x-1.5 scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 text-[10px] font-bold flex-shrink-0 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask Indic Assistant about RFQs or trade..."
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f172a]"
            />
            <button
              type="submit"
              className="p-2 bg-[#0f172a] hover:bg-slate-800 text-amber-400 rounded-xl transition font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
