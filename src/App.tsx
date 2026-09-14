import React, { useState, useEffect } from 'react';
import { chaptersData } from './data/chaptersData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AiTutorModal } from './components/AiTutorModal';
import { HomePage } from './pages/HomePage';
import { ChapterPage } from './pages/ChapterPage';
import { GrammarSheetPage } from './pages/GrammarSheetPage';
import { PracticePage } from './pages/PracticePage';

import { ModelTestPage } from './pages/ModelTestPage';

type AppPage = 'home' | 'chapter' | 'practice' | 'model-test';

const COMPLETED_KEY = 'class5_bangla_completed';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]') as number[];
    } catch {
      return [];
    }
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const [isGrammarOpen, setIsGrammarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedChapters));
  }, [completedChapters]);

  // Handle hash changes for direct chapter/page URL linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#chapter-')) {
        const chId = parseInt(hash.replace('#chapter-', ''), 10);
        if (!isNaN(chId) && chId >= 1 && chId <= chaptersData.length) {
          setActiveChapterId(chId);
          setCurrentPage('chapter');
        }
      } else if (hash === '#practice') {
        setCurrentPage('practice');
        setActiveChapterId(null);
      } else if (hash === '#model-test') {
        setCurrentPage('model-test');
        setActiveChapterId(null);
      } else if (hash === '#grammar') {
        setIsGrammarOpen(true);
      } else if (!hash || hash === '#home') {
        setCurrentPage('home');
        setActiveChapterId(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update document title and analytics tracking on route change
  useEffect(() => {
    let title = 'পঞ্চম শ্রেণি বাংলা পাঠশালা - সম্পূর্ণ প্রশ্নোত্তর ও এআই শিক্ষক';
    const chapter = chaptersData.find(c => c.id === activeChapterId);
    if (currentPage === 'chapter' && chapter) {
      title = `${chapter.title} | পঞ্চম শ্রেণি বাংলা পাঠশালা`;
    } else if (currentPage === 'practice') {
      title = 'অনুশীলন ল্যাব | পঞ্চম শ্রেণি বাংলা পাঠশালা';
    } else if (currentPage === 'model-test') {
      title = 'মডেল টেস্ট | পঞ্চম শ্রেণি বাংলা পাঠশালা';
    }
    document.title = title;

    if (typeof window !== 'undefined') {
      const pagePath = window.location.pathname + window.location.hash;
      const win = window as any;
      if (typeof win.gtag === 'function') {
        win.gtag('event', 'page_view', {
          page_title: title,
          page_path: pagePath,
          page_location: window.location.href,
        });
      }
      if (Array.isArray(win.dataLayer)) {
        win.dataLayer.push({
          event: 'pageview',
          page_title: title,
          page_path: pagePath,
          page_location: window.location.href,
        });
      }
    }
  }, [activeChapterId, currentPage]);

  const handleSelectChapter = (id: number) => {
    setActiveChapterId(id);
    setCurrentPage('chapter');
    window.location.hash = '#chapter-' + id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveChapterId(null);
    setCurrentPage('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoPractice = () => {
    setCurrentPage('practice');
    setActiveChapterId(null);
    window.location.hash = '#practice';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoModelTest = () => {
    setCurrentPage('model-test');
    setActiveChapterId(null);
    window.location.hash = '#model-test';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkComplete = (id: number) => {
    setCompletedChapters(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const activeChapter = chaptersData.find(c => c.id === activeChapterId) || null;

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar
        onSelectChapter={handleSelectChapter}
        onOpenGrammarModal={() => setIsGrammarOpen(true)}
        onGoHome={handleGoHome}
        onGoPractice={handleGoPractice}
        activeChapterId={activeChapterId}
        chapters={chaptersData}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
        onGoModelTest={handleGoModelTest}
      />

      <div className='flex flex-1 overflow-hidden print:overflow-visible'>
        {/* Sidebar */}
        <Sidebar
          chapters={chaptersData}
          activeChapterId={activeChapterId}
          onSelectChapter={handleSelectChapter}
          completedChapters={completedChapters}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 z-40 bg-black/30 md:hidden'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className='flex-1 overflow-y-auto print:overflow-visible'>
          {currentPage === 'home' && (
            <HomePage
              chapters={chaptersData}
              completedChapters={completedChapters}
              onSelectChapter={handleSelectChapter}
              onOpenAiTutor={() => setIsAiTutorOpen(true)}
              onGoPractice={handleGoPractice}
              onGoGrammar={() => setIsGrammarOpen(true)}
              onGoModelTest={handleGoModelTest}
            />
          )}

          {currentPage === 'chapter' && activeChapter && (
            <ChapterPage
              chapter={activeChapter}
              onGoHome={handleGoHome}
              isCompleted={completedChapters.includes(activeChapter.id)}
              onMarkComplete={handleMarkComplete}
            />
          )}

          {currentPage === 'practice' && <PracticePage />}
          
          {currentPage === 'model-test' && <ModelTestPage chapters={chaptersData} />}
        </main>
      </div>

      {/* AI Tutor Modal */}
      <AiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        currentChapterTitle={activeChapter?.title}
      />

      {/* Grammar Sheet Modal */}
      {isGrammarOpen && (
        <GrammarSheetPage onClose={() => setIsGrammarOpen(false)} />
      )}
    </div>
  );
};

export default App;
