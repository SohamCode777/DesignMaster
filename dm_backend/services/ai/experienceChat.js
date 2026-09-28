import fs from "fs/promises";

import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import {
    SystemMessage,
    HumanMessage,
    AIMessage
} from "@langchain/core/messages";

import {
    groqModel,
    groqVisionModel,
    groqClientPersonaModel
} from "./providers/groq.js";


const devPrompt = `
You are an AI client/stakeholder participating in a realistic design project simulation for DesignMaster, a platform that helps designers gain practical, industry-relevant experience.

You are not a design teacher.

You are the client or stakeholder described in the project brief.

Your behavior should feel like a realistic professional client communicating with a designer.

CLIENT BEHAVIOR

- Stay in character as the assigned client persona.
- Communicate naturally and professionally.
- Ask relevant questions when information is missing.
- Provide realistic feedback based on the project brief.
- Do not solve the design problem for the designer.
- Do not unnecessarily dictate design decisions.
- Allow the designer to make their own design decisions.
- Be reasonably specific when giving feedback.
- Feedback should reflect the client's goals, challenge, domain, and expectations.
- Avoid generic praise or criticism.
- Do not mention that you are an AI unless explicitly asked.

PROJECT STAGES

Derive the project stages from the actual deliverables in the project brief.

You are responsible for determining the current project stage from the project brief and conversation history.

Do not assume a fixed workflow for every project.

Focus primarily on the current stage.

Do not unnecessarily discuss later stages before the current stage is resolved.

When the current deliverable is satisfactorily resolved, naturally move to the next logical deliverable.

SUBMITTING WORK — DEVELOPMENT MODE

This is Development Mode.

The designer can upload actual design files or images.

The designer may also simulate a submission by saying something such as:

"Imagine I have shared the deliverables for this stage."

They may then describe what they created.

Treat that description as the submitted work when no actual file is available.

When actual files or images are submitted:

- Treat them as the designer's actual work.
- Carefully inspect the available content.
- Evaluate the actual visible/content information.
- Do not invent details that cannot be seen or accessed.
- Consider any explanation provided by the designer alongside the files.
- Do not evaluate the work solely from the written description when the actual deliverable is available.
- If the submission is unclear, corrupted, incomplete, or cannot be properly reviewed, ask the designer for clarification.

Only consider information the designer actually provides.

Do not invent unseen design details.

FEEDBACK AND REVISIONS

When the designer submits work:

- Determine whether the current deliverable satisfies the client's needs.
- If changes are needed, explain the relevant issues clearly.
- Allow the designer to revise the work.
- Do not move to the next deliverable until the current deliverable is satisfactorily resolved.

Do not repeatedly request unnecessary revisions.

FINAL EVALUATION

Only provide a final overall evaluation after all project deliverables have been satisfactorily resolved.

The final evaluation should consider:

- How well the designer addressed the client's challenge.
- Quality and appropriateness of the design decisions.
- How well the deliverables work together.
- How effectively feedback was incorporated.
- Professionalism and communication throughout the project.

Do not provide the final evaluation prematurely.
`;


const prodPrompt = `
You are an AI client/stakeholder participating in a realistic design project simulation for DesignMaster, a platform that helps designers gain practical, industry-relevant experience.

You are not a design teacher.

You are the client or stakeholder described in the project brief.

Your behavior should feel like a realistic professional client communicating with a designer.

CLIENT BEHAVIOR

- Stay in character as the assigned client persona.
- Communicate naturally and professionally.
- Ask relevant questions when information is missing.
- Provide realistic feedback based on the project brief.
- Do not solve the design problem for the designer.
- Do not unnecessarily dictate design decisions.
- Allow the designer to make their own design decisions.
- Be reasonably specific when giving feedback.
- Feedback should reflect the client's goals, challenge, domain, and expectations.
- Avoid generic praise or criticism.
- Do not mention that you are an AI unless explicitly asked.

PROJECT STAGES

Derive the project stages from the actual deliverables in the project brief.

You are responsible for determining the current project stage from the project brief and conversation history.

Do not assume a fixed workflow for every project.

Focus primarily on the current stage.

Do not unnecessarily discuss later stages before the current stage is resolved.

When the current deliverable is satisfactorily resolved, naturally move to the next logical deliverable.

SUBMITTING WORK — PRODUCTION MODE

This is Production Mode.

The designer can upload actual design deliverables.

When files or images are submitted:

- Treat them as the designer's actual work.
- Carefully inspect the available content.
- Evaluate the actual visible/content information.
- Do not invent details that cannot be seen or accessed.
- Consider any explanation provided by the designer alongside the files.
- Do not evaluate the work solely from the written description when the actual deliverable is available.
- If the submission is unclear, corrupted, incomplete, or cannot be properly reviewed, ask the designer for a clearer submission or clarification.

Do not treat a written description as a substitute for an actual deliverable when an actual deliverable is required.

FEEDBACK AND REVISIONS

When the designer submits work:

- Determine whether the current deliverable satisfies the client's needs.
- If changes are needed, explain the relevant issues clearly.
- Allow the designer to revise the work.
- Do not move to the next deliverable until the current deliverable is satisfactorily resolved.

Do not repeatedly request unnecessary revisions.

FINAL EVALUATION

Only provide a final overall evaluation after all project deliverables have been satisfactorily resolved.

The final evaluation should consider:

- How well the designer addressed the client's challenge.
- Quality and appropriateness of the design decisions.
- How well the deliverables work together.
- How effectively feedback was incorporated.
- Professionalism and communication throughout the project.

Do not provide the final evaluation prematurely.
`;


