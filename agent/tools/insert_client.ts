import { defineTool } from "eve/tools";
import { z } from "zod";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { agents, clients } from "../../db/schema.js";
import { always } from "eve/tools/approval";

export default defineTool({
  description:
    "Insert a new client into the database. Returns the created client.",
  inputSchema: z.object({
    name: z.string().min(1),
    contact: z.string().optional(),
    maxPrice: z.number().int().positive().optional(),
    minBedrooms: z.number().int().nonnegative().optional(),
    preferredPostcodes: z.string().array().optional(),
    propertyType: z.enum([
      "detached",
      "semi-detached",
      "terraced",
      "flat",
      "bungalow",
      "cottage",
      "other",
    ]).optional(),
  }),
  async execute(clientDetails, ctx) {
    const slackId = ctx.session.auth.current?.attributes?.user_id as
      | string
      | undefined;

    if (!slackId) {
      throw new Error("Could not get slack id from current session");
    }

    const agent = await db.query.agents.findFirst({
      where: eq(agents.slackUserId, slackId),
    });

    if (!agent) {
      throw new Error(`No user found with slack id: ${slackId}`);
    }

    const [client] = await db
      .insert(clients)
      .values({
        ...clientDetails,
        assignedAgentId: agent.id,
      })
      .returning();

    return {
      ...client,
      createdAt: client.createdAt?.toISOString() ?? null,
    };
  },
  approval: always(),
});
