import type { Word } from './types';

//
// Instructions:
// 1. Open your Google Sheet.
// 2. Make sure you have two columns: the first for Turkish words, the second for their Russian translations.
// 3. Go to "File" > "Download" > "Comma-separated values (.csv)".
// 4. Open the downloaded .csv file in a text editor.
// 5. Copy the entire content of the file.
// 6. Paste the copied content between the backticks (`) of the `csvData` variable below, replacing the example content.
//
const csvData = `
merhaba,здравствуйте
teşekkür ederim,спасибо
evet,да
hayır,нет
lütfen,пожалуйста
günaydın,доброе утро
iyi akşamlar,добрый вечер
iyi geceler,доброй ночи
nasılsınız?,как дела?
ben,я
sen,ты
su,вода
ekmek,хлеб
arkadaş,друг
aile,семья
kitap,книга
kedi,кошка
köpek,собака
ev,дом
okul,школа
`;

/**
 * Parses the raw CSV data string into an array of Word objects.
 * @param csv The raw CSV string.
 * @returns An array of Word objects.
 */
function parseCsv(csv: string): Word[] {
  const lines = csv.trim().split('\n');
  const words: Word[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const [turkish, russian] = line.split(',');
      if (turkish && russian) {
        words.push({
          id: i + 1,
          turkish: turkish.trim(),
          russian: russian.trim(),
        });
      }
    }
  }
  return words;
}

export const words: Word[] = parseCsv(csvData);
