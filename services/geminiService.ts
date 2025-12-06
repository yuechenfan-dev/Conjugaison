import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Tense, VerbGroup, Question } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Clé API manquante");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateVerbQuestion = async (tense: Tense, group: VerbGroup, avatarName: string): Promise<Question> => {
  const ai = getClient();
  
  const prompt = `
    Tu es un professeur de français pour des enfants de 10 ans.
    Génère un exercice de conjugaison (orthographe).
    
    Contexte : L'enfant joue avec l'avatar "${avatarName}".
    Groupe de verbe cible : "${group}".
    Temps cible : "${tense}".
    
    Tâche :
    1. Choisis un verbe adapté au groupe demandé.
    2. Crée une phrase contextuelle amusante/fantastique.
    3. Crée une phrase à compléter (l'enfant doit écrire le verbe).
    4. Fournis TOUTES les conjugaisons de ce verbe pour les temps : Présent, Futur, Imparfait, Passé Composé.
    
    Format JSON strict.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING, description: "Une courte phrase de mise en situation." },
            sentence: { type: Type.STRING, description: "La phrase avec '___' pour le verbe." },
            verb: { type: Type.STRING, description: "L'infinitif du verbe." },
            pronoun: { type: Type.STRING, description: "Le pronom sujet (Je, Tu...)." },
            correctAnswer: { type: Type.STRING, description: "La conjugaison correcte." },
            feedback: { type: Type.STRING, description: "Une règle mnémotechnique courte." },
            fullConjugations: {
              type: Type.OBJECT,
              description: "Tableau complet des conjugaisons pour révision.",
              properties: {
                present: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Liste ordonnée (Je, Tu, Il, Nous, Vous, Ils)" },
                futur: { type: Type.ARRAY, items: { type: Type.STRING } },
                imparfait: { type: Type.ARRAY, items: { type: Type.STRING } },
                passe_compose: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["present", "futur", "imparfait", "passe_compose"]
            }
          },
          required: ["story", "sentence", "verb", "pronoun", "correctAnswer", "feedback", "fullConjugations"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Question;
    } else {
      throw new Error("Réponse vide de l'IA");
    }
  } catch (error) {
    console.error("Erreur Gemini:", error);
    // Fallback data
    return {
      story: "Le réseau magique a un petit hoquet.",
      sentence: "Tu ___ (chanter) quand même !",
      verb: "chanter",
      pronoun: "Tu",
      correctAnswer: "chantes",
      feedback: "Avec 'Tu' au présent, c'est souvent 'es' ou 's'.",
      fullConjugations: {
        present: ["Je chante", "Tu chantes", "Il chante", "Nous chantons", "Vous chantez", "Ils chantent"],
        futur: ["Je chanterai", "Tu chanteras", "Il chantera", "Nous chanterons", "Vous chanterez", "Ils chanteront"],
        imparfait: ["Je chantais", "Tu chantais", "Il chantait", "Nous chantions", "Vous chantiez", "Ils chantaient"],
        passe_compose: ["J'ai chanté", "Tu as chanté", "Il a chanté", "Nous avons chanté", "Vous avez chanté", "Ils ont chanté"]
      }
    };
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Erreur TTS:", error);
    return null;
  }
};