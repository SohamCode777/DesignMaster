import { z } from "zod";

const topicSchema = z.object({
    title: z.string(),
    projectType: z.string(),
    domain: z.string(),
    client: z.string(),
    challenge: z.string(),
    deliverables: z.array(z.string()),
    difficulty: z.string()
});

export { topicSchema };