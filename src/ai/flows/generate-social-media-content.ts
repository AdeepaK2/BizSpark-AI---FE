'use server';
/**
 * @fileOverview A Genkit flow for generating social media captions and website content
 * based on new product announcements or business updates for small businesses.
 *
 * - generateSocialMediaContent - A function that handles the content generation process.
 * - GenerateSocialMediaContentInput - The input type for the generateSocialMediaContent function.
 * - GenerateSocialMediaContentOutput - The return type for the generateSocialMediaContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaContentInputSchema = z.object({
  businessName: z.string().describe('The name of the small business.'),
  productName: z.string().describe('The name of the new product or business update.').optional(),
  description: z
    .string()
    .describe('A detailed description of the new product or business update, including key features and benefits.'),
  imageUri: z
    .string()
    .describe(
      "An optional photo of the product/update, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
    .optional(),
  targetAudience: z
    .string()
    .describe('A description of the target audience for this content, if specific.')
    .optional(),
});
export type GenerateSocialMediaContentInput = z.infer<typeof GenerateSocialMediaContentInputSchema>;

const GenerateSocialMediaContentOutputSchema = z.object({
  socialMediaCaption: z
    .string()
    .describe('An engaging and concise social media caption for the new product or update.'),
  websiteContent: z
    .string()
    .describe(
      'A compelling and detailed piece of content suitable for a website update or product page, highlighting features and benefits.'
    ),
  hashtags: z.array(z.string()).describe('A list of relevant hashtags for social media posts.'),
});
export type GenerateSocialMediaContentOutput = z.infer<typeof GenerateSocialMediaContentOutputSchema>;

export async function generateSocialMediaContent(
  input: GenerateSocialMediaContentInput
): Promise<GenerateSocialMediaContentOutput> {
  return generateSocialMediaContentFlow(input);
}

const generateSocialMediaContentPrompt = ai.definePrompt({
  name: 'generateSocialMediaContentPrompt',
  input: {schema: GenerateSocialMediaContentInputSchema},
  output: {schema: GenerateSocialMediaContentOutputSchema},
  prompt: `You are an expert social media and website content strategist for a small business named '{{{businessName}}}'.

Your task is to generate engaging social media captions, relevant hashtags, and compelling website content for a new product or business update.

Here are the details:

Business Name: {{{businessName}}}
Product/Update Name: {{{productName}}}
Description: {{{description}}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}
{{#if imageUri}}Product Image: {{media url=imageUri}}{{/if}}


Guidelines for Social Media Caption:
- Keep it concise and attention-grabbing.
- Use emojis where appropriate to enhance engagement.
- Highlight a key benefit or exciting feature.
- Encourage interaction or a call to action.

Guidelines for Website Content:
- Provide a more detailed overview than the social media caption.
- Expand on features and benefits, and how they solve customer problems.
- Maintain a professional yet approachable tone.
- Structure it for readability (e.g., using paragraphs).

Guidelines for Hashtags:
- Provide 5-10 relevant and popular hashtags.
- Include a mix of broad and niche hashtags.

Generate the content using the information provided.`,
});

const generateSocialMediaContentFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaContentFlow',
    inputSchema: GenerateSocialMediaContentInputSchema,
    outputSchema: GenerateSocialMediaContentOutputSchema,
  },
  async input => {
    const {output} = await generateSocialMediaContentPrompt(input);
    if (!output) {
      throw new Error('Failed to generate social media and website content.');
    }
    return output;
  }
);
