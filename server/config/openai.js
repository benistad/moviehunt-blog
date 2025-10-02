const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY manquante dans les variables d\'environnement');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = openai;
