import React, { useState } from 'react';
import { BookOpen, Search, Menu, Sparkles, BookMarked, Home, ChevronRight } from 'lucide-react';
import { Chapter } from '../types/bangla';
import { BanglaBuddyAvatar } from './BanglaBuddyAvatar';

interface NavbarProps {
  onSelectChapter: (id: number) => void;
  onOpenGrammarModal: () => void;
  onGoHome: () => void;
  onGoPractice: () => void;
  activeChapterId: number | null;
  chapters: Chapter[];
  onToggleSidebar: () => void;
  onOpenAiTutor?: () => void;
  onGoModelTest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectChapter,
  onOpenGrammarModal,
  onGoHome,
  onGoPractice,
  activeChapterId,
  chapters,
  onToggleSidebar,
  onOpenAiTutor,
  onGoModelTest
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredChapters = chapters.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.author && c.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    c.categoryBn.includes(searchTerm)
  );

  return (
    <header className='sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-indigo-100 shadow-sm print:hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4'>
        {/* Left: Brand & Sidebar Toggle */}
        <div className='flex items-center gap-3'>
          <button
            onClick={onToggleSidebar}
            className='p-2 rounded-xl text-slate-600 hover:bg-indigo-50 md:hidden'
            aria-label='সাইডবার খুলুন'
          >
            <Menu className='w-5 h-5' />
          </button>
          <div onClick={onGoHome} className='flex items-center gap-2 cursor-pointer group'>
            <div className='w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform'>
              <BookOpen className='w-5 h-5' />
            </div>
            <div>
              <h1 className='text-base md:text-lg font-black text-slate-900 leading-tight flex items-center gap-1.5'>
                বাংলা পাঠশালা <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700'>৫ম শ্রেণি</span>
              </h1>
              <p className='text-[10px] text-slate-500 hidden sm:block'>NCTB পাঠ্যবই ও সম্পূর্ণ প্রশ্নোত্তর</p>
            </div>
          </div>
        </div>

        {/* Middle: Search bar */}
        <div className='relative flex-1 max-w-md hidden md:block'>
          <div className='relative'>
            <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
            <input
              type='text'
              placeholder='পাঠ, কবি বা বিষয় খুঁজুন (যেমন: কবিতা, ব্যাকরণ, বিরাম চিহ্ন)...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className='w-full pl-9 pr-4 py-2 bg-slate-100 focus:bg-white rounded-2xl text-xs md:text-sm border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all'
            />
          </div>

          {/* Search dropdown */}
          {showDropdown && searchTerm.trim() && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 max-h-80 overflow-y-auto z-50'>
              {filteredChapters.length > 0 ? (
                filteredChapters.map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectChapter(c.id);
                      setShowDropdown(false);
                      setSearchTerm('');
                    }}
                    className='p-2.5 rounded-xl hover:bg-indigo-50 cursor-pointer flex items-center justify-between'
                  >
                    <div>
                      <div className='font-bold text-slate-800 text-xs md:text-sm'>{c.title}</div>
                      <div className='text-[11px] text-slate-500 line-clamp-1'>{c.categoryBn} {c.author ? `— ${c.author}` : ''}</div>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-400' />
                  </div>
                ))
              ) : (
                <div className='p-3 text-center text-xs text-slate-500'>কোনো পাঠ পাওয়া যায়নি</div>
              )}
            </div>
          )}

          {/* Close dropdown on blur */}
          {showDropdown && (
            <div className='fixed inset-0 z-40' onClick={() => setShowDropdown(false)} />
          )}
        </div>

        {/* Right Nav buttons */}
        <div className='flex items-center gap-2'>
          <button
            onClick={onGoHome}
            className={'p-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold ' + (activeChapterId === null ? 'text-indigo-700 bg-indigo-50' : '')}
            title='মূল পাতা'
          >
            <Home className='w-4 h-4' />
            <span className='hidden lg:inline'>হোম</span>
          </button>

          <button
            onClick={onGoPractice}
            className='px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold'
          >
            <Sparkles className='w-4 h-4 text-violet-600' />
            <span className='hidden sm:inline'>অনুশীলন ল্যাব</span>
          </button>

          <button
            onClick={onGoModelTest}
            className='px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold'
          >
            <BookMarked className='w-4 h-4 text-emerald-600' />
            <span className='hidden sm:inline'>মডেল টেস্ট</span>
          </button>

          <button
            onClick={onOpenGrammarModal}
            className='px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5 text-xs font-bold transition-all'
          >
            <BookMarked className='w-4 h-4 text-indigo-600' />
            <span>ব্যাকরণ তালিকা</span>
          </button>

          {onOpenAiTutor && (
            <button
              onClick={onOpenAiTutor}
              className='px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500 hover:from-indigo-700 hover:to-rose-600 text-white flex items-center gap-2 text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-105 group'
            >
              <BanglaBuddyAvatar size={22} mood='wink' animated={true} className='group-hover:rotate-12 transition-transform' />
              <span>বাংলা বন্ধু</span>
              <span className='text-[9px] bg-white/20 px-1 py-0.5 rounded font-black uppercase'>AI</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
