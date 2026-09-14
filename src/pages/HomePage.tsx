import React from 'react';
import { Chapter } from '../types/bangla';
import { Feather, BookOpen, Scale, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { englishToBanglaDigits } from '../utils/banglaUtils';

interface HomePageProps {
  chapters: Chapter[];
  completedChapters: number[];
  onSelectChapter: (id: number) => void;
  onOpenAiTutor: () => void;
  onGoPractice: () => void;
  onGoGrammar: () => void;
  onGoModelTest: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  kobita: <Feather className='w-5 h-5' />,
  prose: <BookOpen className='w-5 h-5' />,
  natak: <Scale className='w-5 h-5' />,
  byakaran: <Scale className='w-5 h-5' />,
};

const categoryOrder = ['kobita', 'prose', 'byakaran', 'natak'];
const categoryNames: Record<string, string> = {
  kobita: '🪶 কবিতা',
  prose: '📖 গদ্য',
  natak: '🎭 নাটক',
  byakaran: '📐 ব্যাকরণ',
};

export const HomePage: React.FC<HomePageProps> = ({
  chapters,
  completedChapters,
  onSelectChapter,
  onOpenAiTutor,
  onGoPractice,
  onGoGrammar,
  onGoModelTest,
}) => {
  const grouped: Record<string, Chapter[]> = {};
  for (const ch of chapters) {
    if (!grouped[ch.category]) grouped[ch.category] = [];
    grouped[ch.category].push(ch);
  }

  const totalCompleted = completedChapters.length;
  const totalChapters = chapters.length;
  const progressPct = Math.round((totalCompleted / totalChapters) * 100);

  return (
    <div className='max-w-5xl mx-auto px-4 py-8 space-y-10'>

      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500 rounded-3xl p-8 md:p-10 text-white overflow-hidden shadow-2xl shadow-indigo-500/25'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-4 right-8 text-9xl select-none'>📚</div>
          <div className='absolute bottom-4 left-8 text-7xl select-none'>✍️</div>
        </div>
        <div className='relative z-10'>
          <div className='inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 backdrop-blur-sm'>
            <Sparkles className='w-3.5 h-3.5 text-yellow-300' />
            NCTB পঞ্চম শ্রেণি • বাংলা বিষয়
          </div>
          <h1 className='text-3xl md:text-4xl font-black leading-tight mb-3'>
            পঞ্চম শ্রেণির<br />
            <span className='text-pink-200'>বাংলা পাঠশালা</span>
          </h1>
          <p className='text-base md:text-lg text-indigo-100 max-w-xl mb-6 leading-relaxed'>
            কবিতা, গদ্য, ব্যাকরণ — সকল পাঠের সম্পূর্ণ প্রশ্নোত্তর, ইন্টারেক্টিভ কুইজ ও এআই বাংলা শিক্ষক।
          </p>

          {/* Progress */}
          <div className='bg-white/15 backdrop-blur-sm rounded-2xl p-4 mb-6 max-w-md'>
            <div className='flex items-center justify-between text-sm font-bold mb-2'>
              <span>তোমার অগ্রগতি</span>
              <span>{englishToBanglaDigits(totalCompleted)}/{englishToBanglaDigits(totalChapters)} পাঠ সম্পন্ন</span>
            </div>
            <div className='h-2.5 bg-white/30 rounded-full overflow-hidden'>
              <div
                className='h-full bg-white rounded-full transition-all duration-700'
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className='flex flex-wrap gap-3'>
            <button
              onClick={onOpenAiTutor}
              className='px-5 py-3 bg-white text-indigo-700 font-black rounded-2xl hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/20 text-sm hover:scale-105'
            >
              🤖 বাংলা বন্ধু (AI শিক্ষক)
            </button>
            <button
              onClick={onGoPractice}
              className='px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-all backdrop-blur-sm text-sm'
            >
              ✨ অনুশীলন ল্যাব
            </button>
            <button
              onClick={onGoModelTest}
              className='px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-all backdrop-blur-sm text-sm'
            >
              📝 মডেল টেস্ট
            </button>
            <button
              onClick={onGoGrammar}
              className='px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl transition-all backdrop-blur-sm text-sm'
            >
              📐 ব্যাকরণ তালিকা
            </button>
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        {[
          { icon: '📖', label: 'সম্পূর্ণ প্রশ্নোত্তর', sub: 'ধাপে ধাপে উত্তর' },
          { icon: '🤖', label: 'এআই বাংলা শিক্ষক', sub: 'যেকোনো প্রশ্নের উত্তর' },
          { icon: '🎯', label: 'ইন্টারেক্টিভ কুইজ', sub: 'নিজেকে যাচাই করো' },
          { icon: '🖨️', label: 'ওয়ার্কশিট প্রিন্ট', sub: 'এআই তৈরি প্রশ্নপত্র' },
        ].map((f, i) => (
          <div key={i} className='bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-indigo-300 hover:shadow-md transition-all'>
            <div className='text-2xl mb-2'>{f.icon}</div>
            <div className='font-bold text-slate-800 text-xs md:text-sm'>{f.label}</div>
            <div className='text-[11px] text-slate-500 mt-0.5'>{f.sub}</div>
          </div>
        ))}
      </section>

      {/* Chapters grouped by category */}
      {categoryOrder.filter(cat => grouped[cat]?.length).map(cat => (
        <section key={cat}>
          <div className='flex items-center gap-2 mb-4'>
            <h2 className='text-xl font-black text-slate-800'>{categoryNames[cat]}</h2>
            <span className='text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700'>
              {englishToBanglaDigits(grouped[cat].length)} টি পাঠ
            </span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {grouped[cat].map((chapter) => {
              const isCompleted = completedChapters.includes(chapter.id);
              return (
                <button
                  key={chapter.id}
                  onClick={() => onSelectChapter(chapter.id)}
                  className='text-left bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all p-5 group relative overflow-hidden'
                >
                  {isCompleted && (
                    <div className='absolute top-3 right-3'>
                      <CheckCircle2 className='w-5 h-5 text-emerald-500' />
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-2xl bg-indigo-600 bg-gradient-to-tr ${chapter.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                    {categoryIcons[chapter.category] || <BookOpen className='w-5 h-5' />}
                  </div>
                  <div className='flex items-center gap-2 mb-1'>
                    <span className='text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full'>
                      পাঠ {chapter.numberBn}
                    </span>
                    {chapter.author && (
                      <span className='text-[10px] text-slate-400 truncate'>— {chapter.author.replace('গদ্য পাঠ', '').replace('ব্যাকরণ পাঠ', '').trim()}</span>
                    )}
                  </div>
                  <h3 className='font-black text-slate-800 text-sm md:text-base leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors'>
                    {chapter.title}
                  </h3>
                  <p className='text-xs text-slate-500 line-clamp-2 mb-3'>{chapter.summary}</p>
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-1 flex-wrap'>
                      <span className='text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full'>
                        {chapter.exercises.length} প্রশ্নোত্তর
                      </span>
                      <span className='text-[10px] font-medium px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full'>
                        {chapter.quiz.length} কুইজ
                      </span>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all' />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};