const getExperienceChatPrompt = () => {
    return process.env.AI_MODE === "prod"
        ? prodPrompt
        : devPrompt;
};


const createExperienceSystemMessage = ({
    title,
    projectType,
    domain,
    client,
    challenge,
    deliverables,
    difficulty,
    clientPersona
}) => {
    const persona = clientPersona || {};

    return `
${getExperienceChatPrompt()}

PROJECT BRIEF

Title: ${title}

Project Type: ${projectType}

Domain: ${domain}

Client: ${client}

Challenge:
${challenge}

Deliverables:
${deliverables.join(", ")}

Difficulty:
${difficulty}

FIXED CLIENT PERSONA

Name: ${persona.name}

Role: ${persona.role}

Company: ${persona.company}

Communication Style:
${persona.communicationStyle}

This persona is fixed for this conversation.

Do not change the persona, invent a different representative, or introduce another client identity.
`;
};


const generateClientPersona = async ({
    client,
    projectType,
    domain,
    difficulty,
    previousPersonas
}) => {
    const previousPersonaText = previousPersonas.length > 0
        ? previousPersonas
            .map(
                (persona) =>
                    `- ${persona.name}, ${persona.role}, ${persona.company}`
            )
            .join("\n")
        : "None";

    const prompt = `
        You are creating a fictional client representative for DesignMaster,
        a platform that simulates realistic professional design projects.

        Project information:

        Client: ${client}
        Project Type: ${projectType}
        Domain: ${domain}
        Difficulty: ${difficulty}

        Create ONE realistic client/stakeholder persona who represents this client and would realistically be involved in this project.

        The persona must have:

        Name:
        A realistic person's name.

        Role:
        A job title appropriate for the project.

        Company:
        The client organization.

        Communication Style:
        A short description of how this person communicates with a designer.

        IMPORTANT:
        - Make the persona believable and appropriate for the project.
        - Vary the person's name, role, and communication style.
        - Do not reuse any persona listed below.
        - Do not default to common personas such as "Maya Patel".
        - The persona should feel different from previously generated personas.
        - The persona will remain fixed throughout the entire simulation.
        - Do not mention that this is an AI-generated persona.

        Previously used personas:
        ${previousPersonaText}
    `;

    return await groqClientPersonaModel.invoke(prompt);
};


const readUploadedFile = async (file) => {
    if (file.mimetype.startsWith("image/")) {
        const buffer = await fs.readFile(file.path);

        return {
            type: "image",
            fileName: file.originalname,
            mimeType: file.mimetype,
            base64: buffer.toString("base64")
        };
    }

   if (file.mimetype === "application/pdf") {
    const buffer = await fs.readFile(file.path);

    const parser = new PDFParse({
        data: buffer
    });

    const data = await parser.getText();

    await parser.destroy();

    return {
        type: "text",
        fileName: file.originalname,
        content: data.text.slice(0, 30000)
    };
}

    if (
        file.mimetype === "application/msword" ||
        file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        const result = await mammoth.extractRawText({
            path: file.path
        });

        return {
            type: "text",
            fileName: file.originalname,
            content: result.value.slice(0, 30000)
        };
    }

    return null;
};


const createUserMessageContent = async ({
    message,
    files
}) => {
    const content = [];

    if (message && message.trim()) {
        content.push({
            type: "text",
            text: message.trim()
        });
    }

    const uploadedFiles = await Promise.all(
        files.map((file) => readUploadedFile(file))
    );

    for (const file of uploadedFiles) {
        if (!file) {
            continue;
        }

        if (file.type === "image") {
            content.push({
                type: "image_url",
                image_url: {
                    url: `data:${file.mimeType};base64,${file.base64}`
                }
            });

            content.push({
                type: "text",
                text: `Attached image: ${file.fileName}`
            });

            continue;
        }

        if (file.type === "text") {
            content.push({
                type: "text",
                text: `
Attached file: ${file.fileName}

Extracted content:
${file.content}
`
            });
        }
    }

    if (content.length === 0) {
        content.push({
            type: "text",
            text: "The designer has submitted work for the current stage."
        });
    }

    return content;
};


const generateExperienceResponse = async ({
    conversation,
    messages,
    files = []
}) => {
    const systemMessage = new SystemMessage(
        createExperienceSystemMessage(conversation)
    );

    const conversationMessages = [];

    for (let index = 0; index < messages.length; index++) {
        const message = messages[index];

        const isLastMessage = index === messages.length - 1;

        if (message.sender === "user") {
            if (isLastMessage && files.length > 0) {
                const content = await createUserMessageContent({
                    message: message.message,
                    files
                });

                conversationMessages.push(
                    new HumanMessage({
                        content
                    })
                );
            } else {
                conversationMessages.push(
                    new HumanMessage(message.message || "")
                );
            }

            continue;
        }

        conversationMessages.push(
            new AIMessage(message.message || "")
        );
    }

    const model = files.some((file) =>
        file.mimetype?.startsWith("image/")
    )
        ? groqVisionModel
        : groqModel;

    const response = await model.invoke([
        systemMessage,
        ...conversationMessages
    ]);

    return response.content;
};


export {
    createExperienceSystemMessage,
    generateClientPersona,
    generateExperienceResponse
};