// Call this via HTTP GET with a URL like:
//     http://localhost:9998/translate?lang=fr&term=hello
//
// This will return a JSON-encoded map, with a single key:
// translation (containing the translated term). It currently
// supports the following languages
//
//    de: German
//    es: Spanish
//    fr: French
//    lv: Latvian
//    mi: Maori
//    sk: Slovak
//    tr: Turkish
//    zu: Zulu

import express, { Express, Request, Response } from 'express';

// Languages and translations
const translations: Record<string, Record<string, string>> = {
  de: {
    hello: 'hallo',
    goodbye: 'auf wiedersehen',
    thanks: 'danke schön',
  },
  es: {
    hello: 'hola',
    goodbye: 'adiós',
    thanks: 'gracias',
  },
  fr: {
    hello: 'bonjour',
    goodbye: 'au revoir',
    thanks: 'merci',
  },
  lv: {
    hello: 'sveiks',
    goodbye: 'ardievu',
    thanks: 'paldies',
  },
  mi: {
    hello: 'kia ora',
    goodbye: 'poroporoaki',
    thanks: 'whakawhetai koe',
  },
  sk: {
    hello: 'ahoj',
    goodbye: 'zbohom',
    thanks: 'ďakujem koe',
  },
  tr: {
    hello: 'merhaba',
    goodbye: 'güle güle',
    thanks: 'teşekkür ederim',
  },
  zu: {
    hello: 'hamba kahle',
    goodbye: 'sawubona',
    thanks: 'ngiyabonga',
  },
};

const app: Express = express();
const port = 9998;

app.get('/translate', (req: Request, res: Response) => {
  const lang = req.query.lang?.toString().toLowerCase();
  const term = req.query.term?.toString();

  if (!lang || !term) {
    res.status(400).send('Missing required "lang" or "term" parameter.');
    return;
  }

  const languageTranslations = translations[lang];
  if (!languageTranslations) {
    console.log(`Unknown language code "${lang}"`);
    res.status(400).send(`Unknown language code "${lang}"`);
    return;
  }

  const translationKey = term.toLowerCase();
  const translation = languageTranslations[translationKey];

  if (!translation) {
    res.status(400).send(`Unable to translate term "${term}" to language "${lang}"`);
    return;
  }

  // If the phrase had an initial uppercase letter, reflect that in the translation
  const firstLetter = term[0];
  const translatedTerm =
    firstLetter.toUpperCase() === firstLetter
      ? translation.charAt(0).toUpperCase() + translation.slice(1)
      : translation;

  console.log(`Translated '${term}' to '${lang}' as '${translatedTerm}'`);
  res.status(200).send(translatedTerm);
});

app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
