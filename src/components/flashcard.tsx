'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { checkTranslation } from '@/app/actions';
import type { QuizWord, ValidationResult } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

type FlashcardProps = {
  word: QuizWord;
  onNext: (isCorrect: boolean | null) => void;
};

const initialState: ValidationResult = {
  isValid: null,
  feedback: '',
  isSubmitted: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Checking...' : 'Check'}
    </Button>
  );
}

export default function Flashcard({ word, onNext }: FlashcardProps) {
  const [state, formAction] = useFormState(checkTranslation, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const isFlipped = state.isSubmitted;

  useEffect(() => {
    if(state.isSubmitted){
        // Automatically focus the 'Next' button when the card flips
        const nextButton = document.getElementById('next-button');
        nextButton?.focus();
    }
  }, [state.isSubmitted])

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
            <form action={formAction} ref={formRef} className="w-full max-w-sm">
              <input type="hidden" name="correctTranslation" value={word[word.answerLanguage]} />
              <input type="hidden" name="sourceLanguage" value={word.quizLanguage} />
              <input type="hidden" name="targetLanguage" value={word.answerLanguage} />
              <Label htmlFor="userTranslation" className="sr-only">
                Your Translation
              </Label>
              <Input
                id="userTranslation"
                name="userTranslation"
                type="text"
                placeholder="Type your answer..."
                className="text-center text-lg h-12"
                autoComplete="off"
                autoFocus
              />
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={() => formRef.current?.requestSubmit()} className="w-full">Check</Button>
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
              <Button id="next-button" onClick={() => onNext(state.isValid)} className='mt-4'>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
