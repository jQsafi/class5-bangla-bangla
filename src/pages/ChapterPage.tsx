import React, { useState } from 'react';
import { Chapter, ActiveTab } from '../types/bangla';
import { BookOpen, HelpCircle, Zap, Target, Printer, Sparkles, ChevronLeft, CheckCircle2, Feather } from 'lucide-react';
import { SolutionCard } from '../components/SolutionCard';
import { QuizView } from '../components/QuizView';
import { WorksheetGenerator } from '../components/WorksheetGenerator';
import { AiProblemGenerator } from '../components/AiProblemGenerator';
import { PoemReader } from '../components/InteractiveWidgets/PoemReader';
import { GrammarPractice } from '../components/InteractiveWidgets/GrammarPractice';
import { ComprehensionHelper } from '../components/InteractiveWidgets/ComprehensionHelper';
import { ChapterContextWidget } from '../components/InteractiveWidgets/ChapterContextWidget';


interface ChapterPageProps {
  chapter: Chapter;
  onGoHome: () => void;
  isCompleted: boolean;
  onMarkComplete: (id: number) => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'theory', label: 'পাঠ ও ব্যাখ্যা', icon: <BookOpen className='w-4 h-4' /> },
  { id: 'solutions', label: 'প্রশ্নোত্তর', icon: <HelpCircle className='w-4 h-4' /> },
  { id: 'interactive', label: 'ইন্টারেক্টিভ', icon: <Zap className='w-4 h-4' /> },
  { id: 'quiz', label: 'কুইজ', icon: <Target className='w-4 h-4' /> },
  { id: 'worksheet', label: 'ওয়ার্কশিট', icon: <Printer className='w-4 h-4' /> },
  { id: 'ai_generator', label: 'এআই প্রশ্ন', icon: <Sparkles className='w-4 h-4' /> },
];

