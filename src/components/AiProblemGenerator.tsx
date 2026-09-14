import React, { useState } from 'react';
import { Chapter } from '../types/bangla';
import { generateBanglaExercise, GeneratedExercise } from '../services/groqService';
import { Sparkles, Loader2, AlertTriangle, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface AiProblemGeneratorProps {
  chapter: Chapter;
}

const CATEGORIES = ['সৃজনশীল প্রশ্ন', 'সংক্ষিপ্ত প্রশ্ন', 'রচনামূলক প্রশ্ন', 'শূন্যস্থান পূরণ', 'সত্য/মিথ্যা', 'ব্যাকরণ প্রশ্ন'];

export const AiProblemGenerator: React.FC<AiProblemGeneratorProps> = ({ chapter }) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [exercises, setExercises] = useState<GeneratedExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const ex = await generateBanglaExercise(chapter.title, chapter.summary, category);
      setExercises(prev => [ex, ...prev]);
      setExpandedIdx(0);
    } catch (err: any) {
      setError(err?.message || 'প্রশ্ন তৈরিতে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Controls */}
      <div className='bg-gradient-to-br from-indigo-50/80 to-violet-50/80 border border-indigo-100 rounded-2xl p-5'>
        <h3 className='font-black text-indigo-900 mb-4 flex items-center gap-2 text-base'>
          <Sparkles className='w-5 h-5 text-indigo-600' /> এআই দিয়ে নতুন প্রশ্ন তৈরি করো
        </h3>
        <div className='flex flex-wrap gap-3 items-end'>
          <div className='flex-1 min-w-[180px]'>
            <label className='text-xs font-bold text-slate-600 mb-1 block'>প্রশ্নের ধরন</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='w-full px-3 py-2 text-sm rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white'
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className='px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20'
          >
            {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> তৈরি হচ্ছে...</> : <><Sparkles className='w-4 h-4' /> নতুন প্রশ্ন তৈরি করো</>}
          </button>
          {exercises.length > 0 && (
            <button
              onClick={() => setExercises([])}
              className='px-3 py-2.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5'
            >
              <RefreshCcw className='w-3.5 h-3.5' /> সব মুছো
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm'>
          <AlertTriangle className='w-5 h-5 shrink-0' /> {error}
        </div>
      )}

      {exercises.length === 0 && !loading && (
        <div className='text-center py-12 text-slate-400'>
          <Sparkles className='w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-400' />
          <p className='text-sm'>বাংলা বন্ধু তোমার জন্য নতুন প্রশ্ন তৈরি করতে প্রস্তুত!</p>
          <p className='text-xs mt-1'>প্রশ্নের ধরন বেছে নিয়ে উপরের বাটনে ক্লিক করো।</p>
        </div>
      )}

      {/* Generated exercises */}
      <div className='space-y-4'>
        {exercises.map((ex, idx) => (
          <div key={idx} className='bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
            <div className='flex items-start justify-between gap-3 p-4 cursor-pointer hover:bg-slate-50'
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}>
              <div className='flex-1'>
                <span className='text-[11px] text-indigo-600 font-bold uppercase tracking-wider'>AI তৈরি প্রশ্ন #{exercises.length - idx}</span>
                <p className='text-sm md:text-base font-semibold text-slate-800 mt-1 leading-relaxed'>{ex.question}</p>
              </div>
              {expandedIdx === idx ? <ChevronUp className='w-5 h-5 text-slate-400 shrink-0' /> : <ChevronDown className='w-5 h-5 text-slate-400 shrink-0' />}
            </div>

            {expandedIdx === idx && (
              <div className='border-t border-slate-100 p-4 space-y-3 bg-slate-50'>
                <div className='p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs md:text-sm text-indigo-900 italic'>
                  💡 সংকেত: {ex.hint}
                </div>
                <div className='space-y-2'>
                  {ex.steps.map((step) => (
                    <div key={step.stepNumber} className='flex gap-3 items-start p-3 bg-white rounded-xl border border-slate-100'>
                      <div className='w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0'>
                        {step.stepNumber}
                      </div>
                      <p className='text-sm text-slate-700 leading-relaxed'>{step.explanation}</p>
                    </div>
                  ))}
                </div>
                <div className='p-4 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl'>
                  <p className='text-xs font-bold text-indigo-600 mb-1'>✅ চূড়ান্ত উত্তর</p>
                  <p className='text-sm md:text-base font-bold text-slate-800'>{ex.finalAnswer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
