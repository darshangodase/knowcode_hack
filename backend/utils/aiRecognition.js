const Clarifai = require('clarifai');
const { clarifaiApiKey } = require('../config');

const app = new Clarifai.App({ apiKey: clarifaiApiKey });

const recognizeEWaste = async (imageUrl) => {
  try {
    const response = await app.models.predict(Clarifai.GENERAL_MODEL, imageUrl);
    return response.outputs[0].data.concepts[0].name;
  } catch (err) {
    console.error('AI Recognition Error:', err);
    throw err;
  }
};

module.exports = { recognizeEWaste };