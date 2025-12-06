import React from 'react';
import { VERB_GROUPS_LIST } from '../constants';
import { VerbGroup, Avatar } from '../types';

interface Props {
  avatar: Avatar;
  onSelect: (group: VerbGroup) => void;
  onBack: () => void;
}

export const VerbGroupSelection: React.FC<Props> = ({ avatar, onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 fade-in">
      <div className="mb-4 text-6xl animate-bounce-short">{avatar.emoji}</div>
      <h2 className="text-3xl font-bold text-indigo-600 mb-2 text-center">
        Quelle mission, {avatar.name.split(' ')[0]} ?
      </h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Choisis ta famille de verbes !
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {VERB_GROUPS_LIST.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className="p-6 rounded-2xl bg-white border-2 border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-800 shadow-md transition-all flex flex-col items-center justify-center group hover:-translate-y-1"
          >
            <span className="text-4xl mb-2">{group.emoji}</span>
            <span className="font-bold text-xl mb-1">{group.label}</span>
            <span className="text-sm text-gray-400 group-hover:text-indigo-400">{group.desc}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="mt-8 text-gray-400 hover:text-gray-600 underline font-medium"
      >
        Retour
      </button>
    </div>
  );
};