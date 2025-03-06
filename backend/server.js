import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Fonction pour générer un exercice de commentaire
async function generateCommentaryExercise(preferences) {
  const prompt = `Tu es un professeur de littérature française. Crée un exercice de commentaire composé en utilisant EXACTEMENT ce format, sans aucune variation ni texte supplémentaire.

TEXTE:
[Écris ici un extrait littéraire de ${preferences.period} illustrant ${preferences.topic}, d'au moins ${preferences.minLength} lignes]

IDÉE DIRECTRICE:
[Écris ici une phrase qui résume l'axe principal d'analyse]

PLAN:
I. [Titre partie 1]
A. [Sous-partie 1.A]
B. [Sous-partie 1.B]
II. [Titre partie 2]
A. [Sous-partie 2.A]
B. [Sous-partie 2.B]

PROPOSITIONS:
a) [Option 1 pour remplacer la sous-partie 1.B]
b) [Option 2 pour remplacer la sous-partie 1.B]
c) [Option 3 pour remplacer la sous-partie 1.B - la meilleure]
d) [Option 4 pour remplacer la sous-partie 1.B]
e) [Option 5 pour remplacer la sous-partie 1.B]

INDICES:
- [Conseil 1]
- [Conseil 2]
- [Conseil 3]

EXPLICATION:
[Explique pourquoi l'option c) est la meilleure]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un professeur de littérature française. Tu dois générer un exercice en suivant EXACTEMENT le format demandé. Utilise les mots-clés en majuscules (TEXTE:, IDÉE DIRECTRICE:, etc.) et respecte la structure exacte."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    console.log('Réponse brute de l\'API OpenAI:', response);
    
    const exercise = structureExercise(response);
    console.log('Exercice structuré:', JSON.stringify(exercise, null, 2));
    
    return exercise;
  } catch (error) {
    console.error('Erreur OpenAI:', error);
    throw error;
  }
}

// Fonction pour structurer l'exercice généré
function structureExercise(rawResponse) {
  try {
    const sections = rawResponse.split(/\n\s*\n/);
    let exercise = {
      title: "Analyse du narrateur interne",
      text: "",
      mainIdea: "",
      plan: [],
      subpartOptions: [],
      hints: [],
      explanation: ""
    };

    for (const section of sections) {
      const trimmedSection = section.trim();
      
      if (trimmedSection.startsWith('TEXTE:')) {
        exercise.text = trimmedSection.replace('TEXTE:', '').trim();
      }
      else if (trimmedSection.startsWith('IDÉE DIRECTRICE:')) {
        exercise.mainIdea = trimmedSection.replace('IDÉE DIRECTRICE:', '').trim();
      }
      else if (trimmedSection.startsWith('PLAN:')) {
        const planLines = trimmedSection.split('\n').slice(1);
        let currentPart = null;
        
        for (const line of planLines) {
          const trimmedLine = line.trim();
          if (trimmedLine.match(/^I{1,3}\./)) {
            currentPart = {
              title: trimmedLine,
              subparts: []
            };
            exercise.plan.push(currentPart);
          }
          else if (trimmedLine.match(/^[A-C]\./)) {
            currentPart?.subparts.push({
              title: trimmedLine
            });
          }
        }
      }
      else if (trimmedSection.startsWith('PROPOSITIONS:')) {
        const options = trimmedSection
          .replace('PROPOSITIONS:', '')
          .split('\n')
          .filter(line => line.trim().match(/^[a-e]\)/));
        
        exercise.subpartOptions = options.map((option, index) => ({
          title: option.replace(/^[a-e]\)/, '').trim(),
          isCorrect: index === 2
        }));
      }
      else if (trimmedSection.startsWith('INDICES:')) {
        exercise.hints = trimmedSection
          .replace('INDICES:', '')
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-/, '').trim());
      }
      else if (trimmedSection.startsWith('EXPLICATION:')) {
        exercise.explanation = trimmedSection.replace('EXPLICATION:', '').trim();
      }
    }

    // Validation basique
    if (!exercise.text || !exercise.mainIdea || exercise.plan.length === 0) {
      console.error('Exercice invalide:', exercise);
      throw new Error('L\'exercice généré est incomplet ou mal formaté');
    }

    return exercise;
  } catch (error) {
    console.error('Erreur lors de la structuration:', error);
    throw new Error('Impossible de structurer la réponse de l\'API');
  }
}

// Route pour générer un nouvel exercice
app.post('/api/generate-commentary', async (req, res) => {
  try {
    console.log('Requête reçue avec les préférences:', req.body.preferences);
    const { preferences } = req.body;
    
    // Essayer de générer un exercice avec l'API
    try {
      const exercise = await generateCommentaryExercise(preferences);
      console.log('Exercice généré avec succès via l\'API');
      res.json(exercise);
    } catch (apiError) {
      console.error('Erreur lors de la génération via l\'API:', apiError);
      
      // En cas d'erreur, retourner un exercice par défaut
      const defaultExercise = {
        title: "Analyse du narrateur interne dans Madame Bovary",
        text: `Elle se répétait : « J'ai un amant ! un amant ! » se délectant à cette idée comme à celle d'une autre puberté qui lui serait survenue. Elle allait donc posséder enfin ces joies de l'amour, cette fièvre du bonheur dont elle avait désespéré. Elle entrait dans quelque chose de merveilleux où tout serait passion, extase, délire...`,
        mainIdea: "Analyser comment le narrateur interne révèle l'état psychologique d'Emma Bovary",
        plan: [
          {
            title: "I. La révélation d'une transformation intérieure",
            subparts: [
              { title: "A. L'expression d'une joie intense" },
              { title: "B. Le sentiment d'une renaissance" }
            ]
          },
          {
            title: "II. L'anticipation d'un bonheur idéalisé",
            subparts: [
              { title: "A. La projection dans un avenir fantasmé" },
              { title: "B. L'accumulation des sensations espérées" }
            ]
          }
        ],
        subpartOptions: [
          { title: "Une analyse du rythme de la phrase", isCorrect: false },
          { title: "Une étude des temps verbaux", isCorrect: false },
          { title: "Une exploration de la métaphore de la renaissance", isCorrect: true },
          { title: "Un focus sur le champ lexical de l'amour", isCorrect: false },
          { title: "Une analyse des répétitions", isCorrect: false }
        ],
        hints: [
          "Observez l'utilisation du style indirect libre",
          "Analysez la progression des émotions dans le passage",
          "Étudiez les champs lexicaux dominants"
        ],
        explanation: "L'option C est la plus pertinente car la métaphore de la renaissance est centrale dans ce passage, comme le montre l'expression 'une autre puberté'. Cette image traduit parfaitement la transformation psychologique d'Emma et sa perception d'un nouveau départ dans sa vie."
      };
      
      console.log('Retour d\'un exercice par défaut');
      res.json(defaultExercise);
    }
  } catch (error) {
    console.error('Erreur serveur détaillée:', error);
    res.status(500).json({ 
      error: "Erreur lors de la génération de l'exercice",
      details: error.message 
    });
  }
});

// Route pour valider une réponse
app.post('/api/validate-commentary', (req, res) => {
  const { exerciseId, response } = req.body;
  // TODO: Implémenter la validation de la réponse
  res.json({
    isCorrect: true,
    feedback: "Excellent choix ! Cette sous-partie s'intègre parfaitement dans le plan."
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
