import React, { useState } from 'react';

interface ComprehensionHelperProps {
  passage: string;
  questions: { q: string; a: string }[];
  title: string;
}

const defaultPassage = `এখানে পাঠের একটি অনুচ্ছেদ প্রদর্শিত হবে।
শিক্ষার্থীরা অনুচ্ছেদটি মনোযোগ দিয়ে পড়বে
এবং নিচের প্রশ্নগুলোর উত্তর দেবে।`;

const defaultQuestions = [
  { q: 'অনুচ্ছেদের মূলভাব কী?', a: 'এখানে মূলভাবের উত্তর থাকবে।' },
  { q: 'লেখক কী বলতে চেয়েছেন?', a: 'লেখকের মূল বক্তব্য এখানে থাকবে।' },
];

export const ComprehensionHelper: React.FC<ComprehensionHelperProps> = ({
  passage = defaultPassage,
  questions = defaultQuestions,
  title,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  const handleWordClick = (word: string) => {
    const cleaned = word.replace(/[।,?!৷]/g, '');
    setHighlightedWord(prev => prev === cleaned ? null : cleaned);
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-200 overflow-hidden'>
      {/* Header */}
      <div className='bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-4 text-white'>
        <h3 className='font-black text-lg'>💬 অনুচ্ছেদ বিশ্লেষণ: {title}</h3>
        <p className='text-xs text-indigo-100 mt-0.5'>শব্দে ক্লিক করলে তা হাইলাইট হবে — অর্থ মনে করতে সাহায্য করবে।</p>
      </div>

      {/* Passage */}
      <div className='p-5'>
        <div className='p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl text-sm md:text-base leading-8 text-slate-800'>
          {passage.split(/\s+/).map((word, i) => {
            const cleaned = word.replace(/[।,?!৷]/g, '');
            return (
              <span
                key={i}
                onClick={() => handleWordClick(word)}
                className={`cursor-pointer rounded px-1 transition-colors select-none ${highlightedWord === cleaned ? 'bg-indigo-200 text-indigo-900 font-bold' : 'hover:bg-indigo-100'}`}
              >
                {word}{' '}
              </span>
            );
          })}
        </div>
        {highlightedWord && (
          <div className='mt-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900'>
            📌 নির্বাচিত শব্দ: <strong>{highlightedWord}</strong> — অভিধানে এর অর্থ খোঁজো।
          </div>
        )}
      </div>

      {/* Questions */}
      <div className='px-5 pb-5 space-y-4'>
        <h4 className='font-black text-slate-700 text-sm'>অনুচ্ছেদ ভিত্তিক প্রশ্নোত্তর:</h4>
        {questions.map((item, idx) => (
          <div key={idx} className='border border-slate-200 rounded-xl overflow-hidden'>
            <div className='p-3 bg-slate-50'>
              <p className='text-sm font-semibold text-slate-800'>{idx + 1}. {item.q}</p>
              <textarea
                rows={2}
                placeholder='তোমার উত্তর লেখো...'
                value={userAnswers[idx] || ''}
                onChange={(e) => setUserAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                className='w-full mt-2 px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-white'
              />
            </div>
            <div className='px-3 py-2 border-t border-slate-100 flex items-center justify-between'>
              <button
                onClick={() => setRevealed(prev => ({ ...prev, [idx]: !prev[idx] }))}
                className='text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors'
              >
                {revealed[idx] ? '✕ উত্তর লুকাও' : '✓ সঠিক উত্তর দেখো'}
              </button>
            </div>
            {revealed[idx] && (
              <div className='px-3 pb-3'>
                <p className='text-sm text-emerald-700 font-medium border-l-4 border-emerald-400 pl-3'>{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
