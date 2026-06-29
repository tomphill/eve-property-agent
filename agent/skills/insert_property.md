---
description: Use when the user wants to add, create, or insert a new property listing.
---

Use the `insert_property` tool when the user wants to add a new property listing.

Before calling `insert_property`:

1. Gather ALL required information from the user: address, postcode, price, bedrooms, bathrooms, property type, and status. Description is optional.
2. AFTER all information is collected, present a summary of the data to the user in a clear format.
3. Wait for explicit user confirmation (e.g. "yes", "looks good", "go ahead") before proceeding. If the user wants to change anything update the relevant fields and show the summary again.
4. Only proceed when the user explicitly confirms they want to insert the new property into the database.

Do NOT call `insert_property` until the user has seen the full summary of their data and has confirmed they want to proceed.
