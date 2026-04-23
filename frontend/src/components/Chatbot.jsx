import { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

const getReply = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes('rank')) return "Your current rank is #12 in your class! Keep going! 🚀";
  if (m.includes('task') || m.includes('karna')) return "Try the 'Plant a Tree' task today — it gives 100 XP! 🌱";
  if (m.includes('quiz')) return "Check the Learn section for available quizzes! 📚";
  if (m.includes('streak')) return "Don't break your streak! Submit a task today 🔥";
  if (m.includes('xp') || m.includes('point')) return "Complete civic tasks and quizzes to earn more XP! ⭐";
  return "I'm EcoBot! Ask me about your rank, tasks, quizzes, or streak 🌿";
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm EcoBot 🌿 How can I help you today?" },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    const botMsg = { from: 'bot', text: getReply(input) };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-72 bg-[#1c1c1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl fade-in-up">
          <div className="bg-white/8 px-4 py-3 flex items-center gap-2 border-b border-white/8">
            <Bot size={18} className="text-white/70" />
            <div className="flex-1">
              <p className="text-sm font-semibold">EcoBot</p>
              <p className="text-[10px] text-white/40">Assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white transition">
              <X size={15} />
            </button>
          </div>

          <div className="h-52 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${
                  m.from === 'user' ? 'bg-white text-black' : 'bg-white/8 text-white/80'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/8 flex gap-2">
            <input
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-white/30 transition"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button onClick={send} className="bg-eco-600 hover:bg-eco-500 text-white rounded-lg p-2 transition">
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-white/90 hover:scale-105 transition-all"
      >
        {open ? <X size={18} className="text-black" /> : <Bot size={18} className="text-black" />}
      </button>
    </div>
  );
}
