import type { Word } from './types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSl3IqkrLUFbfWHF3faJ7sJ8HYFrp1B2nc58kgngXL_02Ego2m7Dewv00bIz9-TtAGLhTATphhCmhRr/pub?gid=0&single=true&output=csv';

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
      // Assuming the format is "turkish,russian"
      const parts = line.split(',');
      if (parts.length >= 2) {
        const turkish = parts[0].trim();
        const russian = parts.slice(1).join(',').trim(); // Handle commas in russian translation
        if (turkish && russian) {
            words.push({
            id: i + 1,
            turkish: turkish.trim(),
            russian: russian.trim(),
            });
        }
      }
    }
  }
  return words;
}

/**
 * Fetches and parses word data from the public Google Sheet CSV URL.
 * @returns A promise that resolves to an array of Word objects.
 */
export async function getWordsFromSheet(): Promise<Word[]> {
    try {
        const response = await fetch(CSV_URL, { 
          next: { revalidate: 60 } // Re-fetch every minute
        }); 
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
        }
        const csvData = await response.text();
        return parseCsv(csvData);
    } catch (error) {
        console.error("Error fetching or parsing sheet data:", error);
        return []; // Return an empty array on error
    }
}
