import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { topicSchema } from "../schemas/topicSchema.js";

const geminiModel = new ChatGoogleGenerativeAI({
    model: process.env.GEMINI_MODEL,
    apiKey: process.env.GEMINI_API_KEY,
    maxRetries: 0
});

const geminiStructuredModel = geminiModel.withStructuredOutput(topicSchema);

export { geminiStructuredModel };