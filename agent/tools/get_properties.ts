import { defineTool } from "eve/tools";
import { z } from "zod";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { agents, properties } from "../../db/schema.js";

export default defineTool({
  description:
    "Get all properties listed by the current agent. Returns a list of properties.",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
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

    const agentProperties = await db.query.properties.findMany({
      where: eq(properties.listingAgentId, agent.id),
    });

    return agentProperties.map((property) => ({
      ...property,
      listedAt: property.listedAt?.toISOString() ?? null,
      soldAt: property.soldAt?.toISOString() ?? null,
    }));
  },
});
