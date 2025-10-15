import {validateUserTranslationFlow} from '@/ai/flows/validate-user-translation';
import {runFlow} from '@genkit-ai/next';

// Securely expose the 'validateUserTranslationFlow' using a Next.js API route.
// The 'runFlow' function from Genkit handles the request and security.
export const POST = runFlow(validateUserTranslationFlow);
