import { defineSchedule } from "eve/schedules";
import { db } from "../../db/index.js";
import { and, eq, gte, lt } from "drizzle-orm";
import { agents, clients, properties, viewings } from "../../db/schema.js";
import slack from "../channels/slack.js";

export default defineSchedule({
  cron: "0 9 * * 1-5",
  async run({ receive, waitUntil, appAuth }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeAgents = await db.query.agents.findMany({
      where: eq(agents.active, true),
    });

    for (const agent of activeAgents) {
      if (!agent.slackUserId) continue;

      const todaysViewings = await db
        .select({
          id: viewings.id,
          propertyId: viewings.propertyId,
          clientId: viewings.clientId,
          scheduledAt: viewings.scheduledAt,
          status: viewings.status,
          notes: viewings.notes,
          address: properties.address,
          clientName: clients.name,
        })
        .from(viewings)
        .leftJoin(properties, eq(viewings.propertyId, properties.id))
        .leftJoin(clients, eq(viewings.clientId, clients.id))
        .where(
          and(
            eq(viewings.agentId, agent.id),
            gte(viewings.scheduledAt, today),
            lt(viewings.scheduledAt, tomorrow),
          ),
        );

      waitUntil(
        receive(slack, {
          message: `Format the following data as a Markdown table with columns: Time, Property, Client, Notes. Start with a friendly "Good morning, ${agent.name}! Here are your viewings for today:". Here is the data: 
          ${JSON.stringify(todaysViewings)}`,
          target: { channelId: agent.slackUserId },
          auth: appAuth,
        }),
      );
    }
  },
});
