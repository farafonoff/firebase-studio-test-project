'use client';

import { useState, useMemo, useEffect } from 'react';
import { shuffle } from 'lodash';
import type { QuizWord } from '@/lib/types';
import { getWordsFromSheet } from '@/lib/data';
import Flashcard from '@/components/flashcard';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { CheckCircle, Award, Loader } from 'lucide-react';

export default function LearningSession() {
  const [words, setWords] = useState<QuizWord[]>([]);
  const [initialWords, setInitialWords] = useState<QuizWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWords() {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedWords = await getWordsFromSheet();
        if (fetchedWords.length === 0) {
          setError("No words found. Check your Google Sheet or the URL in the code.");
        } else {
           const preparedWords: QuizWord[] = shuffle(fetchedWords).map((word) => {
            const isTurkishQuestion = Math.random() > 0.5;
            return {
              ...word,
              quizLanguage: isTurkishQuestion ? 'turkish' : 'russian',
              answerLanguage: isTurkishQuestion ? 'russian' : 'turkish',
              familiarity: 0,
            };
          });
          setInitialWords(preparedWords);
          setWords(preparedWords);
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load words. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    loadWords();
  }, []);

  const currentWord = words[currentIndex];
  const isFinished = currentIndex >= words.length;

  const handleNext = (isCorrect: boolean | null) => {
    if (isCorrect) {
      setCorrectStreak((prev) => prev + 1);
      setTotalCorrect((prev) => prev + 1);
      // Increase familiarity for correct answers
      words[currentIndex].familiarity = Math.min(5, words[currentIndex].familiarity + 1);
    } else {
      setCorrectStreak(0);
      // Decrease familiarity for incorrect answers, but not below 0
      words[currentIndex].familiarity = Math.max(0, words[currentIndex].familiarity - 2);
    }
    
    // We want to show the next word in the list without re-sorting,
    // so the user sees all words. Sorting will happen on restart.
    setCurrentIndex((prev) => prev + 1);
  };
  
  const restartSession = () => {
    // Re-shuffle and prepare words from the initial list
    const preparedWords: QuizWord[] = shuffle(initialWords).map((word) => {
        const isTurkishQuestion = Math.random() > 0.5;
        return {
            ...word,
            quizLanguage: isTurkishQuestion ? 'turkish' : 'russian',
            answerLanguage: isTurkishQuestion ? 'russian' : 'turkish',
            familiarity: 0,
        };
    });
    setWords(preparedWords);
    setCurrentIndex(0);
    setCorrectStreak(0);
    setTotalCorrect(0);
  }

  const progress = useMemo(() => {
    if (!words.length) return 0;
    return (currentIndex / words.length) * 100;
  }, [currentIndex, words.length]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Loading Words...</CardTitle>
          <CardDescription>
            Just a moment while we get everything ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
     return (
       <Card className="w-full max-w-md text-center border-destructive">
          <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription className="text-destructive-foreground">
                {error}
              </CardDescription>
          </CardHeader>
       </Card>
    )
  }

  if (isFinished) {
    return (
      <Card className="w-full max-w-2xl text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary rounded-full p-4 w-fit mb-4">
            <Award className="h-12 w-12 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-headline">Session Complete!</CardTitle>
          <CardDescription>Harika iş! (Great job!)</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">You correctly answered <span className="font-bold text-green-600">{totalCorrect}</span> out of {words.length} words.</p>
          <Button onClick={restartSession} className="mt-8">Start a new session</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-4 mb-4">
        <Progress value={progress} className="h-2" />
        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
          {currentIndex + 1} / {words.length}
        </span>
      </div>

      <div className="relative perspective">
        {currentWord && <Flashcard key={currentWord.id + '-' + currentIndex} word={currentWord} onNext={handleNext} />}
      </div>

      {correctStreak > 1 && (
        <div className="flex items-center justify-center mt-4 gap-2 text-green-600 animate-pulse">
          <CheckCircle className="h-5 w-5" />
          <span className="font-bold">{correctStreak} in a row!</span>
        </div>
      )}
    </div>
  );
}
