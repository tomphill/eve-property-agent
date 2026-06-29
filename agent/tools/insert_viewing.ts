import { defineTool } from "eve/tools";
import { z } from "zod";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { agents, viewings } from "../../db/schema.js";
import { always } from "eve/tools/approval";

type InsertViewing = typeof viewings.$inferInsert;

export default defineTool({
  description:
    "Insert a new viewing into the database. Returns the created viewing.",
  inputSchema: z.object({
    propertyId: z.number().int().positive(),
    clientId: z.number().int().positive(),
    scheduledAt: z.iso.datetime(),
    status: z
      .enum(["scheduled", "completed", "cancelled", "no_show"])
      .optional(),
    notes: z.string().optional(),
  }),
  async execute(viewingDetails, ctx) {
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

    const values: InsertViewing = {
      propertyId: viewingDetails.propertyId,
      clientId: viewingDetails.clientId,
      scheduledAt: new Date(viewingDetails.scheduledAt),
      agentId: agent.id,
      status: viewingDetails.status,
      notes: viewingDetails.notes,
    };

    const [viewing] = await db.insert(viewings).values(values).returning();

    return {
      ...viewing,
      scheduledAt: viewing.scheduledAt?.toISOString() ?? null,
      createdAt: viewing.createdAt?.toISOString() ?? null,
    };
  },
  approval: always(),
});
