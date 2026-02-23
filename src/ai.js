// import Anthropic from "@anthropic-ai/sdk";
import { InferenceClient } from "@huggingface/inference";
const systemPrompt = `
You are an expert chef.  
The user will provide a list of available ingredients.  
Using only those ingredients (and basic pantry staples like salt, pepper, oil, water), create a detailed recipe.

Requirements:
1. Give the **dish name**.  
2. List **ingredients with measurements**.  
3. Provide **step-by-step cooking instructions**.  
4. Add **cooking time** and **serving size**.  
5. Suggest **optional variations** if applicable.  

Output the recipe strictly in **HTML format** using proper semantic tags.  
Use:  
- <h2> for dish name  
- <ul><li> for ingredients  
- <ol><li> for steps  
- <p> for notes like cooking time, servings, variations  

Now, here are the ingredients:`;

const HUGGING_FACE = import.meta.env.VITE_HUGGING_FACE_API_KEY;

// const anthropic = new Anthropic({
//   apiKey: API_KEY,
// });

// export default async function getRecipeFromChefClaude(ingredientsArr) {
//   const ingredientsString = ingredientsArr.join(",");
//   try {
//     const msg = await anthropic.message.create({
//       model: "claude-sonnet-4-20250514",
//       max_tokens: 1024,
//       system: SYSTEM_PROMPT,
//       messages: [
//         {
//           role: "user",
//           content: `I have ${ingredientsString}. Please recommend recipe i can make!`,
//         },
//       ],
//     });
//   } catch (e) {
//     console.log("error getting data from claude");
//   }

//   return msg.content[0].text;
// }

const hf = new InferenceClient(HUGGING_FACE);

export async function getRecipeFromHuggingFace(ingredientsArr) {
  const ingredientsString = ingredientsArr.join(",");

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `I have ${ingredientsString}` }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // The response structure may differ; inspect it
    const content = response.choices?.[0]?.message?.content;
      console.log(content);

    return content;
  } catch (err) {
    console.log("error getting data from Hugging Face", err);
  }
  return "No reponse returned";
}
