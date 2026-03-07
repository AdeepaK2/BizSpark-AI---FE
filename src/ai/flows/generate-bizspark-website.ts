'use server';
/**
 * @fileOverview A Genkit flow that generates a complete website based on provided business details.
 *
 * - generateBizSparkWebsite - A function that handles the website generation process.
 * - GenerateBizSparkWebsiteInput - The input type for the generateBizSparkWebsite function.
 * - GenerateBizSparkWebsiteOutput - The return type for the generateBizSparkWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBizSparkWebsiteInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  businessCategory: z.string().describe('The category or industry of the business (e.g., "bakery", "consulting", "tech").'),
  businessDescription: z.string().describe('A detailed description of the business, its mission, and what it offers.'),
  logoDataUri:
    z.string()
      .optional()
      .describe(
        "An optional logo for the business, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
  productsAndServices: z.array(z.string()).describe('A list of products or services offered by the business.'),
  websiteTemplate: z.string().describe('The desired aesthetic or template style for the website (e.g., "modern", "minimalist", "corporate", "playful").'),
});
export type GenerateBizSparkWebsiteInput = z.infer<typeof GenerateBizSparkWebsiteInputSchema>;

const GenerateBizSparkWebsiteOutputSchema = z.object({
  websiteHtml: z.string().describe('The full HTML content of the generated responsive website, including DOCTYPE, html, head, and body tags, with inline CSS for styling.'),
  suggestedImprovements: z.string().describe('AI-generated suggestions for further customization or improvements to the generated website.'),
});
export type GenerateBizSparkWebsiteOutput = z.infer<typeof GenerateBizSparkWebsiteOutputSchema>;

export async function generateBizSparkWebsite(input: GenerateBizSparkWebsiteInput): Promise<GenerateBizSparkWebsiteOutput> {
  return generateBizSparkWebsiteFlow(input);
}

const websiteGenerationPrompt = ai.definePrompt({
  name: 'bizsparkWebsiteGenerationPrompt',
  input: {schema: GenerateBizSparkWebsiteInputSchema},
  output: {schema: GenerateBizSparkWebsiteOutputSchema},
  prompt: `You are an expert web designer and content creator for small businesses. Your task is to generate a complete, professional, and responsive single-page website HTML, including all necessary CSS inline within a <style> tag in the <head>.\n\nThe website should adhere to modern SaaS UI design principles, inspired by platforms like Shopify and Wix, featuring a clean interface, rounded elements, and a responsive layout.\n\nHere are the business details:\nBusiness Name: {{{businessName}}}\nBusiness Category: {{{businessCategory}}}\nBusiness Description: {{{businessDescription}}}\nProducts/Services:\n{{#each productsAndServices}}- {{{this}}}\n{{/each}}\nDesired Website Template/Style: {{{websiteTemplate}}}\n\nVisual Design Guidelines:\n- Primary brand color: #6633CC\n- Background color: #F1F0F5\n- Accent color: #677CE4\n- Headline and body font: 'Inter' (use Google Fonts import if necessary, but keep CSS inline)\n- Utilize minimalist, outline-style icons with subtly rounded corners if appropriate for sections (e.g., features).\n\nWebsite Structure Requirements:\n1.  **Header/Navigation**: Include the business name (or logo if provided) and simple navigation links (e.g., Home, Services, About, Contact).\n2.  **Hero Section**: A prominent section with a compelling headline, a brief summary of the business, and a clear call-to-action button (using the accent color).\n3.  **About Us/Description Section**: Elaborate on the business description provided.\n4.  **Products/Services Section**: Clearly list and describe the products or services mentioned. Use cards with rounded corners.\n5.  **Contact Section**: Include a simple contact form (placeholder functionality is fine) and contact information (email, phone, address if implied).\n6.  **Footer**: Include copyright information and possibly social media links.\n\nEnsure the HTML is well-structured, semantic, and uses Tailwind CSS classes for responsiveness if you prefer, or pure CSS for styling within the <style> tag.\nThe output MUST be a JSON object matching the GenerateBizSparkWebsiteOutputSchema.\nThe 'websiteHtml' field should contain the full HTML document, starting with <!DOCTYPE html>.\nIf a logoDataUri is provided, incorporate it into the header.\n{{#if logoDataUri}}\nLogo: {{media url=logoDataUri}}\n{{/if}}\nAfter generating the website HTML, provide a paragraph of "suggestedImprovements" to the user, offering ideas for further customization, content expansion, or features they might add.`,
});

const generateBizSparkWebsiteFlow = ai.defineFlow(
  {
    name: 'generateBizSparkWebsiteFlow',
    inputSchema: GenerateBizSparkWebsiteInputSchema,
    outputSchema: GenerateBizSparkWebsiteOutputSchema,
  },
  async (input) => {
    const {output} = await websiteGenerationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate website content.');
    }
    return output;
  }
);
