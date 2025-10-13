'use server';

import { validateUserTranslation } from '@/ai/flows/validate-user-translation';
import type { ValidationResult, QuizLanguage } from '@/lib/types';

const initialState: ValidationResult = {
  isValid: null,
  feedback: '',
  isSubmitted: false,
};

export async function checkTranslation(
  prevState: ValidationResult,
  formData: FormData
): Promise<ValidationResult> {
  const userTranslation = formData.get('userTranslation') as string;
  const correctTranslation = formData.get('correctTranslation') as string;
  const sourceLanguage = formData.get('sourceLanguage') as QuizLanguage;
  const targetLanguage = formData.get('targetLanguage') as QuizLanguage;

  if (!userTranslation || !correctTranslation || !sourceLanguage || !targetLanguage) {
    return {
      isValid: false,
      feedback: 'An error occurred. Missing form data.',
      isSubmitted: true,
    };
  }
  
  try {
    const result = await validateUserTranslation({
      userTranslation,
      correctTranslation,
      sourceLanguage,
      targetLanguage,
    });
    
    return { ...result, isSubmitted: true };
  } catch (error) {
    console.error(error);
    return {
      isValid: false,
      feedback: 'Sorry, there was an error validating your answer. Please try again.',
      isSubmitted: true,
    }
  }
}
