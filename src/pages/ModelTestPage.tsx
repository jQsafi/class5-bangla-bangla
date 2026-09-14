import React, { useState } from 'react';
import { Chapter } from '../types/bangla';
import { generateModelTest } from '../services/groqService';
import { Loader2, Sparkles, AlertTriangle, Printer, BookMarked, CheckSquare, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ModelTestPageProps {
  chapters: Chapter[];
}

export const ModelTestPage: React.FC<ModelTestPageProps> = ({ chapters }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelTestContent, setModelTestContent] = useState<string | null>(null);

  const allSelected = selectedIds.length === chapters.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(chapters.map(c => c.id));
    }
  };

  const toggleChapter = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedIds.length === 0) {
      setError('অন্তত একটি অধ্যায় নির্বাচন করুন!');
      return;
    }
    
    setLoading(true);
    setError(null);
    setModelTestContent(null);
    
    const selectedTitles = chapters
      .filter(c => selectedIds.includes(c.id))
      .map(c => c.title);

    try {
      let content = await generateModelTest(selectedTitles);
      // Remove any markdown code block wrapper if AI includes it
      if (content.startsWith('```markdown')) {
        content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\n/, '').replace(/\n```$/, '');
      }
      setModelTestContent(content);
    } catch (err: any) {
      setError(err?.message || 'মডেল টেস্ট তৈরিতে ত্রুটি হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-8 space-y-8 pb-20 print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-0'>
      
      {/* Header */}
      <div className='bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden print:hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-2 right-4 text-8xl'>📝</div>
          <div className='absolute -bottom-4 left-4 text-8xl'>📚</div>
        </div>
        <div className='relative z-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 backdrop-blur-sm'>
            <BookMarked className='w-3.5 h-3.5' />
            ১০০ মার্কের প্রশ্নপত্র
          </div>
          <h1 className='text-2xl md:text-3xl font-black mb-2'>মডেল টেস্ট জেনারেটর</h1>
          <p className='text-indigo-100 max-w-lg text-sm leading-relaxed'>
            পঞ্চম শ্রেণির সমাপনী পরীক্ষার (PECE) মানবণ্টন ও কাঠামো অনুসরণ করে এআই দিয়ে পূর্ণাঙ্গ ১০০ মার্কের মডেল প্রশ্নপত্র তৈরি করুন।
          </p>
        </div>
      </div>

      {/* Chapter Selection (Hidden on Print) */}
      <div className='print:hidden bg-white border border-slate-200 rounded-3xl p-6 shadow-sm'>
        <div className='flex items-center justify-between mb-4 border-b border-slate-100 pb-4'>
          <div>
            <h2 className='text-lg font-black text-slate-800'>অধ্যায় নির্বাচন করুন</h2>
            <p className='text-xs text-slate-500 mt-1'>যেসব অধ্যায়ের ওপর প্রশ্নপত্র তৈরি করতে চান সেগুলো বেছে নিন</p>
          </div>
          <button 
            onClick={toggleSelectAll}
            className='flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors'
          >
            {allSelected ? <CheckSquare className='w-4 h-4 text-indigo-600' /> : <Square className='w-4 h-4' />}
            সবগুলো {allSelected ? 'বাদ দিন' : 'নির্বাচন করুন'}
          </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6'>
          {chapters.map(chapter => {
            const isSelected = selectedIds.includes(chapter.id);
            return (
              <div 
                key={chapter.id}
                onClick={() => toggleChapter(chapter.id)}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <div className='mt-0.5 shrink-0'>
                  {isSelected ? (
                    <CheckSquare className='w-5 h-5 text-indigo-600' />
                  ) : (
                    <Square className='w-5 h-5 text-slate-300' />
                  )}
                </div>
                <div>
                  <div className={`font-bold text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {chapter.title}
                  </div>
                  <div className='text-[10px] text-slate-400 mt-0.5'>{chapter.categoryBn}</div>
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className='p-4 mb-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-700 text-sm font-medium'>
            <AlertTriangle className='w-5 h-5 shrink-0' /> {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || selectedIds.length === 0}
          className='w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:via-violet-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/30'
        >
          {loading ? (
            <><Loader2 className='w-5 h-5 animate-spin' /> প্রশ্নপত্র তৈরি হচ্ছে (কিছু সময় লাগতে পারে)...</>
          ) : (
            <><Sparkles className='w-5 h-5' /> ১০০ মার্কের মডেল টেস্ট তৈরি করুন</>
          )}
        </button>
      </div>

      {/* Generated Content */}
      {modelTestContent && (
        <div className='bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm print:border-none print:shadow-none print:p-0 print:rounded-none'>
          
          <div className='flex justify-end mb-6 print:hidden'>
            <button
              onClick={handlePrint}
              className='px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors'
            >
              <Printer className='w-4 h-4' /> প্রশ্নপত্র প্রিন্ট করুন
            </button>
          </div>

          <div className='prose prose-slate prose-indigo max-w-none prose-headings:font-black prose-p:leading-relaxed prose-li:leading-relaxed prose-ol:pl-4 [&_hr]:my-4 print:text-black'>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {modelTestContent}
            </ReactMarkdown>
          </div>
          
        </div>
      )}

    </div>
  );
};
