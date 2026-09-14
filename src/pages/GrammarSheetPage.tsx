import React, { useState } from 'react';
import { grammarData, GrammarItem } from '../data/grammarData';
import { X, Search } from 'lucide-react';

interface GrammarSheetPageProps {
  onClose: () => void;
}

const CATEGORIES = Array.from(new Set(grammarData.map(g => g.category)));

export const GrammarSheetPage: React.FC<GrammarSheetPageProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered: GrammarItem[] = searchTerm.trim()
    ? grammarData.filter(g =>
        g.name.includes(searchTerm) ||
        g.content.includes(searchTerm) ||
        g.example.includes(searchTerm)
      )
    : grammarData.filter(g => g.category === activeCategory);

  return (
    <div className='fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 text-white rounded-t-3xl'>
          <div>
            <h2 className='text-xl font-black'>📐 ব্যাকরণ রেফারেন্স তালিকা</h2>
            <p className='text-xs text-indigo-100 mt-0.5'>পঞ্চম শ্রেণির বাংলা ব্যাকরণের সম্পূর্ণ রেফারেন্স</p>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-white/20 rounded-xl transition-colors'>
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* Search & Categories */}
        <div className='p-4 border-b border-slate-100 bg-indigo-50/50 space-y-3'>
          <div className='relative'>
            <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
            <input
              type='text'
              placeholder='ব্যাকরণ নিয়ম বা শব্দ খুঁজুন...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-9 pr-4 py-2 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white'
            />
          </div>
          {!searchTerm && (
            <div className='flex flex-wrap gap-2'>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={'px-3 py-1.5 rounded-xl text-xs font-bold transition-all ' + (activeCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50')}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-5'>
          {filtered.length === 0 ? (
            <div className='text-center py-12 text-slate-400 text-sm'>খুঁজে পাওয়া যায়নি।</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {filtered.map((item, i) => (
                <div key={i} className='bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md p-4 transition-all'>
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <h3 className='font-black text-slate-800 text-sm'>{item.name}</h3>
                    {searchTerm && (
                      <span className='text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 shrink-0'>{item.category}</span>
                    )}
                  </div>
                  <div className='text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-3'>
                    {item.content}
                  </div>
                  <div className='p-2.5 bg-indigo-50/80 border border-indigo-100 rounded-xl'>
                    <span className='text-[11px] font-bold text-indigo-600'>উদাহরণ: </span>
                    <span className='text-xs text-indigo-950 font-medium'>{item.example}</span>
                  </div>
                  {item.notes && (
                    <div className='mt-2 text-[11px] text-violet-600 italic'>{item.notes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
