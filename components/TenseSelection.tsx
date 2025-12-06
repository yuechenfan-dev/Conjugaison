import React from 'react';
import { TENSES_LIST } from '../constants';
import { Tense, Avatar } from '../types';

interface Props {
  avatar: Avatar;
  onSelect: (tense: Tense) => void;
  onBack: () => void;
}

export const TenseSelection: React.FC<Props> = ({ avatar, onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 fade-in">
      <div className="mb-6 text-6xl">{avatar.emoji}</div>
      <h2 className="text-3xl font-bold text-indigo-600 mb-2 text-center">
        Prêt, {avatar.name} ?
      </h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Quel temps veux-tu pratiquer aujourd'hui ?
      </p>

      <div className="grid grid-cols-1 gap-4 w-full">
        {TENSES_LIST.map((tenseItem) => (
          <button
            key={tenseItem.id}
            onClick={() => onSelect(tenseItem.id)}
            className="w-full p-5 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-800 font-bold text-xl shadow-md transition-all flex items-center justify-between group"
          >
            <span>{tenseItem.label}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
          </button>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="mt-8 text-gray-400 hover:text-gray-600 underline font-medium"
      >
        Changer de héros
      </button>
    </div>
  );
};