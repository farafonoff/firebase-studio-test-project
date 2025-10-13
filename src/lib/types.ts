export type Word = {
  id: number;
  turkish: string;
  russian: string;
};

export type QuizLanguage = 'turkish' | 'russian';

export type QuizWord = Word & {
  quizLanguage: QuizLanguage;
  answerLanguage: QuizLanguage;
  familiarity: number;
};

export type ValidationResult = {
  isValid: boolean | null;
  feedback: string;
  isSubmitted: boolean;
};
