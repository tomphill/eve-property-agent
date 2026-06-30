import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  description: "Exa web search and deep research.",
  url: "https://mcp.exa.ai/mcp",
  auth: {
    getToken: async () => ({
      token: process.env.EXA_API_KEY!,
    }),
  },
});
