'use server';

/**
 * @fileOverview A flow to validate user translation attempts using an LLM.
 *
 * - validateUserTranslation - A function that validates the user's translation against the correct answer.
 * - ValidateUserTranslationInput - The input type for the validateUserTranslation function.
 * - ValidateUserTranslationOutput - The return type for the validateUserTranslation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateUserTranslationInputSchema = z.object({
  userTranslation: z
    .string()
    .describe('The user provided translation for the given word.'),
  correctTranslation: z.string().describe('The correct translation of the word.'),
  sourceLanguage: z.string().describe('The language of the original word.'),
  targetLanguage: z.string().describe('The language to which the word is to be translated.'),
});
export type ValidateUserTranslationInput = z.infer<typeof ValidateUserTranslationInputSchema>;

const ValidateUserTranslationOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether the user provided translation is valid, accounting for minor spelling errors or synonyms.'
    ),
  feedback: z.string().describe('Helpful feedback on errors or partial matches.'),
});
export type ValidateUserTranslationOutput = z.infer<typeof ValidateUserTranslationOutputSchema>;

export async function validateUserTranslation(
  input: ValidateUserTranslationInput
): Promise<ValidateUserTranslationOutput> {
  return validateUserTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateUserTranslationPrompt',
  input: {schema: ValidateUserTranslationInputSchema},
  output: {schema: ValidateUserTranslationOutputSchema},
  prompt: `You are a language learning assistant, skilled in validating translations.

You will receive a user's translation attempt, the correct translation, the source language, and the target language.

Determine if the user's translation is valid, accounting for minor spelling errors or synonyms.
Provide helpful feedback on errors or partial matches to guide the user.

User's Translation: {{{userTranslation}}}
Correct Translation: {{{correctTranslation}}}
Source Language: {{{sourceLanguage}}}
Target Language: {{{targetLanguage}}}

Output a JSON object with "isValid" (boolean) and "feedback" (string) fields.
`,
});

const validateUserTranslationFlow = ai.defineFlow(
  {
    name: 'validateUserTranslationFlow',
    inputSchema: ValidateUserTranslationInputSchema,
    outputSchema: ValidateUserTranslationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
