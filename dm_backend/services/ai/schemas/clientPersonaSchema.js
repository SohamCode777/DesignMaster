import { z } from "zod";

const clientPersonaSchema = z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    communicationStyle: z.string()
});

export { clientPersonaSchema };