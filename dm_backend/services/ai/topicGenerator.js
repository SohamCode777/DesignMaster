import { geminiStructuredModel } from "./providers/gemini.js";
import { groqStructuredModel } from "./providers/groq.js";


const getAIModel = () => {
    if (process.env.AI_PROVIDER === "gemini") {
        return geminiStructuredModel;
    }

    if (process.env.AI_PROVIDER === "groq") {
        return groqStructuredModel;
    }

    throw new Error(`Unsupported AI provider: ${process.env.AI_PROVIDER}`);
};



const generateTopic = async ({ projectType, domain, difficulty, suggestions}) => {

    const prompt = `
            You are a design brief generator for DesignMaster, a platform that helps designers gain practical, industry-relevant experience through realistic design projects.

            Generate one realistic design brief based on the following selections:

            Project Type: ${projectType}
            Domain: ${domain}
            Difficulty: ${difficulty}

            Create the brief with the following information:

            Title:
            Create a clear, engaging project title.

            Client:
            Create a fictional but believable client, company, or organization relevant to the selected domain. Briefly explain who they are and what they are trying to achieve.

            Challenge:
            Describe the design problem the client wants to solve.

            Explain the client's goals and the problem they are facing, but do not solve the problem for the designer. The brief should leave room for the designer to make their own decisions.

            Deliverables:
            List 2–4 realistic deliverables appropriate for the selected project type and difficulty.

            Difficulty:
            Use the selected difficulty.

            Guidelines:

            - Make the brief feel like a real-world client project rather than an academic assignment.
            - Keep the brief concise and easy to understand.
            - Match the complexity of the brief to the selected difficulty.
            - Do not prescribe the exact solution, visual style, layout, features, user flow, or design decisions unless they are essential to the challenge.
            - Do not unnecessarily specify the target audience, brand colors, typography, number of screens, or technical requirements.
            - Give the designer enough context to begin the project independently, while leaving some information open for clarification.
            - The client and scenario should feel realistic for the selected domain.
            - Deliverables must be appropriate for the selected project type.
            - Avoid repeating the same scenarios or companies across different briefs.
            - Use professional but natural language.

            Additional Suggestions:
            ${suggestions || "None"}
            `;

    const model = getAIModel();

    const response = await model.invoke(prompt);

    return response;
};



export { generateTopic };