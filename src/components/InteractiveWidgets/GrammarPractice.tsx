import React, { useState } from 'react';

interface GrammarItem {
  question: string;
  answer: string;
  type: 'fill' | 'match' | 'choice';
  options?: string[];
  correctIndex?: number;
}

interface GrammarPracticeProps {
  chapterTitle: string;
  items?: GrammarItem[];
}

const defaultItems: GrammarItem[] = [
  { type: 'fill', question: "'রাজা' শব্দের স্ত্রীলিঙ্গ হলো ________।", answer: 'রানি' },
  { type: 'fill', question: "'ছেলেরা' শব্দটি কোন বচন?", answer: 'বহুবচন' },
  { type: 'choice', question: "'বিদ্যালয়' শব্দের সন্ধি বিচ্ছেদ কোনটি?", options: ['বিদ্যা + লয়', 'বিদ্যা + আলয়', 'বিদ্ + আলয়'], answer: 'বিদ্যা + আলয়', correctIndex: 1 },
  { type: 'fill', question: "'সুন্দর' শব্দের বিপরীত শব্দ ________।", answer: 'কুৎসিত' },
  { type: 'fill', question: "বাক্যের শেষে কোন বিরাম চিহ্ন বসে? ________", answer: 'দাঁড়ি (।)' },
];

export const GrammarPractice: React.FC<GrammarPracticeProps> = ({
  chapterTitle,
  items = defaultItems,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (idx: number, val: string) => {
    setAnswers(prev => ({ ...prev, [idx]: val }));
    setSubmitted(false);
  };

  const handleSubmit = () => setSubmitted(true);
  const handleReset = () => { setAnswers({}); setSubmitted(false); };

  const score = submitted ? items.filter((item, i) => (answers[i] || '').trim().toLowerCase() === item.answer.toLowerCase()).length : 0;

  return (
    <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden'>
      <div className='bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-4 text-white'>
        <h3 className='font-black text-lg'>📐 ব্যাকরণ অনুশীলন: {chapterTitle}</h3>
        <p className='text-xs text-indigo-100 mt-0.5'>শূন্যস্থান পূরণ করো এবং সঠিক উত্তর বেছে নাও।</p>
      </div>

      <div className='p-5 space-y-5'>
        {items.map((item, idx) => {
          const isCorrect = submitted && (answers[idx] || '').trim().toLowerCase() === item.answer.toLowerCase();
          const isWrong = submitted && !isCorrect;
          return (
            <div key={idx} className={`p-4 rounded-xl border-2 transition-all ${submitted ? (isCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50') : 'border-slate-200 bg-slate-50'}`}>
              <p className='text-sm font-semibold text-slate-800 mb-2'>{idx + 1}. {item.question}</p>
              {item.type === 'choice' && item.options ? (
                <div className='flex flex-wrap gap-2'>
                  {item.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleChange(idx, opt)}
                      disabled={submitted}
                      className={`px-3 py-1.5 text-sm rounded-lg border font-medium transition-all ${answers[idx] === opt ? (submitted ? (oi === item.correctIndex ? 'border-emerald-500 bg-emerald-100 text-emerald-800' : 'border-red-400 bg-red-100 text-red-700') : 'border-indigo-500 bg-indigo-100 text-indigo-800 font-bold') : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-400'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type='text'
                  placeholder='উত্তর লেখো...'
                  value={answers[idx] || ''}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  disabled={submitted}
                  className={`w-full px-3 py-1.5 text-sm rounded-lg border outline-none focus:ring-2 ${submitted ? (isCorrect ? 'border-emerald-400 bg-emerald-50 focus:ring-emerald-500' : 'border-red-400 bg-red-50 focus:ring-red-400') : 'border-slate-300 bg-white focus:ring-indigo-500 focus:border-indigo-500'}`}
                />
              )}
              {isWrong && <p className='text-xs text-emerald-700 mt-1.5 font-medium'>✅ সঠিক উত্তর: {item.answer}</p>}
            </div>
          );
        })}
      </div>

      <div className='px-5 pb-5 flex items-center gap-3'>
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className='px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20'
        >
          উত্তর জমা দাও
        </button>
        <button
          onClick={handleReset}
          className='px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all'
        >
          আবার চেষ্টা করো
        </button>
        {submitted && (
          <span className='text-sm font-bold text-slate-700 ml-auto'>
            স্কোর: {score}/{items.length} {score === items.length ? '🎉 পারফেক্ট!' : '💪 ভালো চেষ্টা!'}
          </span>
        )}
      </div>
    </div>
  );
};
