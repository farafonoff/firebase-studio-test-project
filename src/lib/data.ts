import type { Word } from './types';

// This file simulates fetching data from a Google Docs table.
// In a real application, you would replace this with a call to the Google Sheets API.
export const words: Word[] = [
  { id: 1, turkish: 'merhaba', russian: 'здравствуйте' },
  { id: 2, turkish: 'teşekkür ederim', russian: 'спасибо' },
  { id: 3, turkish: 'evet', russian: 'да' },
  { id: 4, turkish: 'hayır', russian: 'нет' },
  { id: 5, turkish: 'lütfen', russian: 'пожалуйста' },
  { id: 6, turkish: 'günaydın', russian: 'доброе утро' },
  { id: 7, turkish: 'iyi akşamlar', russian: 'добрый вечер' },
  { id: 8, turkish: 'iyi geceler', russian: 'доброй ночи' },
  { id: 9, turkish: 'nasılsınız?', russian: 'как дела?' },
  { id: 10, turkish: 'ben', russian: 'я' },
  { id: 11, turkish: 'sen', russian: 'ты' },
  { id: 12, turkish: 'su', russian: 'вода' },
  { id: 13, turkish: 'ekmek', russian: 'хлеб' },
  { id: 14, turkish: 'arkadaş', russian: 'друг' },
  { id: 15, turkish: 'aile', russian: 'семья' },
  { id: 16, turkish: 'kitap', russian: 'книга' },
  { id: 17, turkish: 'kedi', russian: 'кошка' },
  { id: 18, turkish: 'köpek', russian: 'собака' },
  { id: 19, turkish: 'ev', russian: 'дом' },
  { id: 20, turkish: 'okul', russian: 'школа' },
];
