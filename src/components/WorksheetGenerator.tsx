import React, { useState } from 'react';
import { Chapter } from '../types/bangla';
import { generateAiWorksheet, AiWorksheetItem } from '../services/groqService';
import { Printer, Loader2, AlertTriangle, Sparkles, RefreshCcw } from 'lucide-react';

interface WorksheetGeneratorProps {
  chapter: Chapter;
}

type Difficulty = 'সহজ' | 'মধ্যম' | 'কঠিন';

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ chapter }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('সহজ');
  const [count, setCount] = useState(8);
  const [worksheet, setWorksheet] = useState<AiWorksheetItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setWorksheet(null);
    try {
      const items = await generateAiWorksheet(chapter.title, chapter.summary, difficulty, count);
      setWorksheet(items);
      setShowAnswers(false);
    } catch (err: any) {
      setError(err?.message || 'ওয়ার্কশিট তৈরিতে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='space-y-6'>
      {/* Controls */}
      <div className='bg-gradient-to-br from-indigo-50/80 to-violet-50/80 border border-indigo-100 rounded-2xl p-5'>
        <h3 className='font-black text-indigo-900 mb-4 flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-indigo-600' />
          এআই ওয়ার্কশিট জেনারেটর — {chapter.title}
        </h3>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div>
            <label className='text-xs font-bold text-slate-600 mb-1 block'>কঠিনত্বের মাত্রা</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className='w-full px-3 py-2 text-sm rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white'
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
              className='w-full px-3 py-2 text-sm rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white'
            >
              {[5, 8, 10, 12, 15].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className='flex items-end'>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all text-sm shadow-md shadow-indigo-600/20'
            >
              {loading ? <><Loader2 className='w-4 h-4 animate-spin' /> তৈরি হচ্ছে...</> : <><Sparkles className='w-4 h-4' /> ওয়ার্কশিট তৈরি করো</>}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm'>
          <AlertTriangle className='w-5 h-5 shrink-0' /> {error}
        </div>
      )}

      {worksheet && (
        <div>
          {/* Print header */}
          <div className='flex items-center justify-between mb-4 no-print'>
            <div className='flex gap-2'>
              <button
                onClick={() => setShowAnswers(!showAnswers)}
                className='px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition-all'
              >
                {showAnswers ? 'উত্তর লুকাও' : 'উত্তর দেখাও'}
              </button>
              <button
                onClick={handleGenerate}
                className='px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5'
              >
                <RefreshCcw className='w-3.5 h-3.5' /> নতুন তৈরি করো
              </button>
            </div>
            <button
              onClick={handlePrint}
              className='flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all'
            >
              <Printer className='w-4 h-4' /> প্রিন্ট করো
            </button>
          </div>

          {/* Worksheet content */}
          <div className='bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-1'>
            {/* Header */}
            <div className='text-center border-b-2 border-slate-200 pb-4 mb-5'>
              <h2 className='text-xl font-black text-slate-800'>পঞ্চম শ্রেণি — বাংলা ওয়ার্কশিট</h2>
              <p className='text-base font-bold text-indigo-700 mt-1'>{chapter.title}</p>
              <div className='flex justify-between mt-3 text-xs text-slate-500 font-medium'>
                <span>নাম: ____________________________</span>
                <span>তারিখ: _______________</span>
                <span>শ্রেণি: পঞ্চম</span>
              </div>
            </div>

            <ol className='space-y-5'>
              {worksheet.map((item, i) => (
                <li key={item.id || i} className='border-b border-slate-100 pb-4 last:border-0'>
                  <p className='font-semibold text-slate-800 text-sm md:text-base mb-2'>
                    {i + 1}. {item.question}
                  </p>
                  {showAnswers ? (
                    <p className='text-sm text-emerald-700 font-medium pl-4 border-l-4 border-emerald-300'>
                      উত্তর: {item.answer}
                    </p>
                  ) : (
                    <div className='pl-4 space-y-1'>
                      <div className='h-5 border-b border-dashed border-slate-300' />
                      <div className='h-5 border-b border-dashed border-slate-300' />
                    </div>
                  )}
                  {item.hint && !showAnswers && (
                    <p className='text-[11px] text-slate-400 italic mt-1 pl-4'>সংকেত: {item.hint}</p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {!worksheet && !loading && (
        <div className='text-center py-12 text-slate-400'>
          <Sparkles className='w-12 h-12 mx-auto mb-3 opacity-30' />
          <p className='text-sm'>উপরে বিকল্প বেছে নিয়ে "ওয়ার্কশিট তৈরি করো" বাটনে ক্লিক করো।</p>
        </div>
      )}
    </div>
  );
};
