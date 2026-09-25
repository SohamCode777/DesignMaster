import { ChatGroq } from "@langchain/groq";
import { topicSchema } from "../schemas/topicSchema.js";

const groqModel = new ChatGroq({
    model: process.env.GROQ_MODEL,
    apiKey: process.env.GROQ_API_KEY,
    maxRetries: 0
});

const groqStructuredModel = groqModel.withStructuredOutput(topicSchema);

export { groqStructuredModel };