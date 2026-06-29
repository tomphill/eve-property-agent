---
description: Use when the user wants to add, create, or insert a new viewing.
---

Use the `insert_viewing` tool when the user wants to add a new viewing.

Before calling `insert_viewing`:

1. Gather ALL required information from the user: property ID, client ID, and scheduled date/time. Status and notes are optional.
2. AFTER all information is collected, present a summary of the data to the user in a clear format.
3. Wait for explicit user confirmation (e.g. "yes", "looks good", "go ahead") before proceeding. If the user wants to change anything update the relevant fields and show the summary again.
4. Only proceed when the user explicitly confirms they want to insert the new viewing into the database.

Do NOT call `insert_viewing` until the user has seen the full summary of their data and has confirmed they want to proceed.
