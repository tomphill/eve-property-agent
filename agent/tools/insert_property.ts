import { defineTool } from "eve/tools";
import { z } from "zod";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { agents, properties } from "../../db/schema.js";
import { always } from "eve/tools/approval";

export default defineTool({
  description:
    "Insert a new property listing into the database. Returns the created property.",
  inputSchema: z.object({
    address: z.string().min(1),
    postcode: z.string().min(1),
    price: z.number().int().positive(),
    bedrooms: z.number().int().nonnegative(),
    bathrooms: z.number().int().nonnegative(),
    propertyType: z.enum([
      "detached",
      "semi-detached",
      "terraced",
      "flat",
      "bungalow",
      "cottage",
      "other",
    ]),
    status: z.enum(["sold", "available", "under_offer"]),
    description: z.string().optional(),
  }),
  async execute(propertyDetails, ctx) {
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

    const [property] = await db
      .insert(properties)
      .values({
        ...propertyDetails,
        listingAgentId: agent.id,
      })
      .returning();

    return {
      ...property,
      listedAt: property.listedAt?.toISOString() ?? null,
      soldAt: property.soldAt?.toISOString() ?? null,
    };
  },
  approval: always(),
});
