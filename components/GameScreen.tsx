import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Tense, VerbGroup, Question } from '../types';
import { generateVerbQuestion, generateSpeech } from '../services/geminiService';
import { playRawAudio } from '../services/audioService';
import { REWARD_MESSAGES } from '../constants';
import { Sparkles, Trophy, ArrowRight, Home, Volume2, Loader2, BookOpen, Check } from 'lucide-react';

interface Props {
  avatar: Avatar;
  tense: Tense;
  group: VerbGroup;
  onHome: () => void;
}

export const GameScreen: React.FC<Props> = ({ avatar, tense, group, onHome }) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Game State
  const [userInput, setUserInput] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  
  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioLoading, setAudioLoading] = useState<boolean>(false);
  
  // Grimoire (Review) State
  const [activeTab, setActiveTab] = useState<'present' | 'futur' | 'imparfait' | 'passe_compose'>('present');

  const inputRef = useRef<HTMLInputElement>(null);

  const loadQuestion = async () => {
    setLoading(true);
    setUserInput("");
    setIsSubmitted(false);
    setIsCorrect(false);
    setIsPlayingAudio(false);
    const q = await generateVerbQuestion(tense, group, avatar.name);
    setQuestion(q);
    
    // Auto-set tab to the current tense if possible, else present
    let initialTab: any = 'present';
    if (tense.includes('Futur')) initialTab = 'futur';
    else if (tense.includes('Imparfait')) initialTab = 'imparfait';
    else if (tense.includes('Passé')) initialTab = 'passe_compose';
    setActiveTab(initialTab);
    
    setLoading(false);
    // Focus input after loading
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    loadQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSpeakSentence = async () => {
    if (!question || isPlayingAudio || audioLoading) return;
    setAudioLoading(true);
    try {
        const textToSpeak = `${question.story}. ${question.sentence.replace('___', 'hmhm')}`;
        await playAndSetState(textToSpeak);
    } catch (e) {
        console.error(e);
        setAudioLoading(false);
    }
  };

  const handleSpeakTable = async () => {
    if (!question || isPlayingAudio || audioLoading) return;
    setAudioLoading(true);
    try {
        const lines = question.fullConjugations[activeTab];
        const textToSpeak = `Le verbe ${question.verb} au ${activeTab.replace('_', ' ')}. ${lines.join('. ')}.`;
        await playAndSetState(textToSpeak);
    } catch (e) {
        console.error(e);
        setAudioLoading(false);
    }
  };

  const playAndSetState = async (text: string) => {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
          setAudioLoading(false);
          setIsPlayingAudio(true);
          await playRawAudio(base64Audio);
          setIsPlayingAudio(false);
      } else {
          setAudioLoading(false);
      }
  }

  const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!question || isSubmitted) return;
      if (!userInput.trim()) return;

      const correct = userInput.trim().toLowerCase() === question.correctAnswer.toLowerCase();
      setIsCorrect(correct);
      setIsSubmitted(true);

      if (correct) {
          setScore(s => s + 10 + (streak * 2));
          setStreak(s => s + 1);
      } else {
          setStreak(0);
      }
  };

  const getRandomReward = () => REWARD_MESSAGES[Math.floor(Math.random() * REWARD_MESSAGES.length)];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center fade-in">
        <div className="text-6xl mb-6 animate-bounce">{avatar.emoji}</div>
        <h2 className="text-2xl font-bold text-indigo-500 mb-2">Le grimoire s'ouvre...</h2>
        <p className="text-gray-500">Recherche d'un sort magique...</p>
        <div className="mt-8 w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 flex flex-col items-center fade-in pb-20">
      {/* Header Bar */}
      <div className="w-full flex justify-between items-center bg-white rounded-full px-6 py-3 shadow-sm mb-6">
        <button onClick={onHome} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
            <Home size={24} />
        </button>
        <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={24} />
            <span className="font-bold text-xl text-gray-800">{score}</span>
        </div>
        <div className="flex items-center space-x-1">
             <span className="text-sm font-bold text-orange-500">🔥 {streak}</span>
        </div>
      </div>

      {/* Story Card */}
      <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden mb-6 border-b-8 border-indigo-100">
        <div className="bg-indigo-500 p-6 text-white text-center relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
             
             <button 
                onClick={handleSpeakSentence}
                disabled={audioLoading || isPlayingAudio}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all transform hover:scale-110"
             >
                {audioLoading ? <Loader2 size={24} className="animate-spin" /> : <Volume2 size={24} className={isPlayingAudio ? 'animate-pulse text-yellow-300' : ''} />}
             </button>

             <p className="text-lg font-medium relative z-10 italic pr-8 pl-8 opacity-90 mb-2">
               "{question.story}"
             </p>
             <div className="flex justify-center items-center gap-2 relative z-10">
                <span className="bg-indigo-700/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-400/30">
                    {group.split(' ')[0]}
                </span>
             </div>
        </div>

        <div className="p-8 flex flex-col items-center">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-6">
                Conjugue : <span className="text-indigo-600 font-extrabold text-lg">{question.verb}</span>
            </p>
            
            <div className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-8 w-full text-center">
                {question.sentence.split('___')[0]}
                <form onSubmit={handleSubmit} className="inline-block mx-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={isSubmitted}
                        className={`
                            border-b-4 bg-transparent outline-none text-center min-w-[120px] max-w-[200px] px-2 py-1
                            ${isSubmitted 
                                ? (isCorrect ? 'border-green-500 text-green-600' : 'border-red-400 text-red-500') 
                                : 'border-indigo-300 text-indigo-700 focus:border-indigo-500'
                            }
                            placeholder-indigo-200 transition-all
                        `}
                        placeholder="?"
                        autoComplete="off"
                        autoCapitalize="off"
                    />
                </form>
                {question.sentence.split('___')[1]}
            </div>

            {!isSubmitted && (
                <button
                    onClick={() => handleSubmit()}
                    disabled={!userInput.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-12 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    Valider <Check size={20} />
                </button>
            )}
        </div>
      </div>

      {/* FEEDBACK & GRIMOIRE */}
      {isSubmitted && (
        <div className="w-full animate-fade-in space-y-6">
            
            {/* Simple Feedback Bar */}
            <div className={`p-4 rounded-xl text-center border-2 flex flex-col items-center ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className="text-xl font-bold mb-1">
                    {isCorrect ? (<span><Sparkles className="inline w-5 h-5 mr-1"/> {getRandomReward()}</span>) : "Oups !"}
                </div>
                {!isCorrect && (
                    <p>La bonne réponse était : <strong>{question.correctAnswer}</strong></p>
                )}
                <p className="text-sm opacity-80 mt-1">{question.feedback}</p>
            </div>

            {/* The Magic Grimoire (Always shown after submit to learn) */}
            <div className="bg-amber-50 rounded-2xl shadow-xl border-4 border-amber-200 overflow-hidden relative">
                 <div className="bg-amber-200 p-3 flex justify-between items-center text-amber-900">
                    <div className="flex items-center gap-2 font-bold">
                        <BookOpen size={20} />
                        <span>Grimoire : {question.verb}</span>
                    </div>
                    <button 
                        onClick={handleSpeakTable}
                        disabled={audioLoading || isPlayingAudio}
                        className="bg-amber-100 hover:bg-white text-amber-800 p-2 rounded-full transition-colors"
                        title="Lire le tableau"
                    >
                         {audioLoading ? <Loader2 size={18} className="animate-spin" /> : <Volume2 size={18} />}
                    </button>
                 </div>

                 {/* Tense Tabs */}
                 <div className="flex bg-amber-100/50 p-1 gap-1 overflow-x-auto">
                    {Object.keys(question.fullConjugations).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition-all whitespace-nowrap
                                ${activeTab === t 
                                    ? 'bg-white shadow-sm text-amber-800' 
                                    : 'text-amber-600/70 hover:bg-amber-100'
                                }
                            `}
                        >
                            {t.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                 </div>

                 {/* Conjugation List */}
                 <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
                    {question.fullConjugations[activeTab].map((line, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 border-b border-amber-100 last:border-0">
                            <div className="w-2 h-2 rounded-full bg-amber-300"></div>
                            <span className="text-amber-900 font-medium text-lg">{line}</span>
                        </div>
                    ))}
                 </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={loadQuestion}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform hover:scale-105"
                >
                    Continuer <ArrowRight size={20} />
                </button>
            </div>
        </div>
      )}
      
      {/* Decorative background elements */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};