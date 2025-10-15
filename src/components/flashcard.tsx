'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { validateUserTranslation } from '@/ai/flows/validate-user-translation';
import type { QuizWord, ValidationResult, QuizLanguage } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, ArrowRight, Loader } from 'lucide-react';

type FlashcardProps = {
  word: QuizWord;
  onNext: (isCorrect: boolean | null) => void;
};

const initialState: ValidationResult = {
  isValid: null,
  feedback: '',
  isSubmitted: false,
};

export default function Flashcard({ word, onNext }: FlashcardProps) {
  const [state, setState] = useState<ValidationResult>(initialState);
  const [isChecking, setIsChecking] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFlipped = state.isSubmitted;

  useEffect(() => {
    if (state.isSubmitted) {
      const nextButton = document.getElementById('next-button');
      nextButton?.focus();
    }
  }, [state.isSubmitted]);
  
  const handleCheckTranslation = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputRef.current) return;
    
    setIsChecking(true);

    const userTranslation = inputRef.current.value;
    const correctTranslation = word[word.answerLanguage];
    const sourceLanguage = word.quizLanguage;
    const targetLanguage = word.answerLanguage;

    if (!userTranslation) {
      setState({
        isValid: false,
        feedback: 'Please enter a translation.',
        isSubmitted: true,
      });
      setIsChecking(false);
      return;
    }
    
    try {
      const result = await validateUserTranslation({
        userTranslation,
        correctTranslation,
        sourceLanguage,
        targetLanguage,
      });
      setState({ ...result, isSubmitted: true });
    } catch (error) {
      console.error(error);
      setState({
        isValid: false,
        feedback: 'Sorry, there was an error validating your answer. Please try again.',
        isSubmitted: true,
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleNext = () => {
    setState(initialState);
    onNext(state.isValid);
  }

  return (
    <div
      className={cn(
        'relative w-full h-[350px] transition-transform duration-700 preserve-3d',
        isFlipped && 'rotate-y-180'
      )}
    >
      {/* Card Front */}
      <div className="absolute w-full h-full backface-hidden">
        <Card className="w-full h-full flex flex-col shadow-xl">
          <CardHeader className="text-center">
            <p className="text-sm text-muted-foreground">Translate the following word into {word.answerLanguage}:</p>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center gap-8">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-center">
              {word[word.quizLanguage]}
            </h2>
            <form onSubmit={handleCheckTranslation} ref={formRef} className="w-full max-w-sm">
              <Label htmlFor="userTranslation" className="sr-only">
                Your Translation
              </Label>
              <Input
                ref={inputRef}
                id="userTranslation"
                name="userTranslation"
                type="text"
                placeholder="Type your answer..."
                className="text-center text-lg h-12"
                autoComplete="off"
                autoFocus
                disabled={isChecking}
              />
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCheckTranslation} className="w-full" disabled={isChecking}>
              {isChecking ? <Loader className="animate-spin" /> : 'Check'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Card Back */}
      <div className="absolute w-full h-full backface-hidden rotate-y-180">
        <Card className={cn(
          "w-full h-full flex flex-col items-center justify-center text-center shadow-xl",
           state.isValid === true && 'border-green-500 bg-green-50',
           state.isValid === false && 'border-red-500 bg-red-50',
           state.isValid === null && 'bg-accent'
        )}>
           <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
              {state.isValid === true && (
                <>
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                  <h3 className="text-2xl font-bold font-headline text-green-700">Correct!</h3>
                </>
              )}
              {state.isValid === false && (
                 <>
                  <XCircle className="h-16 w-16 text-red-500" />
                  <h3 className="text-2xl font-bold font-headline text-red-700">Not quite!</h3>
                </>
              )}
               {state.isValid === null && state.isSubmitted &&(
                 <>
                  <h3 className="text-2xl font-bold font-headline">Error</h3>
                </>
              )}
              <div className='text-muted-foreground'>
                <p><span className='font-semibold'>{word.turkish}</span> means <span className='font-semibold'>{word.russian}</span></p>
              </div>
              <p className={cn(
                "text-sm",
                 state.isValid === true && 'text-green-600',
                 state.isValid === false && 'text-red-600',
              )}>
                {state.feedback}
              </p>
          </CardContent>
           <CardFooter>
              <Button id="next-button" onClick={handleNext} className='mt-4'>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
