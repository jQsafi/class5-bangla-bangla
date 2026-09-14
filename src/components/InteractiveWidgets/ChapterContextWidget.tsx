import React, { useState } from 'react';
import { ContextualBackground, ChapterCharacter } from '../../types/bangla';
import { MapPin, Sparkles, Volume2, VolumeX, Lightbulb, Heart, CheckCircle2, MessageCircle } from 'lucide-react';

interface ChapterContextWidgetProps {
  context: ContextualBackground;
  chapterTitle: string;
}

export const ChapterContextWidget: React.FC<ChapterContextWidgetProps> = ({
  context,
  chapterTitle,
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<ChapterCharacter | null>(
    context.characters && context.characters.length > 0 ? context.characters[0] : null
  );
  const [isDidYouKnowRevealed, setIsDidYouKnowRevealed] = useState<boolean>(false);
  const [isPledged, setIsPledged] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে ভয়েস সাপোর্ট নেই।');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.9; // clear pacing for 10-12 year olds
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className='bg-gradient-to-br from-indigo-900/5 via-violet-900/5 to-purple-900/5 border border-indigo-100 rounded-3xl p-5 md:p-7 shadow-sm mb-6'>
      {/* Header section */}
      <div className='flex flex-wrap items-start justify-between gap-4 border-b border-indigo-100/80 pb-5 mb-5'>
        <div className='flex items-start gap-3.5'>
          <div className='w-12 h-12 rounded-2xl bg-white border border-indigo-100 shadow-md flex items-center justify-center text-2xl shrink-0'>
            {context.moodEmoji || '📜'}
          </div>
          <div>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className='px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1'>
                <MapPin className='w-3 h-3 text-indigo-600' />
                {context.timeAndPlace}
              </span>
              <span className='px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-800 flex items-center gap-1'>
                <Sparkles className='w-3 h-3 text-violet-600' />
                {context.sceneAtmosphere}
              </span>
            </div>
            <h3 className='text-lg md:text-xl font-black text-slate-900 mt-2 flex items-center gap-2'>
              ঐতিহাসিক প্রেক্ষাপট ও পটভূমি
            </h3>
          </div>
        </div>

        {/* Read aloud narrator button */}
        <button
          onClick={() => speakText(context.historicalSetting)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isPlayingAudio
              ? 'bg-rose-500 text-white animate-pulse'
              : 'bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200'
          }`}
          title='পটভূমি শুনুন'
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className='w-4 h-4' />
              <span>থামাও</span>
            </>
          ) : (
            <>
              <Volume2 className='w-4 h-4' />
              <span>গল্পটি শোনো</span>
            </>
          )}
        </button>
      </div>

      {/* Historical setting description */}
      <div className='bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-indigo-50 shadow-sm mb-6'>
        <p className='text-sm md:text-base text-slate-700 leading-relaxed font-normal'>
          {context.historicalSetting}
        </p>
      </div>

      {/* Character Theater */}
      {context.characters && context.characters.length > 0 && (
        <div className='mb-6'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <MessageCircle className='w-4 h-4 text-indigo-600' />
              <h4 className='text-sm font-bold text-slate-800'>
                ইন্টারেক্টিভ চরিত্রদের মনের কথা (ক্লিক করে জানো)
              </h4>
            </div>
            <span className='text-[11px] text-slate-500 hidden sm:inline'>
              যেকোনো চরিত্রে ক্লিক করো
            </span>
          </div>

          {/* Character selection buttons */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3'>
            {context.characters.map((char, idx) => {
              const isSelected = selectedCharacter?.name === char.name;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCharacter(char);
                    speakText(`${char.name} ভাবছে: ${char.dialogueOrThought}`);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-0.5'
                      : 'bg-white hover:bg-indigo-50/60 text-slate-700 border-slate-200 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isSelected ? 'bg-white/20' : 'bg-slate-100'
                    }`}
                  >
                    {char.icon}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='font-bold text-xs truncate'>{char.name}</div>
                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {char.role}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active speech bubble */}
          {selectedCharacter && (
            <div className='relative bg-indigo-50/90 border border-indigo-200/80 rounded-2xl p-4 text-slate-800 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200'>
              <div className='flex items-start gap-3'>
                <span className='text-2xl'>{selectedCharacter.icon}</span>
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold text-indigo-900'>
                      {selectedCharacter.name} — {selectedCharacter.role}
                    </span>
                    <button
                      onClick={() =>
                        speakText(
                          `${selectedCharacter.name} বলছে: ${selectedCharacter.dialogueOrThought}`
                        )
                      }
                      className='text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-indigo-200'
                    >
                      <Volume2 className='w-3 h-3' /> শোনো
                    </button>
                  </div>
                  <p className='text-sm text-slate-700 italic mt-1.5 leading-relaxed'>
                    "{selectedCharacter.dialogueOrThought}"
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Bottom Cards: Did You Know? + Moral Takeaway */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Did you know mystery card */}
        <div className='bg-white rounded-2xl border border-indigo-100 p-4 shadow-sm flex flex-col justify-between'>
          <div>
            <div className='flex items-center gap-2 text-indigo-700 font-bold text-xs mb-2'>
              <Lightbulb className='w-4 h-4 text-amber-500' />
              <span>তুমি কি জানতে? (আকর্ষণীয় তথ্য)</span>
            </div>

            {isDidYouKnowRevealed ? (
              <div className='bg-indigo-50/70 rounded-xl p-3 border border-indigo-100 text-xs md:text-sm text-slate-800 leading-relaxed animate-in zoom-in-95 duration-200'>
                {context.didYouKnow}
              </div>
            ) : (
              <div className='text-xs text-slate-500 py-3'>
                এই পাঠের পেছনের একটি চমকপ্রদ ঐতিহাসিক গোপন তথ্য লুকানো আছে...
              </div>
            )}
          </div>

          <button
            onClick={() => setIsDidYouKnowRevealed(!isDidYouKnowRevealed)}
            className='mt-3 w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5'
          >
            <Sparkles className='w-3.5 h-3.5' />
            <span>{isDidYouKnowRevealed ? 'লুকিয়ে রাখো' : 'রহস্য উন্মোচন করো ✨'}</span>
          </button>
        </div>

        {/* Moral Lesson / Reflection Card */}
        <div className='bg-white rounded-2xl border border-violet-100 p-4 shadow-sm flex flex-col justify-between'>
          <div>
            <div className='flex items-center gap-2 text-violet-700 font-bold text-xs mb-2'>
              <Heart className='w-4 h-4 text-rose-500' />
              <span>মূল শিক্ষা ও অন্তর্নিহিত বার্তা</span>
            </div>
            <p className='text-xs md:text-sm text-slate-700 leading-relaxed'>
              {context.moralLesson}
            </p>
          </div>

          <button
            onClick={() => setIsPledged(true)}
            className={`mt-3 w-full py-2 px-3 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              isPledged
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-violet-50 hover:bg-violet-100 text-violet-700'
            }`}
          >
            <CheckCircle2 className='w-3.5 h-3.5' />
            <span>{isPledged ? '🎉 প্রতিজ্ঞা গৃহীত হয়েছে!' : 'আমিও এটি মেনে চলব 🤝'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
