import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, RotateCcw } from 'lucide-react';
import { ChatMessage, askBanglaTutor } from '../services/groqService';
import { BanglaBuddyAvatar } from './BanglaBuddyAvatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapterTitle?: string;
}

const QUICK_QUESTIONS = [
  'কবিতার মূলভাব কীভাবে বুঝব?',
  'বিপরীত শব্দ ও সমার্থক শব্দের পার্থক্য কী?',
  'সন্ধি বিচ্ছেদ কীভাবে করতে হয়?',
  'চিঠি লেখার নিয়ম কী?',
  'এককথায় প্রকাশ মনে রাখার কৌশল কী?',
  'বচন ও লিঙ্গ পরিবর্তনের নিয়ম বলো।',
];

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  currentChapterTitle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([{
        role: 'assistant',
        content: `স্বাগতম বন্ধু! 📚 আমি তোমার **বাংলা বন্ধু** — পঞ্চম শ্রেণির বাংলার জন্য তোমার AI সহকারী।\n\nকবিতার মূলভাব, গদ্যের প্রশ্নোত্তর, ব্যাকরণের নিয়ম — যেকোনো বিষয়ে আমাকে জিজ্ঞেস করো! ${currentChapterTitle ? `\n\nতুমি এখন **"${currentChapterTitle}"** পাঠ পড়ছ। এই পাঠ নিয়ে কোনো প্রশ্ন আছে?` : ''}`
      }]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, currentChapterTitle]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string = input) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: msg };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);
    try {
      const response = await askBanglaTutor(history, currentChapterTitle);
      setMessages([...history, { role: 'assistant', content: response }]);
    } catch (err: any) {
      setError(err?.message || 'এআই সংযোগে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4' onClick={onClose}>
      <div className='absolute inset-0 bg-black/40 backdrop-blur-sm' />
      <div
        className='relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col'
        style={{ height: 'min(85vh, 680px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center gap-3 p-4 border-b border-slate-100 bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 rounded-t-3xl text-white shadow-md'>
          <BanglaBuddyAvatar size={42} mood='happy' animated={loading} />
          <div className='flex-1'>
            <div className='font-black text-base'>বাংলা বন্ধু</div>
            <div className='text-xs text-indigo-100 flex items-center gap-1'>
              <span className={'w-2 h-2 rounded-full ' + (loading ? 'bg-pink-300 animate-pulse' : 'bg-emerald-300')} />
              {loading ? 'ভাবছে...' : 'অনলাইনে আছে'}
            </div>
          </div>
          <button
            onClick={() => { setMessages([]); }}
            className='p-2 rounded-xl hover:bg-white/20 transition-colors'
            title='কথোপকথন মুছে ফেলো'
          >
            <RotateCcw className='w-4 h-4' />
          </button>
          <button onClick={onClose} className='p-2 rounded-xl hover:bg-white/20 transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.role === 'assistant' && (
                <BanglaBuddyAvatar size={32} mood={loading && idx === messages.length - 1 ? 'thinking' : 'happy'} className='shrink-0' />
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white ml-auto shadow-sm' : 'bg-slate-100 text-slate-800'}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ children }) => <strong className='font-bold text-indigo-700'>{children}</strong>,
                      p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
                      ul: ({ children }) => <ul className='list-disc pl-4 mb-2'>{children}</ul>,
                      li: ({ children }) => <li className='mb-1'>{children}</li>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className='flex gap-3'>
              <BanglaBuddyAvatar size={32} mood='thinking' animated />
              <div className='bg-slate-100 rounded-2xl px-4 py-3 flex items-center gap-2 text-slate-500'>
                <Loader2 className='w-4 h-4 animate-spin' />
                <span className='text-sm'>লিখছে...</span>
              </div>
            </div>
          )}

          {error && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700'>
              ত্রুটি: {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick questions */}
        {messages.length <= 1 && (
          <div className='px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide'>
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className='shrink-0 text-xs px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-full transition-all font-medium whitespace-nowrap'
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className='p-4 pt-2 border-t border-slate-100'>
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className='flex gap-2'>
            <input
              ref={inputRef}
              type='text'
              placeholder='কবিতা, গদ্য বা ব্যাকরণ নিয়ে প্রশ্ন করো...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className='flex-1 px-4 py-2.5 rounded-2xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm'
            />
            <button
              type='submit'
              disabled={loading || !input.trim()}
              className='p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl transition-all shadow-sm'
            >
              <Send className='w-5 h-5' />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
