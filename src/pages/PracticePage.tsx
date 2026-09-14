import React, { useState } from 'react';
import { chaptersData } from '../data/chaptersData';
import { generatePracticeProblemSet, AiPracticeItem } from '../services/groqService';
import { Sparkles, Loader2, AlertTriangle, ChevronDown, ChevronUp, BookOpen, RefreshCcw } from 'lucide-react';
import { englishToBanglaDigits } from '../utils/banglaUtils';

type Difficulty = 'সহজ' | 'মধ্যম' | 'কঠিন';

const TOPICS = [
  'কবিতার মূলভাব বিশ্লেষণ',
  'গদ্যের প্রশ্নোত্তর',
  'বিরাম চিহ্নের ব্যবহার',
  'বিপরীত শব্দ',
  'সমার্থক শব্দ',
  'এককথায় প্রকাশ',
  'সন্ধি বিচ্ছেদ',
  'বচন পরিবর্তন',
  'লিঙ্গ পরিবর্তন',
  'বাগধারার অর্থ',
  'চিঠি লেখার নিয়ম',
  'অনুচ্ছেদ রচনা',
];

export const PracticePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('সহজ');
  const [count, setCount] = useState(10);
  const [problems, setProblems] = useState<AiPracticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setProblems([]);
    setExpandedIdx(null);
    setShowAnswer({});
    try {
      const items = await generatePracticeProblemSet(selectedTopic, difficulty, count);
      setProblems(items);
    } catch (err: any) {
      setError(err?.message || 'অনুশীলন তৈরিতে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-8'>
      {/* Header */}
      <div className='bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500 rounded-3xl p-7 text-white shadow-xl'>
        <h1 className='text-2xl md:text-3xl font-black mb-2'>✨ এআই অনুশীলন ল্যাব</h1>
        <p className='text-indigo-100 text-sm leading-relaxed max-w-xl'>
          পঞ্চম শ্রেণির বাংলার যেকোনো বিষয়ে অনুশীলন করো। বিষয় বেছে নাও এবং কঠিনত্বের মাত্রা ঠিক করো।
        </p>
        <div className='mt-4 text-xs text-indigo-200'>{englishToBanglaDigits(chaptersData.length)} টি পাঠ থেকে AI প্রশ্ন তৈরি হয়</div>
      </div>

      {/* Controls */}
      <div className='bg-white rounded-2xl border border-slate-200 p-5'>
        <h2 className='font-black text-slate-800 mb-4'>প্র্যাকটিস সেটআপ</h2>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4'>
          <div>
            <label className='text-xs font-bold text-slate-600 mb-1 block'>বিষয় নির্বাচন করো</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className='w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white'
            >
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className='text-xs font-bold text-slate-600 mb-1 block'>কঠিনত্বের মাত্রা</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className='w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white'
            >
              <option value='সহজ'>সহজ</option>
              <option value='মধ্যম'>মধ্যম</option>
              <option value='কঠিন'>কঠিন</option>
            </select>
          </div>
          <div>
            <label className='text-xs font-bold text-slate-600 mb-1 block'>প্রশ্নের সংখ্যা</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className='w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white'
            >
              {[5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} টি</option>)}
            </select>
          </div>
        </div>
        <div className='flex gap-3'>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20'
          >
            {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> তৈরি হচ্ছে...</> : <><Sparkles className='w-4 h-4' /> অনুশীলন শুরু করো</>}
          </button>
          {problems.length > 0 && (
            <button
              onClick={() => { setProblems([]); setShowAnswer({}); }}
              className='flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all'
            >
              <RefreshCcw className='w-4 h-4' /> রিসেট
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm'>
          <AlertTriangle className='w-5 h-5 shrink-0' /> {error}
        </div>
      )}

      {/* Practice Problems */}
      {problems.length > 0 && (
        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <h2 className='font-black text-slate-800'>অনুশীলন প্রশ্ন: {selectedTopic}</h2>
            <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700'>{difficulty}</span>
          </div>
          {problems.map((prob, idx) => (
            <div key={idx} className='bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all overflow-hidden'>
              <div
                className='p-4 cursor-pointer hover:bg-slate-50 flex items-start gap-3 justify-between'
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              >
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-1'>
                    <div className='w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0'>
                      {englishToBanglaDigits(idx + 1)}
                    </div>
                    <span className='text-[11px] font-bold text-indigo-600'>AI প্রশ্ন</span>
                  </div>
                  <p className='text-sm md:text-base font-semibold text-slate-800 leading-relaxed'>{prob.question}</p>
                </div>
                {expandedIdx === idx ? <ChevronUp className='w-5 h-5 text-slate-400 shrink-0' /> : <ChevronDown className='w-5 h-5 text-slate-400 shrink-0' />}
              </div>

              {expandedIdx === idx && (
                <div className='border-t border-slate-100 p-4 bg-slate-50 space-y-3'>
                  <div className='p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 italic'>
                    💡 সংকেত: {prob.hint}
                  </div>
                  <div className='p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800'>
                    <span className='font-bold'>ব্যাখ্যা: </span>{prob.explanation}
                  </div>
                  <button
                    onClick={() => setShowAnswer(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    className='text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors'
                  >
                    {showAnswer[idx] ? '✕ উত্তর লুকাও' : '✓ চূড়ান্ত উত্তর দেখো'}
                  </button>
                  {showAnswer[idx] && (
                    <div className='p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-800'>
                      {prob.answer}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {problems.length === 0 && !loading && (
        <div className='text-center py-16'>
          <BookOpen className='w-16 h-16 mx-auto text-slate-300 mb-4' />
          <p className='text-slate-500'>বিষয় বেছে নিয়ে অনুশীলন শুরু করো!</p>
          <p className='text-xs text-slate-400 mt-1'>এআই প্রতিবার নতুন প্রশ্ন তৈরি করবে।</p>
        </div>
      )}
    </div>
  );
};
