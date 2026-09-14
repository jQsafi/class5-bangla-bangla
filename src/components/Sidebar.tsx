import React from 'react';
import { Chapter } from '../types/bangla';
import { CheckCircle, Circle, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  chapters: Chapter[];
  activeChapterId: number | null;
  onSelectChapter: (id: number) => void;
  completedChapters: number[];
  isOpen: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  kobita: '🪶 কবিতা',
  gadya: '📖 গদ্য',
  natak: '🎭 নাটক',
  byakaran: '📐 ব্যাকরণ',
};

export const Sidebar: React.FC<SidebarProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  completedChapters,
  isOpen,
  onClose
}) => {
  // Group chapters by category
  const grouped: Record<string, Chapter[]> = {};
  for (const ch of chapters) {
    if (!grouped[ch.category]) grouped[ch.category] = [];
    grouped[ch.category].push(ch);
  }

  return (
    <aside
      className={'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-indigo-100 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 flex flex-col ' + (isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none')}
    >
      {/* Mobile close button */}
      <div className='flex items-center justify-between pb-3 border-b border-slate-100 md:hidden'>
        <span className='font-bold text-slate-800 text-sm'>পাঠ তালিকা</span>
        <button onClick={onClose} className='p-1 rounded-lg text-slate-500 hover:bg-slate-100' aria-label='বন্ধ করুন'>
          <X className='w-5 h-5' />
        </button>
      </div>

      {/* Progress Counter */}
      <div className='my-3 p-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl'>
        <div className='flex items-center justify-between text-xs font-bold text-indigo-900 mb-1.5'>
          <span>পাঠ অগ্রগতি</span>
          <span className='text-indigo-600 font-black'>{completedChapters.length} / {chapters.length} সম্পন্ন</span>
        </div>
        <div className='w-full h-2 bg-indigo-100 rounded-full overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all duration-500'
            style={{ width: ((completedChapters.length / chapters.length) * 100) + '%' }}
          />
        </div>
      </div>

      {/* Chapters Scrollable Nav List grouped by category */}
      <div className='flex-1 overflow-y-auto pr-1 py-1 space-y-3'>
        {Object.entries(grouped).map(([cat, chs]) => (
          <div key={cat}>
            <div className='text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 mb-1'>
              {categoryLabels[cat] || cat}
            </div>
            <div className='space-y-1'>
              {chs.map((ch) => {
                const isActive = activeChapterId === ch.id;
                const isDone = completedChapters.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      onSelectChapter(ch.id);
                      onClose();
                    }}
                    className={'w-full text-left px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-between gap-2 ' + (isActive ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20 font-bold' : 'text-slate-700 hover:bg-indigo-50/70')}
                  >
                    <div className='flex items-center gap-2.5 truncate'>
                      {isDone ? (
                        <CheckCircle className={'w-4 h-4 shrink-0 ' + (isActive ? 'text-emerald-300' : 'text-emerald-500')} />
                      ) : (
                        <Circle className={'w-4 h-4 shrink-0 ' + (isActive ? 'text-indigo-200' : 'text-slate-300')} />
                      )}
                      <span className='truncate'>{ch.title}</span>
                    </div>
                    <ChevronRight className={'w-3.5 h-3.5 shrink-0 ' + (isActive ? 'text-indigo-200' : 'text-slate-400')} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
