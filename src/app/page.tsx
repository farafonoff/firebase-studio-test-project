import { shuffle } from 'lodash';
import { getWordsFromSheet } from '@/lib/data';
import type { QuizWord } from '@/lib/types';
import LearningSession from '@/components/learning-session';
import Logo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const words = await getWordsFromSheet();

  if (!words || words.length === 0) {
    return (
       <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 md:p-12">
         <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>
                Could not load words from the Google Sheet. Please check the URL and format.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    If the problem persists, please check the server logs for more details.
                </p>
            </CardContent>
         </Card>
       </main>
    )
  }

  const preparedWords: QuizWord[] = shuffle(words).map((word) => {
    const isTurkishQuestion = Math.random() > 0.5;
    return {
      ...word,
      quizLanguage: isTurkishQuestion ? 'turkish' : 'russian',
      answerLanguage: isTurkishQuestion ? 'russian' : 'turkish',
      familiarity: 0,
    };
  });

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-8 md:p-12">
      <header className="w-full max-w-2xl mb-8 flex items-center gap-4">
        <Logo className="h-10 w-10 text-primary-foreground fill-primary" />
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
          Türkçe Kart
        </h1>
      </header>
      <LearningSession initialWords={preparedWords} />
    </main>
  );
}
