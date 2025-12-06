import React from 'react';
import { AVATARS } from '../constants';
import { Avatar } from '../types';

interface Props {
  onSelect: (avatar: Avatar) => void;
}

export const AvatarSelection: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 fade-in">
      <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-4 text-center">
        Choisis ton Héros !
      </h1>
      <p className="text-xl text-gray-600 mb-10 text-center">
        Qui va t'accompagner dans la forêt des verbes ?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar)}
            className={`
              relative group p-6 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2
              flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl
              bg-white border-gray-200 hover:border-indigo-300
            `}
          >
            <div className="text-7xl mb-4 animate-bounce-short">
              {avatar.emoji}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{avatar.name}</h3>
            <p className="text-sm text-gray-500">{avatar.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};