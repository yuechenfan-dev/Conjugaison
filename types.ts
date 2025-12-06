export enum Tense {
  PRESENT = 'Présent',
  FUTUR = 'Futur Simple',
  IMPARFAIT = 'Imparfait',
  PASSE_COMPOSE = 'Passé Composé'
}

export enum VerbGroup {
  GROUP_1 = '1er Groupe (-er)',
  GROUP_2 = '2ème Groupe (-ir)',
  GROUP_3 = '3ème Groupe (Irréguliers)',
  AUXILIARY = 'Les Rois (Être & Avoir)'
}

export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface ConjugationTable {
  present: string[];
  futur: string[];
  imparfait: string[];
  passe_compose: string[];
}

export interface Question {
  story: string; // The fantasy context
  sentence: string; // The sentence with a blank
  verb: string;
  pronoun: string; // e.g., "Je", "Nous"
  // options: string[]; // REMOVED: We are doing spelling now
  correctAnswer: string;
  feedback: string; // Short educational tip
  fullConjugations: ConjugationTable; // For muscle memory
}

export interface GameState {
  score: number;
  level: number;
  currentQuestion: Question | null;
  loading: boolean;
  gameStatus: 'intro' | 'playing' | 'success' | 'error';
  selectedAvatar: Avatar | null;
  selectedTense: Tense;
  selectedGroup: VerbGroup;
  streak: number;
}