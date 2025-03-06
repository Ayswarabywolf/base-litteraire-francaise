import fetch from 'node-fetch';

async function testGenerateExercise() {
  try {
    const response = await fetch('http://localhost:3001/api/generate-commentary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferences: {
          minLength: 50,
          topic: 'narrateur interne',
          period: 'XIXe siècle'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const exercise = await response.json();
    console.log('Réponse brute de l\'API:', JSON.stringify(exercise, null, 2));
  } catch (error) {
    console.error('Erreur lors du test :', error);
  }
}

testGenerateExercise();
