const { Translate } = require("@google-cloud/translate").v2;
require("dotenv").config();

const translate = new Translate({
  key: process.env.API_KEY2,
});

const detectLanguage = async (text) => {
  try {
    let response = await translate.detect(text);
    hindi = response[0].language;
  } catch (error) {
    console.log("Error at detect lang", error);
  }
};

const translateText = async (text, targetLanguage) => {
  try {
    let [response] = await translate.translate(text, targetLanguage);
    return response;
  } catch (error) {
    console.log("Error at translate text", error);
    return 0;
  }
};

module.exports = { detectLanguage, translateText };
