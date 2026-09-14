import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types/bangla';
import { CheckCircle2, XCircle, RotateCcw, Trophy, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { englishToBanglaDigits } from '../utils/banglaUtils';

interface QuizViewProps {
  questions: QuizQuestion[];
  chapterTitle: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, chapterTitle }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const current = questions[currentIdx];
  const isAnswered = answered[currentIdx];
  const userAnswer = userAnswers[currentIdx];

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setAnswered(new Array(questions.length).fill(false));
    setUserAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
  }, [chapterTitle, questions.length]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    const newAnswered = [...answered];
    const newUserAnswers = [...userAnswers];
    newAnswered[currentIdx] = true;
    newUserAnswers[currentIdx] = idx;
    setAnswered(newAnswered);
    setUserAnswers(newUserAnswers);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
    } else {
      const score = userAnswers.filter((ua, i) => ua === questions[i].correctIndex).length +
        (userAnswers[currentIdx] === current.correctIndex ? 1 : 0);
      setShowResult(true);
      if ((score / questions.length) >= 0.7) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setAnswered(new Array(questions.length).fill(false));
    setUserAnswers(new Array(questions.length).fill(null));
    setShowResult(false);
  };

  if (showResult) {
    const correctCount = userAnswers.filter((ua, i) => ua !== null && ua === questions[i].correctIndex).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className='bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm'>
        <Trophy className='w-16 h-16 mx-auto text-yellow-500' />
        <h3 className='text-2xl font-black text-slate-800'>কুইজ সম্পন্ন!</h3>
        <p className='text-4xl font-black text-indigo-600'>{englishToBanglaDigits(pct)}%</p>
        <p className='text-lg text-slate-600'>
          {englishToBanglaDigits(questions.length)} টির মধ্যে {englishToBanglaDigits(correctCount)} টি সঠিক
        </p>
        <p className='text-base text-slate-500'>
          {pct >= 80 ? '🎉 অসাধারণ! তুমি এই পাঠ খুব ভালো বুঝেছ!' :
            pct >= 60 ? '👍 বেশ ভালো! আরেকটু পড়লে আরও ভালো করবে।' :
              '💪 হাল ছেড়ো না! আবার পড়ো এবং চেষ্টা করো।'}
        </p>
        <button
          onClick={handleReset}
          className='flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20'
        >
          <RotateCcw className='w-4 h-4' /> আবার চেষ্টা করো
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Progress */}
      <div className='flex items-center gap-3'>
        <div className='flex-1 h-2 bg-slate-200 rounded-full overflow-hidden'>
          <div
            className='h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500'
            style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
          />
        </div>
        <span className='text-xs font-bold text-slate-500 shrink-0'>
          {englishToBanglaDigits(currentIdx + 1)} / {englishToBanglaDigits(questions.length)}
        </span>
      </div>

      {/* Question */}
      <div className='bg-gradient-to-br from-indigo-50/70 to-violet-50/70 border border-indigo-100 rounded-2xl p-5'>
        <p className='text-xs text-indigo-600 font-bold mb-2'>প্রশ্ন {englishToBanglaDigits(currentIdx + 1)}</p>
        <p className='text-base md:text-lg font-semibold text-slate-800 leading-relaxed'>{current.question}</p>
      </div>

      {/* Options */}
      <div className='space-y-3'>
        {current.options.map((opt, i) => {
          const isCorrect = i === current.correctIndex;
          const isSelected = userAnswers[currentIdx] === i;
          let cls = 'w-full text-left p-4 rounded-xl border-2 transition-all text-sm md:text-base font-medium flex items-center gap-3 ';
          if (!isAnswered) {
            cls += selectedIdx === i ? 'border-indigo-500 bg-indigo-50 text-indigo-950 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40';
          } else if (isCorrect) {
            cls += 'border-emerald-500 bg-emerald-50 text-emerald-800';
          } else if (isSelected) {
            cls += 'border-red-400 bg-red-50 text-red-700';
          } else {
            cls += 'border-slate-200 bg-slate-50 text-slate-500';
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} className={cls} disabled={isAnswered}>
              <span className={'w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ' + (isAnswered && isCorrect ? 'bg-emerald-500 text-white' : isAnswered && isSelected && !isCorrect ? 'bg-red-400 text-white' : selectedIdx === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700')}>
                {String.fromCharCode(2453 + i)}
              </span>
              {opt}
              {isAnswered && isCorrect && <CheckCircle2 className='w-5 h-5 text-emerald-600 ml-auto shrink-0' />}
              {isAnswered && isSelected && !isCorrect && <XCircle className='w-5 h-5 text-red-400 ml-auto shrink-0' />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className={`p-4 rounded-xl text-sm border ${userAnswers[currentIdx] === current.correctIndex ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          <span className='font-bold'>ব্যাখ্যা: </span>{current.explanation}
        </div>
      )}

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={!isAnswered}
        className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all ml-auto shadow-md shadow-indigo-600/20'
      >
        {currentIdx === questions.length - 1 ? 'ফলাফল দেখো' : 'পরবর্তী প্রশ্ন'}
        <ChevronRight className='w-4 h-4' />
      </button>
    </div>
  );
};
