'use server';

/**
 * @fileOverview Provides personalized product recommendations based on browsing history and shopping cart items.
 *
 * - getPersonalizedRecommendations - A function that generates product recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  browsingHistory: z
    .array(z.string())
    .describe('A list of product IDs representing the user browsing history.'),
  shoppingCartItems: z
    .array(z.string())
    .describe('A list of product IDs currently in the user shopping cart.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe(
      'A list of product IDs recommended to the user based on their browsing history and shopping cart items.'
    ),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce product recommendation engine. Based on the user's browsing history and items in their shopping cart, recommend products that they might be interested in.

Browsing History: {{#if browsingHistory}}{{#each browsingHistory}}- {{{this}}}{{/each}}{{else}}None{{/if}}
Shopping Cart Items: {{#if shoppingCartItems}}{{#each shoppingCartItems}}- {{{this}}}{{/each}}{{else}}None{{/if}}

Recommended Products:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
