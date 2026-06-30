import { defineTool } from "eve/tools";
import { z } from "zod";
import { db } from "../../db/index.js";
import { and, eq } from "drizzle-orm";
import { agents, clients } from "../../db/schema.js";

export default defineTool({
  description:
    "Get all active clients for the current agent. Returns a list of clients.",
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

    const activeClients = await db.query.clients.findMany({
      where: and(
        eq(clients.assignedAgentId, agent.id),
        eq(clients.active, true),
      ),
    });

    return activeClients.map((client) => ({
      ...client,
      createdAt: client.createdAt?.toISOString() ?? null,
    }));
  },
});
