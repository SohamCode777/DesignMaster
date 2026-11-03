import { ChatGroq } from "@langchain/groq";

import { topicSchema } from "../schemas/topicSchema.js";
import { clientPersonaSchema } from "../schemas/clientPersonaSchema.js";

const groqModel = new ChatGroq({
    model: process.env.GROQ_MODEL,
    apiKey: process.env.GROQ_API_KEY,
    maxRetries: 0
});

const groqVisionModel = new ChatGroq({
    model: process.env.GROQ_VISION_MODEL,
    apiKey: process.env.GROQ_API_KEY,
    maxRetries: 0
});

const groqStructuredModel = groqModel.withStructuredOutput(topicSchema);

const groqClientPersonaModel =
    groqModel.withStructuredOutput(clientPersonaSchema);

export {
    groqModel,
    groqVisionModel,
    groqStructuredModel,
    groqClientPersonaModel
};