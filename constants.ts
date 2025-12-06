import { Avatar, Tense, VerbGroup } from './types';

export const AVATARS: Avatar[] = [
  {
    id: 'lion',
    name: 'Léo le Lion Courageux',
    emoji: '🦁',
    color: 'bg-orange-100 border-orange-400 text-orange-800',
    description: 'Le roi de la forêt magique.'
  },
  {
    id: 'unicorn',
    name: 'Luna la Licorne',
    emoji: '🦄',
    color: 'bg-purple-100 border-purple-400 text-purple-800',
    description: 'Elle aime les arcs-en-ciel et la magie.'
  },
  {
    id: 'dragon',
    name: 'Drako le Dragon Gentil',
    emoji: '🐲',
    color: 'bg-green-100 border-green-400 text-green-800',
    description: 'Il protège les trésors des verbes.'
  },
  {
    id: 'owl',
    name: 'Hibou le Sage',
    emoji: '🦉',
    color: 'bg-blue-100 border-blue-400 text-blue-800',
    description: 'Il connaît toutes les conjugaisons.'
  }
];

export const VERB_GROUPS_LIST = [
  { id: VerbGroup.GROUP_1, label: '1er Groupe (-er)', emoji: '🍎', desc: 'Manger, Chanter...' },
  { id: VerbGroup.GROUP_2, label: '2ème Groupe (-ir)', emoji: '🚀', desc: 'Finir, Choisir...' },
  { id: VerbGroup.GROUP_3, label: '3ème Groupe', emoji: '🌟', desc: 'Prendre, Aller, Faire...' },
  { id: VerbGroup.AUXILIARY, label: 'Être & Avoir', emoji: '👑', desc: 'Les Rois des verbes' }
];

export const TENSES_LIST = [
  { id: Tense.PRESENT, label: 'Le Présent (Maintenant)' },
  { id: Tense.FUTUR, label: 'Le Futur (Bientôt)' },
  { id: Tense.IMPARFAIT, label: 'L\'Imparfait (Avant)' },
  { id: Tense.PASSE_COMPOSE, label: 'Le Passé Composé (Fini)' }
];

export const REWARD_MESSAGES = [
  "Incroyable !",
  "Tu es un génie !",
  "Magique !",
  "Super travail !",
  "Continue comme ça !"
];