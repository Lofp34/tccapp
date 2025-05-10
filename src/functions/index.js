const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialisation de l'API Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getGeminiSynthesis = functions.https.onRequest(async (req, res) => {
  // Configuration CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    // Vérification de la méthode HTTP
    if (req.method !== 'POST') {
      throw new Error('Méthode non autorisée');
    }

    const { conversationHistory } = req.body;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      throw new Error('Historique de conversation invalide');
    }

    // Préparation du prompt pour Gemini
    const prompt = `Analysez la conversation suivante selon les principes de la Thérapie Comportementale et Cognitive (TCC).
    Structurez votre réponse selon les éléments suivants :
    - Situation : Décrivez la situation déclenchante
    - Émotions : Liste des émotions ressenties
    - Intensité : Note sur 10
    - Pensées : Pensées automatiques identifiées
    - Degré de Croyance : Pourcentage de conviction
    - Sensations : Sensations corporelles
    - Comportements : Actions ou réactions observées

    Conversation :
    ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;

    // Appel à l'API Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parsing de la réponse
    const synthesis = parseGeminiResponse(text);

    // Envoi de la réponse
    res.status(200).json(synthesis);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'analyse de la conversation',
      details: error.message
    });
  }
});

// Fonction pour parser la réponse de Gemini
function parseGeminiResponse(text) {
  // TODO: Implémenter la logique de parsing selon le format de réponse attendu
  // Cette fonction devra extraire les différentes sections de la réponse
  // et les structurer en JSON
  
  return {
    situation: "À extraire de la réponse",
    emotions: "À extraire de la réponse",
    intensity: "À extraire de la réponse",
    thoughts: "À extraire de la réponse",
    beliefDegree: "À extraire de la réponse",
    sensations: "À extraire de la réponse",
    behaviors: "À extraire de la réponse"
  };
} 