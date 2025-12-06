import React, { useState } from 'react';
import { AvatarSelection } from './components/AvatarSelection';
import { VerbGroupSelection } from './components/VerbGroupSelection';
import { TenseSelection } from './components/TenseSelection';
import { GameScreen } from './components/GameScreen';
import { Avatar, Tense, VerbGroup } from './types';

enum Screen {
  AVATAR,
  GROUP,
  TENSE,
  GAME
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.AVATAR);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<VerbGroup>(VerbGroup.GROUP_1);
  const [selectedTense, setSelectedTense] = useState<Tense>(Tense.PRESENT);

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setScreen(Screen.GROUP);
  };

  const handleGroupSelect = (group: VerbGroup) => {
    setSelectedGroup(group);
    setScreen(Screen.TENSE);
  };

  const handleTenseSelect = (tense: Tense) => {
    setSelectedTense(tense);
    setScreen(Screen.GAME);
  };

  const handleBackToAvatar = () => {
    setSelectedAvatar(null);
    setScreen(Screen.AVATAR);
  };

  const handleBackToGroup = () => {
    setScreen(Screen.GROUP);
  };

  const handleHome = () => {
    setScreen(Screen.AVATAR);
    setSelectedAvatar(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Navbar Simple */}
      <header className="bg-white p-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
            <span className="text-2xl mr-2">🏰</span>
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            L'Aventure des Verbes Magiques
            </h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-8">
        {screen === Screen.AVATAR && (
          <AvatarSelection onSelect={handleAvatarSelect} />
        )}

        {screen === Screen.GROUP && selectedAvatar && (
            <VerbGroupSelection
                avatar={selectedAvatar}
                onSelect={handleGroupSelect}
                onBack={handleBackToAvatar}
            />
        )}
        
        {screen === Screen.TENSE && selectedAvatar && (
          <TenseSelection 
            avatar={selectedAvatar} 
            onSelect={handleTenseSelect} 
            onBack={handleBackToGroup}
          />
        )}

        {screen === Screen.GAME && selectedAvatar && (
          <GameScreen 
            avatar={selectedAvatar} 
            tense={selectedTense}
            group={selectedGroup} 
            onHome={handleHome}
          />
        )}
      </main>

      <footer className="text-center p-4 text-gray-400 text-sm">
        <p>Apprends le français en t'amusant ! ✨</p>
      </footer>
    </div>
  );
};

export default App;