export const ChapterPage: React.FC<ChapterPageProps> = ({
  chapter,
  onGoHome,
  isCompleted,
  onMarkComplete,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('theory');

  const renderInteractiveTool = () => {
    const toolType = chapter.interactiveToolType;
    if (toolType === 'poem') {
      return <PoemReader title={chapter.title} author={chapter.author} lines={chapter.poemLines} />;
    } else if (toolType === 'grammar') {
      return <GrammarPractice chapterTitle={chapter.title} />;
    } else if (toolType === 'comprehension') {
      return <ComprehensionHelper
        title={chapter.title}
        passage={chapter.fullText || chapter.summary}
        questions={chapter.exercises.slice(0, 3).map(ex => ({ q: ex.question, a: ex.finalAnswer }))}
      />;
    }
    return (
      <div className='text-center py-12 text-slate-400'>
        <Zap className='w-12 h-12 mx-auto mb-3 opacity-30' />
        <p className='text-sm'>এই পাঠের জন্য ইন্টারেক্টিভ উইজেট শীঘ্রই আসছে।</p>
      </div>
    );
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      {/* Chapter Header */}
      <div className='mb-6'>
        <button
          onClick={onGoHome}
          className='flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-3'
        >
          <ChevronLeft className='w-4 h-4' /> পাঠ তালিকায় ফিরে যাও
        </button>

        <div className={`bg-indigo-600 bg-gradient-to-br ${chapter.color} rounded-3xl p-6 text-white shadow-xl`}>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full'>পাঠ {chapter.numberBn}</span>
                <span className='text-xs font-medium bg-white/15 px-2.5 py-0.5 rounded-full'>{chapter.categoryBn}</span>
              </div>
              <h1 className='text-2xl md:text-3xl font-black leading-tight'>{chapter.title}</h1>
              {chapter.author && (
                <p className='text-sm text-white/80 mt-1 flex items-center gap-1'>
                  <Feather className='w-3.5 h-3.5' /> {chapter.author}
                </p>
              )}
              {chapter.contextualBackground && (
                <div className='flex items-center gap-2 mt-2.5 flex-wrap'>
                  <span className='text-xs bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 font-medium text-white'>
                    📍 {chapter.contextualBackground.timeAndPlace}
                  </span>
                  <span className='text-xs bg-white/15 px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 font-medium text-white/90'>
                    ✨ {chapter.contextualBackground.sceneAtmosphere}
                  </span>
                </div>
              )}
              <p className='text-sm text-white/80 mt-3 leading-relaxed max-w-xl'>{chapter.summary}</p>
            </div>
            <button
              onClick={() => onMarkComplete(chapter.id)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${isCompleted ? 'bg-emerald-400 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}
            >
              <CheckCircle2 className='w-4 h-4' />
              {isCompleted ? 'সম্পন্ন' : 'সম্পন্ন করো'}
            </button>
          </div>

          {/* Learning objectives */}
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2'>
            {chapter.learningObjectives.slice(0, 4).map((obj, i) => (
              <div key={i} className='flex items-start gap-2 text-xs text-white/90'>
                <CheckCircle2 className='w-3.5 h-3.5 text-white/60 shrink-0 mt-0.5' />
                {obj}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 p-1 bg-slate-100 rounded-2xl mb-6 overflow-x-auto'>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ' + (activeTab === tab.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700')}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {/* Theory tab */}
        {activeTab === 'theory' && (
          <div className='space-y-6'>
            {/* Whole Poem Section for Kobita */}
            {chapter.category === 'kobita' && chapter.poemLines && (
              <div className='bg-white rounded-3xl border border-indigo-100 p-6 md:p-8 shadow-sm relative overflow-hidden'>
                <div className='flex items-center justify-between border-b border-indigo-100/80 pb-4 mb-6'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-lg shadow-sm'>
                      🪶
                    </div>
                    <div>
                      <h2 className='text-lg md:text-xl font-black text-slate-900'>সম্পূর্ণ কবিতা: {chapter.title}</h2>
                      {chapter.author && (
                        <p className='text-xs text-indigo-600 font-semibold'>কবি: {chapter.author}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('interactive')}
                    className='px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5'
                  >
                    <span>🎙️ আবৃত্তি ল্যাব</span>
                  </button>
                </div>

                <div className='poem-text text-slate-800 text-base md:text-lg leading-[2.4] font-medium max-w-xl mx-auto md:mx-0 pl-0 md:pl-4 border-l-0 md:border-l-2 border-indigo-200'>
                  {chapter.poemLines.map((line, idx) =>
                    !line.trim() ? (
                      <div key={idx} className='h-4' />
                    ) : (
                      <div key={idx} className='hover:text-indigo-600 transition-colors'>
                        {line}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Whole Story Section for Gadya */}
            {chapter.category === 'prose' && chapter.fullText && (
              <div className='bg-white rounded-3xl border border-indigo-100 p-6 md:p-8 shadow-sm relative overflow-hidden'>
                <div className='flex items-center justify-between border-b border-indigo-100/80 pb-4 mb-6'>
                  <div className='flex items-center gap-2.5'>
                    <div className='w-9 h-9 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-lg shadow-sm'>
                      📖
                    </div>
                    <div>
                      <h2 className='text-lg md:text-xl font-black text-slate-900'>মূল গল্প / পাঠ্যাংশ: {chapter.title}</h2>
                      <p className='text-xs text-violet-600 font-semibold'>NCTB পঞ্চম শ্রেণি বাংলা পাঠ্যবই</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('interactive')}
                    className='px-3.5 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5'
                  >
                    <span>💬 অনুচ্ছেদ বিশ্লেষণ</span>
                  </button>
                </div>

                <div className='prose prose-slate max-w-none text-slate-800 text-sm md:text-base leading-8 space-y-4 font-normal'>
                  {chapter.fullText.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx} className='indent-6 text-justify'>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Contextual Background */}
            {chapter.contextualBackground && (
              <ChapterContextWidget
                context={chapter.contextualBackground}
                chapterTitle={chapter.title}
              />
            )}

            {chapter.keyTheories.map((theory, i) => (
              <div key={i} className='bg-white rounded-2xl border border-slate-200 p-5'>
                <h3 className='font-black text-slate-800 text-base mb-3 flex items-center gap-2'>
                  <div className='w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0'>{i + 1}</div>
                  {theory.title}
                </h3>
                <div className='prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed'>
                  {theory.content}
                </div>
              </div>
            ))}

            {chapter.examples.length > 0 && (
              <div className='bg-gradient-to-br from-indigo-50/70 to-violet-50/70 border border-indigo-100 rounded-2xl p-5'>
                <h3 className='font-black text-indigo-900 mb-4'>💡 উদাহরণ বিশ্লেষণ</h3>
                {chapter.examples.map((ex) => (
                  <div key={ex.id} className='mb-4 last:mb-0'>
                    <h4 className='font-bold text-slate-800 text-sm mb-2'>{ex.title}</h4>
                    <p className='text-sm text-slate-700 mb-3 italic'>প্রশ্ন: {ex.question}</p>
                    <div className='space-y-2'>
                      {ex.steps.map((step) => (
                        <div key={step.stepNumber} className='flex gap-3 items-start'>
                          <div className='w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0'>{step.stepNumber}</div>
                          <p className='text-sm text-slate-700'>{step.explanation}</p>
                        </div>
                      ))}
                    </div>
                    <div className='mt-3 p-3 bg-white border border-indigo-100 rounded-xl'>
                      <span className='text-xs font-bold text-indigo-600'>উত্তর: </span>
                      <span className='text-sm font-bold text-slate-800'>{ex.finalAnswer}</span>
                    </div>
                    {ex.tip && <p className='text-xs text-slate-500 italic mt-2'>💡 {ex.tip}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Solutions tab */}
        {activeTab === 'solutions' && (
          <div>
            <div className='mb-4 flex items-center gap-2'>
              <HelpCircle className='w-5 h-5 text-indigo-600' />
              <h2 className='font-black text-slate-800'>অনুশীলনীর প্রশ্নোত্তর ({chapter.exercises.length} টি প্রশ্ন)</h2>
            </div>
            {chapter.exercises.map((problem, i) => (
              <SolutionCard key={problem.id} problem={problem} index={i} />
            ))}
          </div>
        )}

        {/* Interactive tab */}
        {activeTab === 'interactive' && renderInteractiveTool()}

        {/* Quiz tab */}
        {activeTab === 'quiz' && (
          <div>
            <div className='mb-4'>
              <h2 className='font-black text-slate-800 text-lg'>কুইজ — {chapter.title}</h2>
              <p className='text-sm text-slate-500'>{chapter.quiz.length} টি প্রশ্ন</p>
            </div>
            <QuizView questions={chapter.quiz} chapterTitle={chapter.title} />
          </div>
        )}

        {/* Worksheet tab */}
        {activeTab === 'worksheet' && <WorksheetGenerator chapter={chapter} />}

        {/* AI Generator tab */}
        {activeTab === 'ai_generator' && <AiProblemGenerator chapter={chapter} />}
      </div>
    </div>
  );
};
